-- Smart Fridge / Thalajati
-- Supabase PostgreSQL schema
--
-- Authentication is handled by Supabase Auth (auth.users).
-- Do not add or store a plaintext password in public tables.

begin;

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Shared timestamp helper
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Profiles and per-user settings
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Smart Fridge',
  email text unique,
  gender text check (gender in ('female', 'male')),
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  language text not null default 'ar' check (language in ('ar', 'en')),
  theme text not null default 'light' check (theme in ('light', 'dark', 'system')),
  calorie_goal integer not null default 2000 check (calorie_goal between 500 and 10000),
  water_goal_cups smallint not null default 8 check (water_goal_cups between 1 and 30),
  expiry_reminders boolean not null default true,
  daily_summary_notifications boolean not null default true,
  shopping_note text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Create a profile and default preferences whenever a user signs up through
-- Supabase Auth. The optional name and gender can come from user metadata.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  metadata_name text;
  metadata_gender text;
begin
  metadata_name := nullif(trim(new.raw_user_meta_data ->> 'name'), '');
  metadata_gender := nullif(trim(new.raw_user_meta_data ->> 'gender'), '');

  insert into public.profiles (id, display_name, email, gender)
  values (
    new.id,
    coalesce(metadata_name, 'Smart Fridge'),
    new.email,
    case
      when metadata_gender in ('female', 'male') then metadata_gender
      else null
    end
  )
  on conflict (id) do update
    set email = excluded.email,
        updated_at = timezone('utc', now());

  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Keep the profile email synchronized if the Auth email changes.
create or replace function public.sync_profile_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set email = new.email,
      updated_at = timezone('utc', now())
  where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
  after update of email on auth.users
  for each row
  when (old.email is distinct from new.email)
  execute procedure public.sync_profile_email();

-- ---------------------------------------------------------------------------
-- Smart Fridge contents
-- ---------------------------------------------------------------------------

create table if not exists public.fridge_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  quantity numeric(12, 2) not null default 1 check (quantity >= 0),
  unit text not null default 'unit',
  category text not null default 'other',
  expiry_date date,
  calories_per_unit integer not null default 0 check (calories_per_unit >= 0),
  art_key text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists fridge_items_user_id_idx
  on public.fridge_items (user_id);

create index if not exists fridge_items_expiry_date_idx
  on public.fridge_items (user_id, expiry_date);

-- ---------------------------------------------------------------------------
-- Shopping list
-- ---------------------------------------------------------------------------

create table if not exists public.shopping_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  quantity text not null default '1',
  is_done boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists shopping_items_user_id_idx
  on public.shopping_items (user_id, is_done, created_at);

-- ---------------------------------------------------------------------------
-- Meals and water tracking
-- ---------------------------------------------------------------------------

create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  meal_date date not null default current_date,
  name text not null check (length(trim(name)) > 0),
  meal_time time,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists meals_user_date_idx
  on public.meals (user_id, meal_date, meal_time);

-- One row per user and day. Upsert cups when the user drinks water.
create table if not exists public.daily_water (
  user_id uuid not null references public.profiles(id) on delete cascade,
  entry_date date not null default current_date,
  cups smallint not null default 0 check (cups between 0 and 100),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, entry_date)
);

-- ---------------------------------------------------------------------------
-- Recipe catalog and favorites
-- ---------------------------------------------------------------------------

-- Recipe IDs are text so the existing app IDs (r1, r2, ...) can be retained.
-- Spoonacular or another provider can add rows using its own stable string ID.
create table if not exists public.recipes (
  id text primary key,
  name_ar text not null,
  name_en text not null,
  description_ar text not null default '',
  description_en text not null default '',
  prep_time_minutes integer check (prep_time_minutes is null or prep_time_minutes > 0),
  calories integer not null default 0 check (calories >= 0),
  color text,
  tags text[] not null default '{}'::text[],
  image_url text,
  source text not null default 'local',
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.recipe_favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  recipe_id text not null references public.recipes(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, recipe_id)
);

create index if not exists recipe_favorites_recipe_id_idx
  on public.recipe_favorites (recipe_id);

-- Current built-in recipes from the Smart Fridge UI.
insert into public.recipes (
  id, name_ar, name_en, description_ar, description_en,
  prep_time_minutes, calories, color, tags, source
)
values
  (
    'r1',
    'سلطة الدجاج والحمص',
    'Chicken and hummus salad',
    'طبق خفيف من مكونات ثلاجتك، غني ومقرمش.',
    'A light, crunchy plate made from ingredients in your fridge.',
    20, 410, 'linear-gradient(135deg, #cadb95, #709657)',
    array['غداء', 'غني بالبروتين'],
    'local'
  ),
  (
    'r2',
    'شكشوكة صباحية',
    'Morning shakshuka',
    'طماطم دافئة وبيض مع لمسة كمون شرقية.',
    'Warm tomatoes and eggs with a gentle Eastern spice note.',
    15, 285, 'linear-gradient(135deg, #eeb58b, #ce6547)',
    array['فطور', 'سريع'],
    'local'
  ),
  (
    'r3',
    'توست الجبن والخضار',
    'Cheese and vegetable toast',
    'وجبة سريعة لأيام العمل المزدحمة.',
    'A quick meal for busy workdays.',
    10, 330, 'linear-gradient(135deg, #eed68d, #d0a949)',
    array['خفيف', 'نباتي'],
    'local'
  ),
  (
    'r4',
    'كوب الفواكه المنعش',
    'Refreshing fruit cup',
    'برتقال وتفاح مع زبادي بارد.',
    'Orange and apple with chilled yogurt.',
    8, 205, 'linear-gradient(135deg, #f0b47f, #db725d)',
    array['سناك', 'منعش'],
    'local'
  ),
  (
    'r5',
    'راب الدجاج الأخضر',
    'Green chicken wrap',
    'لفافة عملية من الدجاج والخس والصلصة.',
    'A practical wrap with chicken, lettuce, and sauce.',
    25, 390, 'linear-gradient(135deg, #b4cf9b, #477e62)',
    array['غداء', 'للعمل'],
    'local'
  ),
  (
    'r6',
    'حمص بالليمون',
    'Lemon hummus',
    'طبق جانبي كريمي يرافق كل شيء.',
    'A creamy side dish that goes with everything.',
    12, 240, 'linear-gradient(135deg, #e5d59d, #ad9352)',
    array['جانبي', 'نباتي'],
    'local'
  ),
  (
    'r7',
    'رز ودجاج',
    'Rice and chicken',
    'طبق دافئ ومشبع من الأرز المتبّل وقطع الدجاج الطرية.',
    'A warm, filling dish of seasoned rice and tender chicken.',
    35, 560, 'linear-gradient(135deg, #e8c58e, #a66d42)',
    array['غداء', 'مشبع'],
    'local'
  )
on conflict (id) do update set
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  description_ar = excluded.description_ar,
  description_en = excluded.description_en,
  prep_time_minutes = excluded.prep_time_minutes,
  calories = excluded.calories,
  color = excluded.color,
  tags = excluded.tags,
  source = excluded.source,
  updated_at = timezone('utc', now());

-- ---------------------------------------------------------------------------
-- Optional persisted notifications
-- ---------------------------------------------------------------------------

-- The current UI derives expiry/low-stock/water notifications from live data.
-- This table is available when notifications need to survive reloads or be
-- generated by a scheduled server job.
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  notification_type text not null check (notification_type in ('danger', 'warning', 'success', 'info')),
  icon text,
  title_ar text not null,
  title_en text not null,
  message_ar text not null,
  message_en text not null,
  read_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists notifications_user_unread_idx
  on public.notifications (user_id, read_at, created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists user_preferences_set_updated_at on public.user_preferences;
create trigger user_preferences_set_updated_at
  before update on public.user_preferences
  for each row execute procedure public.set_updated_at();

drop trigger if exists fridge_items_set_updated_at on public.fridge_items;
create trigger fridge_items_set_updated_at
  before update on public.fridge_items
  for each row execute procedure public.set_updated_at();

drop trigger if exists shopping_items_set_updated_at on public.shopping_items;
create trigger shopping_items_set_updated_at
  before update on public.shopping_items
  for each row execute procedure public.set_updated_at();

drop trigger if exists meals_set_updated_at on public.meals;
create trigger meals_set_updated_at
  before update on public.meals
  for each row execute procedure public.set_updated_at();

drop trigger if exists daily_water_set_updated_at on public.daily_water;
create trigger daily_water_set_updated_at
  before update on public.daily_water
  for each row execute procedure public.set_updated_at();

drop trigger if exists recipes_set_updated_at on public.recipes;
create trigger recipes_set_updated_at
  before update on public.recipes
  for each row execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.fridge_items enable row level security;
alter table public.shopping_items enable row level security;
alter table public.meals enable row level security;
alter table public.daily_water enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_favorites enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

drop policy if exists "preferences_select_own" on public.user_preferences;
create policy "preferences_select_own"
  on public.user_preferences for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "preferences_insert_own" on public.user_preferences;
create policy "preferences_insert_own"
  on public.user_preferences for insert
  to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "preferences_update_own" on public.user_preferences;
create policy "preferences_update_own"
  on public.user_preferences for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "fridge_items_all_own" on public.fridge_items;
create policy "fridge_items_all_own"
  on public.fridge_items for all
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "shopping_items_all_own" on public.shopping_items;
create policy "shopping_items_all_own"
  on public.shopping_items for all
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "meals_all_own" on public.meals;
create policy "meals_all_own"
  on public.meals for all
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "daily_water_all_own" on public.daily_water;
create policy "daily_water_all_own"
  on public.daily_water for all
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "recipes_read_active" on public.recipes;
create policy "recipes_read_active"
  on public.recipes for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "favorites_all_own" on public.recipe_favorites;
create policy "favorites_all_own"
  on public.recipe_favorites for all
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "notifications_all_own" on public.notifications;
create policy "notifications_all_own"
  on public.notifications for all
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;

grant select on public.recipes to anon, authenticated;

grant select, update on public.profiles to authenticated;
grant select, insert, update on public.user_preferences to authenticated;
grant select, insert, update, delete on public.fridge_items to authenticated;
grant select, insert, update, delete on public.shopping_items to authenticated;
grant select, insert, update, delete on public.meals to authenticated;
grant select, insert, update, delete on public.daily_water to authenticated;
grant select, insert, update, delete on public.recipe_favorites to authenticated;
grant select, insert, update, delete on public.notifications to authenticated;

commit;
import { type CSSProperties, type Dispatch, type FormEvent, type ReactNode, type SetStateAction, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  Apple, ArrowLeft, Bell, BookOpen, Check, CheckCircle2, ChevronLeft, CircleHelp,
  ClipboardCopy, Droplets, Egg, Fish, Flame, Heart, Home, Leaf, LogOut, Minus,
  Package, Pencil, Plus, Refrigerator, Search, Settings, ShoppingBasket, Sparkles,
  Trash2, UserRound, Utensils, X, Zap,
} from 'lucide-react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import NotFound from '@/pages/not-found';

type FridgeItem = {
  id: string; name: string; quantity: number; unit: string; category: string;
  expiry: string; calories: number; art: string;
};
type ShoppingItem = { id: string; name: string; quantity: string; done: boolean };
type User = { id: string; name: string; email: string; password: string };
type UserData = {
  items: FridgeItem[]; shopping: ShoppingItem[]; note: string; water: number;
  calorieGoal: number; favorites: string[]; reminders: boolean; notifications: boolean;
};
type Recipe = { id: string; name: string; description: string; time: string; calories: number; color: string; tags: string[] };

const queryClient = new QueryClient();
const USERS_KEY = 'smart_fridge_users';
const SESSION_KEY = 'smart_fridge_session';
const DATA_KEY = 'smart_fridge_data';

const defaultItems: FridgeItem[] = [
  { id: 'milk', name: 'حليب طازج', quantity: 1, unit: 'علبة', category: 'ألبان', expiry: '2025-05-28', calories: 122, art: 'milk' },
  { id: 'eggs', name: 'بيض بلدي', quantity: 8, unit: 'حبة', category: 'ألبان', expiry: '2025-06-02', calories: 70, art: 'egg' },
  { id: 'cheese', name: 'جبن أبيض', quantity: 1, unit: 'علبة', category: 'ألبان', expiry: '2025-06-05', calories: 85, art: 'cheese' },
  { id: 'apple', name: 'تفاح أحمر', quantity: 4, unit: 'حبة', category: 'فواكه', expiry: '2025-06-01', calories: 95, art: 'apple' },
  { id: 'orange', name: 'برتقال', quantity: 3, unit: 'حبة', category: 'فواكه', expiry: '2025-06-03', calories: 62, art: 'orange' },
  { id: 'lettuce', name: 'خس طازج', quantity: 1, unit: 'رأس', category: 'خضروات', expiry: '2025-05-30', calories: 17, art: 'leaf' },
  { id: 'tomato', name: 'طماطم كرزية', quantity: 9, unit: 'حبة', category: 'خضروات', expiry: '2025-05-29', calories: 18, art: 'tomato' },
  { id: 'chicken', name: 'صدور دجاج', quantity: 2, unit: 'قطعة', category: 'لحوم', expiry: '2025-05-27', calories: 220, art: 'chicken' },
  { id: 'hummus', name: 'حمص جاهز', quantity: 1, unit: 'علبة', category: 'جاهز', expiry: '2025-06-06', calories: 166, art: 'hummus' },
];
const defaultData: UserData = {
  items: defaultItems, shopping: [
    { id: 's1', name: 'خبز عربي', quantity: 'كيس', done: false },
    { id: 's2', name: 'موز', quantity: '6 حبات', done: false },
    { id: 's3', name: 'زيت زيتون', quantity: 'عبوة', done: true },
  ], note: 'لا تنسَ إخراج الدجاج للتتبيل قبل الغداء.', water: 4, calorieGoal: 2000,
  favorites: ['r1'], reminders: true, notifications: true,
};
const recipes: Recipe[] = [
  { id: 'r1', name: 'سلطة الدجاج والحمص', description: 'طبق خفيف من مكونات ثلاجتك، غني ومقرمش.', time: '20 دقيقة', calories: 410, color: 'linear-gradient(135deg, #cadb95, #709657)', tags: ['غداء', 'غني بالبروتين'] },
  { id: 'r2', name: 'شكشوكة صباحية', description: 'طماطم دافئة وبيض مع لمسة كمون شرقية.', time: '15 دقيقة', calories: 285, color: 'linear-gradient(135deg, #eeb58b, #ce6547)', tags: ['فطور', 'سريع'] },
  { id: 'r3', name: 'توست الجبن والخضار', description: 'وجبة سريعة لأيام العمل المزدحمة.', time: '10 دقائق', calories: 330, color: 'linear-gradient(135deg, #eed68d, #d0a949)', tags: ['خفيف', 'نباتي'] },
  { id: 'r4', name: 'كوب الفواكه المنعش', description: 'برتقال وتفاح مع زبادي بارد.', time: '8 دقائق', calories: 205, color: 'linear-gradient(135deg, #f0b47f, #db725d)', tags: ['سناك', 'منعش'] },
  { id: 'r5', name: 'راب الدجاج الأخضر', description: 'لفافة عملية من الدجاج والخس والصلصة.', time: '25 دقيقة', calories: 390, color: 'linear-gradient(135deg, #b4cf9b, #477e62)', tags: ['غداء', 'للعمل'] },
  { id: 'r6', name: 'حمص بالليمون', description: 'طبق جانبي كريمي يرافق كل شيء.', time: '12 دقيقة', calories: 240, color: 'linear-gradient(135deg, #e5d59d, #ad9352)', tags: ['جانبي', 'نباتي'] },
];

function loadData(userId: string): UserData {
  try {
    const stored = JSON.parse(localStorage.getItem(DATA_KEY) || '{}');
    return stored[userId] ? { ...defaultData, ...stored[userId] } : { ...defaultData, items: defaultItems.map(item => ({ ...item })) };
  } catch { return { ...defaultData, items: defaultItems.map(item => ({ ...item })) }; }
}
function saveData(userId: string, data: UserData) {
  const stored = JSON.parse(localStorage.getItem(DATA_KEY) || '{}');
  localStorage.setItem(DATA_KEY, JSON.stringify({ ...stored, [userId]: data }));
}
function initials(name: string) { return name.trim().slice(0, 1) || 'ت'; }
function daysUntil(date: string) {
  return Math.ceil((new Date(date).getTime() - new Date().setHours(0, 0, 0, 0)) / 86400000);
}
function formatArabicDate() {
  return new Intl.DateTimeFormat('ar-SA', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
}
function flash(setNotice: (value: string) => void, text: string) {
  setNotice(text); window.setTimeout(() => setNotice(''), 2400);
}

function FoodArt({ item, size = 40 }: { item?: FridgeItem; size?: number }) {
  const art = item?.art || 'apple';
  const emoji = art === 'milk' ? '🥛' : art === 'egg' ? '🥚' : art === 'cheese' ? '🧀' : art === 'apple' ? '🍎'
    : art === 'orange' ? '🍊' : art === 'leaf' ? '🥦' : art === 'tomato' ? '🍅' : art === 'chicken' ? '🍗'
    : art === 'hummus' ? '🥫' : art === 'package' ? '🧃' : '🥕';
  const style = art === 'apple' ? { background: 'hsl(6 58% 58% / .2)', color: 'hsl(6 58% 48%)' }
    : art === 'orange' ? { background: 'hsl(35 71% 65% / .32)', color: 'hsl(32 69% 44%)' }
    : art === 'leaf' ? { background: 'hsl(152 44% 29% / .16)', color: 'hsl(152 44% 29%)' }
    : art === 'tomato' ? { background: 'hsl(4 65% 53% / .18)', color: 'hsl(4 65% 48%)' }
    : art === 'chicken' ? { background: 'hsl(274 35% 61% / .2)', color: 'hsl(274 35% 48%)' }
    : art === 'egg' ? { background: 'hsl(39 43% 94%)', color: 'hsl(34 52% 40%)' }
    : { background: 'hsl(196 48% 51% / .17)', color: 'hsl(196 48% 40%)' };
  return <div className="food-art" style={{ ...style, width: size, height: size }}><span className="food-emoji" aria-hidden="true">{emoji}</span></div>;
}

function AuthScreen({ onLogin }: { onLogin: (user: User) => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const submit = (event: FormEvent) => {
    event.preventDefault(); setError('');
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (mode === 'register') {
      if (!name.trim() || !email.trim() || password.length < 4) { setError('أكملي البيانات، وكلمة المرور 4 أحرف على الأقل.'); return; }
      if (users.some(user => user.email === email.trim().toLowerCase())) { setError('هذا البريد مسجل مسبقاً.'); return; }
      const user = { id: `u-${Date.now()}`, name: name.trim(), email: email.trim().toLowerCase(), password };
      localStorage.setItem(USERS_KEY, JSON.stringify([...users, user])); onLogin(user);
    } else {
      const user = users.find(candidate => candidate.email === email.trim().toLowerCase() && candidate.password === password);
      if (!user) { setError('البريد أو كلمة المرور غير صحيحة.'); return; }
      onLogin(user);
    }
  };
  const demo = () => {
    const user: User = { id: 'demo-user', name: 'سارة', email: 'demo@talajati.local', password: 'demo' };
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (!users.some(item => item.id === user.id)) localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
    onLogin(user);
  };
  return <main className="auth-shell">
    <section className="auth-art">
      <div className="auth-copy">
        <div className="brand"><div className="brand-mark"><Refrigerator size={25} /></div><div><h1>تلاجتي</h1><small>رفيق البيت الطازج</small></div></div>
        <h1>كل ما في ثلاجتك،<br /><span style={{ color: 'hsl(35 71% 65%)' }}>في بالك.</span></h1>
        <p>مساحة شخصية دافئة تساعدك على معرفة طعامك، اختيار وجبتك، والعناية بيومك بهدوء.</p>
        <div className="auth-orbit"><div className="orbit-plate"><Apple /></div><Leaf className="orbit-leaf" size={42} /><Sparkles size={27} color="hsl(35 71% 65%)" /></div>
      </div>
    </section>
    <section className="auth-form-wrap">
      <form className="auth-form" onSubmit={submit}>
        <div className="auth-tabs"><button type="button" className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')} data-testid="tab-login">تسجيل الدخول</button><button type="button" className={`auth-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => setMode('register')} data-testid="tab-register">حساب جديد</button></div>
        <h2>{mode === 'login' ? 'أهلاً بعودتك' : 'لنبدأ معاً'}</h2>
        <p>{mode === 'login' ? 'ثلاجتك رتبت لك شيئاً جميلاً اليوم.' : 'أنشئي مساحتك الخاصة في دقائق.'}</p>
        {mode === 'register' && <div className="field"><label htmlFor="auth-name">الاسم</label><input id="auth-name" data-testid="input-auth-name" value={name} onChange={e => setName(e.target.value)} placeholder="مثال: سارة" /></div>}
        <div className="field"><label htmlFor="auth-email">البريد الإلكتروني</label><input id="auth-email" type="email" data-testid="input-auth-email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" /></div>
        <div className="field"><label htmlFor="auth-password">كلمة المرور</label><input id="auth-password" type="password" data-testid="input-auth-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" /></div>
        {error && <p style={{ color: 'hsl(var(--destructive))', fontSize: 12, margin: '3px 0' }} data-testid="status-auth-error">{error}</p>}
        <button className="primary-btn" type="submit" data-testid="button-auth-submit">{mode === 'login' ? 'دخول إلى تلاجتي' : 'إنشاء مساحتي'}<ArrowLeft size={17} /></button>
        <button className="secondary-btn" type="button" style={{ width: '100%', marginTop: 10 }} onClick={demo} data-testid="button-demo-login">تجربة تلاجتي الآن</button>
        <div className="auth-note">بياناتك تبقى في هذا الجهاز، ومساحتك لك وحدك.</div>
      </form>
    </section>
  </main>;
}

const navItems = [
  { href: '/', label: 'تلاجتي', icon: Home },
  { href: '/meals', label: 'وجباتي', icon: Utensils },
  { href: '/daily-analysis', label: 'تحليل يومي', icon: Flame },
  { href: '/shopping', label: 'قائمة التسوق', icon: ShoppingBasket },
  { href: '/recipes', label: 'وصفات مقترحة', icon: BookOpen },
  { href: '/favorites', label: 'المفضلة', icon: Heart },
];

function AppShell({ user, children, onLogout }: { user: User; children: ReactNode; onLogout: () => void }) {
  const [location] = useLocation();
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Refrigerator size={24} /></div><div className="brand-copy"><h1>تلاجتي</h1><small>رفيق البيت الطازج</small></div></div>
      <nav className="nav-list" aria-label="التنقل الرئيسي">
        {navItems.map(item => { const Icon = item.icon; return <Link key={item.href} href={item.href} className={`nav-item ${location === item.href ? 'active' : ''}`} data-testid={`link-nav-${item.label}`}><Icon size={18} /><span className="nav-label">{item.label}</span></Link>; })}
      </nav>
      <div className="sidebar-footer">
        <Link href="/settings" className={`nav-item ${location === '/settings' ? 'active' : ''}`} data-testid="link-nav-settings"><Settings size={18} /><span className="nav-label">الإعدادات</span></Link>
        <div className="profile-mini"><div className="avatar">{initials(user.name)}</div><div><strong>{user.name}</strong><span>مساحتي الشخصية</span></div></div>
        <button className="logout-btn" onClick={onLogout} data-testid="button-logout"><LogOut size={15} /><span>تسجيل الخروج</span></button>
      </div>
    </aside>
    <div style={{ minWidth: 0 }}>
      <header className="mobile-topbar"><div className="brand"><div className="brand-mark"><Refrigerator size={19} /></div><h1>تلاجتي</h1></div><button className="icon-btn" onClick={onLogout} data-testid="button-mobile-logout"><LogOut size={17} /></button></header>
      {children}
    </div>
  </div>;
}

function PageHeading({ title, description, action, eyebrow = 'مساحتي اليومية' }: { title: string; description?: string; action?: ReactNode; eyebrow?: string }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>;
}

function AddFoodModal({ onClose, onAdd }: { onClose: () => void; onAdd: (item: Omit<FridgeItem, 'id'>) => void }) {
  const [form, setForm] = useState({ name: '', quantity: '1', unit: 'حبة', category: 'خضروات', expiry: '', calories: '80' });
  const update = (key: keyof typeof form, value: string) => setForm(prev => ({ ...prev, [key]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.expiry) return;
    const art = form.category === 'فواكه' ? 'apple' : form.category === 'ألبان' ? 'milk' : form.category === 'لحوم' ? 'chicken' : form.category === 'خضروات' ? 'leaf' : 'package';
    onAdd({ name: form.name.trim(), quantity: Math.max(1, Number(form.quantity) || 1), unit: form.unit, category: form.category, expiry: form.expiry, calories: Math.max(0, Number(form.calories) || 0), art });
    onClose();
  };
  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-head"><div><h2>إضافة إلى الثلاجة</h2><p>شيء جديد يستحق مكاناً في مساحتك.</p></div><button className="icon-btn" onClick={onClose} data-testid="button-close-add-food"><X size={18} /></button></div>
      <form className="form-grid" onSubmit={submit}>
        <div className="field full"><label htmlFor="food-name">اسم الطعام</label><input autoFocus id="food-name" data-testid="input-food-name" value={form.name} onChange={e => update('name', e.target.value)} placeholder="مثال: زبادي يوناني" /></div>
        <div className="field"><label htmlFor="food-quantity">الكمية</label><input id="food-quantity" type="number" min="1" data-testid="input-food-quantity" value={form.quantity} onChange={e => update('quantity', e.target.value)} /></div>
        <div className="field"><label htmlFor="food-unit">الوحدة</label><select id="food-unit" data-testid="select-food-unit" value={form.unit} onChange={e => update('unit', e.target.value)}><option>حبة</option><option>علبة</option><option>كيس</option><option>قطعة</option><option>رأس</option><option>عبوة</option></select></div>
        <div className="field"><label htmlFor="food-category">القسم</label><select id="food-category" data-testid="select-food-category" value={form.category} onChange={e => update('category', e.target.value)}><option>خضروات</option><option>فواكه</option><option>ألبان</option><option>لحوم</option><option>جاهز</option><option>مشروبات</option></select></div>
        <div className="field"><label htmlFor="food-expiry">تاريخ الانتهاء</label><input id="food-expiry" type="date" data-testid="input-food-expiry" value={form.expiry} onChange={e => update('expiry', e.target.value)} /></div>
        <div className="calorie-preview"><span>السعرات لكل وحدة</span><strong>{Number(form.calories) || 0} <small>سعرة</small></strong></div>
        <div className="field full"><label htmlFor="food-calories">السعرات الحرارية</label><input id="food-calories" type="number" min="0" data-testid="input-food-calories" value={form.calories} onChange={e => update('calories', e.target.value)} /></div>
        <div className="form-actions"><button className="primary-btn" type="submit" data-testid="button-save-food"><Plus size={17} />حفظ الطعام</button><button className="secondary-btn" type="button" onClick={onClose} data-testid="button-cancel-food">إلغاء</button></div>
      </form>
    </div>
  </div>;
}

function FridgeVisual({ items, selected, onSelect }: { items: FridgeItem[]; selected: FridgeItem | undefined; onSelect: (item: FridgeItem) => void }) {
  const categories = [
    { name: 'البروتينات', match: 'لحوم', tint: 'meat' },
    { name: 'الخضروات', match: 'خضروات', tint: 'greens' },
    { name: 'الفواكه', match: 'فواكه', tint: 'fruit' },
    { name: 'الألبان والمشروبات', match: 'ألبان', tint: 'dairy' },
  ];
  const doorItems = items.filter(item => ['مشروبات', 'جاهز'].includes(item.category));
  return <div className="fridge-card">
    <div className="fridge-temperature"><span><Refrigerator size={15} /> الثلاجة</span><strong>4°C</strong><span><Zap size={14} /> الفريزر</span><strong>-18°C</strong></div>
    <div className="fridge-body">
      <div className="fridge-door">
        <span className="fridge-door-handle" />
        <div className="door-section"><h4>الألبان والمشروبات</h4>{items.filter(item => item.category === 'ألبان').slice(0, 3).map(item => <button key={item.id} className="door-food" onClick={() => onSelect(item)} data-testid={`button-food-door-${item.id}`}><FoodArt item={item} size={30} /><span>{item.name}</span></button>)}</div>
        <div className="door-section"><h4>المشروبات والعصائر</h4>{doorItems.slice(0, 3).map(item => <button key={item.id} className="door-food" onClick={() => onSelect(item)} data-testid={`button-food-door-${item.id}`}><FoodArt item={item} size={30} /><span>{item.name}</span></button>)}</div>
        <div className="door-section door-note"><span>📝</span><span>لا تنسَ شراء<br />العسل</span></div>
      </div>
      <div className="fridge-cabinet">
        <div className="fridge-glow" />
        <div className="cabinet-shelves">{categories.map(category => {
          const categoryItems = items.filter(item => item.category === category.match).slice(0, 5);
          return <div className={`cabinet-shelf ${category.tint}`} key={category.name}>
            <div className="shelf-title">{category.name}</div>
            <div className="shelf-items">{categoryItems.map(item => <button key={item.id} className={`food-badge ${selected?.id === item.id ? 'selected' : ''}`} onClick={() => onSelect(item)} data-testid={`button-food-${item.id}`}><FoodArt item={item} size={44} />{daysUntil(item.expiry) <= 2 && <i className="food-dot" />}<span>{item.name}</span><small>{item.quantity} {item.unit}</small></button>)}{!categoryItems.length && <span className="muted shelf-empty">أضيفي صنفاً جديداً</span>}</div>
          </div>;
        })}</div>
        <div className="freezer-section"><div className="shelf-title">الفريزر</div><div className="freezer-tray"><div /><div /><div /></div></div>
      </div>
    </div>
  </div>;
}

function Dashboard({ userName, data, setData, onAdd, setNotice }: { userName: string; data: UserData; setData: Dispatch<SetStateAction<UserData>>; onAdd: () => void; setNotice: (value: string) => void }) {
  const [selectedId, setSelectedId] = useState(data.items[0]?.id);
  const selected = data.items.find(item => item.id === selectedId) || data.items[0];
  const totalCalories = data.items.reduce((sum, item) => sum + item.calories * item.quantity, 0);
  const consume = () => {
    if (!selected) return;
    setData(prev => ({ ...prev, items: prev.items.map(item => item.id === selected.id ? { ...item, quantity: item.quantity - 1 } : item).filter(item => item.quantity > 0) }));
    flash(setNotice, `تم تسجيل استهلاك ${selected.name}`);
  };
  const editSelected = () => {
    if (!selected) return;
    const quantity = window.prompt('عدّلي الكمية', String(selected.quantity));
    if (quantity !== null && Number(quantity) > 0) setData(prev => ({ ...prev, items: prev.items.map(item => item.id === selected.id ? { ...item, quantity: Number(quantity) } : item) }));
  };
  const percentage = Math.min(100, Math.round(totalCalories / data.calorieGoal * 100));
  return <main className="app-main dashboard-main">
    <div className="dashboard-topbar">
      <div className="dashboard-greeting"><span>مساء الخير،</span><strong>{userName}</strong><ChevronLeft size={15} /></div>
      <div className="dashboard-stat"><Flame size={21} /><div><small>هدفك اليومي</small><strong>{data.calorieGoal.toLocaleString('ar-SA')} سعرة</strong></div></div>
      <div className="dashboard-stat"><div className="mini-ring" style={{ '--ring-progress': `${percentage}%` } as CSSProperties}><strong>{percentage}%</strong></div><div><small>استهلاكك اليوم</small><strong>{totalCalories.toLocaleString('ar-SA')} سعرة</strong></div></div>
      <button className="topbar-bell icon-btn" aria-label="التنبيهات"><Bell size={20} /></button>
    </div>
    <div className="reference-heading"><div><span className="eyebrow">مساحتي اليومية</span><h2>ثلاجتك جاهزة ليوم ألذ</h2></div><span className="date-chip" data-testid="text-current-date">{formatArabicDate()}</span></div>
    <div className="reference-dashboard">
      <section className="reference-fridge"><FridgeVisual items={data.items} selected={selected} onSelect={item => setSelectedId(item.id)} /></section>
      <aside className="reference-rail">
        <div className="item-detail-panel card card-pad"><div className="rail-title"><span>تفاصيل العنصر</span><X size={15} /></div>{selected ? <><div className="detail-hero"><FoodArt item={selected} size={92} /><h3>{selected.name}</h3><span>{selected.quantity} {selected.unit}</span></div><div className="detail-stats"><div><small>تاريخ الانتهاء</small><strong>{new Date(selected.expiry).toLocaleDateString('ar-SA')}</strong></div><div><small>إجمالي السعرات</small><strong>{selected.calories * selected.quantity} سعرة</strong></div><div><small>السعرات للوحدة</small><strong>{selected.calories} سعرة</strong></div></div><div className="detail-actions"><button className="primary-btn" onClick={consume} data-testid="button-consume-food"><Check size={16} />استهلكت</button><button className="secondary-btn" onClick={editSelected} data-testid="button-edit-selected"><Pencil size={15} />تعديل</button><button className="icon-btn" onClick={onAdd} data-testid="button-add-related"><Plus size={17} /></button></div></> : <div className="empty-state">الثلاجة فارغة</div>}</div>
        <div className="shopping-panel card card-pad"><div className="rail-title"><span><ShoppingBasket size={17} /> قائمة التسوق <b>{data.shopping.filter(item => !item.done).length}</b></span><Link href="/shopping"><ChevronLeft size={16} /></Link></div><ShoppingPreview data={data} setData={setData} /><Link href="/shopping" className="export-list"><ClipboardCopy size={15} /> تصدير القائمة</Link></div>
      </aside>
    </div>
    <div className="dashboard-footer">
      <div className="footer-stat water-stat"><Droplets size={25} /><div><small>اشربي الماء</small><strong>{data.water} / 8 أكواب</strong><div className="footer-progress"><i style={{ width: `${data.water / 8 * 100}%` }} /></div></div></div>
      <div className="footer-stat"><Flame size={24} /><div><small>السعرات المتبقية</small><strong>{Math.max(0, data.calorieGoal - totalCalories).toLocaleString('ar-SA')} سعرة</strong></div><div className="mini-ring small" style={{ '--ring-progress': `${percentage}%` } as CSSProperties}><strong>{percentage}%</strong></div></div>
      <div className="macro-stat"><small>توزيع المغذيات</small><div className="macro-lines"><span><i className="macro-protein" />بروتين <b>35%</b></span><span><i className="macro-carb" />كربوهيدرات <b>40%</b></span><span><i className="macro-fat" />دهون <b>25%</b></span></div></div>
      <div className="health-tip"><Leaf size={20} /><div><small>نصيحة اليوم</small><strong>تناولي الخضروات في كل وجبة<br />للحصول على صحة أفضل.</strong></div></div>
      <button className="floating-add" onClick={onAdd} data-testid="button-add-food-dashboard"><Plus size={26} /><span>أضيفي طعام جديد</span></button>
    </div>
  </main>;
}

function ShoppingPreview({ data, setData }: { data: UserData; setData: Dispatch<SetStateAction<UserData>> }) {
  const visible = data.shopping.slice(0, 4);
  return <div className="shopping-list">{visible.length ? visible.map(item => <div className={`shopping-item ${item.done ? 'done' : ''}`} key={item.id}><input type="checkbox" checked={item.done} onChange={() => setData(prev => ({ ...prev, shopping: prev.shopping.map(row => row.id === item.id ? { ...row, done: !row.done } : row) }))} data-testid={`checkbox-shopping-${item.id}`} /><label>{item.name}</label><span className="item-quantity">{item.quantity}</span></div>) : <div className="empty-state" style={{ padding: 20 }}><ShoppingBasket size={23} /><strong>قائمتك فارغة</strong><span>أضيفي ما ينقصك.</span></div>}</div>;
}

function RecipeCard({ recipe, favorite, onFavorite, compact = false }: { recipe: Recipe; favorite: boolean; onFavorite: () => void; compact?: boolean }) {
  return <article className={`recipe-card ${compact ? 'recipe-compact' : ''}`}><div className="recipe-visual" style={{ background: recipe.color }}><span>{recipe.tags[0]}</span><button className="icon-btn" style={{ marginRight: 'auto', position: 'relative', zIndex: 2, color: favorite ? 'hsl(var(--destructive))' : undefined }} onClick={onFavorite} data-testid={`button-favorite-${recipe.id}`} aria-label="إضافة للمفضلة"><Heart size={16} fill={favorite ? 'currentColor' : 'none'} /></button></div><div className="recipe-body"><h3>{recipe.name}</h3><p>{recipe.description}</p><div className="recipe-meta"><span>{recipe.time}</span><span>{recipe.calories} سعرة</span></div></div></article>;
}

function MealsPage({ data, setData, setNotice }: { data: UserData; setData: Dispatch<SetStateAction<UserData>>; setNotice: (v: string) => void }) {
  const [meal, setMeal] = useState('الفطور'); const [planned, setPlanned] = useState<{id: string; title: string; time: string; recipe: string}[]>([
    { id: 'm1', title: 'فطور خفيف', time: '08:00', recipe: 'بيض بلدي مع خضار' }, { id: 'm2', title: 'غداء اليوم', time: '13:30', recipe: 'سلطة الدجاج والحمص' },
  ]);
  const suggestions = meal === 'الفطور' ? ['بيض بلدي مع خضار', 'توست الجبن والخضار'] : meal === 'الغداء' ? ['سلطة الدجاج والحمص', 'راب الدجاج الأخضر'] : ['كوب الفواكه المنعش', 'حمص بالليمون'];
  const addMeal = () => { setPlanned(prev => [...prev, { id: `m-${Date.now()}`, title: meal, time: meal === 'العشاء' ? '20:00' : '16:00', recipe: suggestions[0] }]); flash(setNotice, 'أضيفت الوجبة إلى يومك'); };
  return <main className="app-main"><PageHeading title="وجباتي" description="خطة مرنة، تترك مساحة لما يشتهيه يومك." action={<button className="primary-btn" onClick={addMeal} data-testid="button-add-meal"><Plus size={17} />إضافة وجبة</button>} /><div className="card card-pad"><div className="toolbar">{['الفطور', 'الغداء', 'العشاء', 'سناك'].map(tab => <button key={tab} className={meal === tab ? 'primary-btn' : 'secondary-btn'} onClick={() => setMeal(tab)} data-testid={`button-meal-tab-${tab}`}>{tab}</button>)}</div><div className="recipe-grid">{suggestions.map(name => { const recipe = recipes.find(item => item.name === name) || recipes[0]; return <RecipeCard key={recipe.id} recipe={recipe} favorite={data.favorites.includes(recipe.id)} onFavorite={() => setData(prev => ({ ...prev, favorites: prev.favorites.includes(recipe.id) ? prev.favorites.filter(id => id !== recipe.id) : [...prev.favorites, recipe.id] }))} />; })}</div></div><div className="card card-pad" style={{ marginTop: 21 }}><div className="card-title"><div><h3>خطة اليوم</h3><p>تعديلاتك محفوظة على هذا الجهاز</p></div><span className="status-pill">{planned.length} وجبات</span></div><div className="table-list">{planned.map(item => <div className="data-row" key={item.id}><strong><Utensils size={15} style={{ verticalAlign: 'middle', marginLeft: 7, color: 'hsl(var(--primary))' }} />{item.title}</strong><span>{item.recipe}</span><span>{item.time}</span><button className="icon-btn" onClick={() => setPlanned(prev => prev.filter(row => row.id !== item.id))} data-testid={`button-remove-meal-${item.id}`}><Trash2 size={15} /></button></div>)}</div></div></main>;
}

function DailyAnalysis({ data }: { data: UserData }) {
  const total = data.items.reduce((sum, item) => sum + item.calories * item.quantity, 0); const goal = data.calorieGoal;
  const bars = [42, 58, 36, 72, 64, Math.min(92, total / goal * 100), 28];
  return <main className="app-main"><PageHeading title="تحليل يومي" description="نظرة هادئة على اختياراتك، بدون أحكام." action={<div className="date-chip">{formatArabicDate()}</div>} /><div className="dashboard-grid"><div className="card card-pad"><div className="card-title"><div><h3>إيقاع السعرات</h3><p>آخر سبعة أيام</p></div><Flame size={20} color="hsl(var(--accent-foreground))" /></div><div style={{ height: 200, display: 'flex', alignItems: 'end', gap: 12, padding: '20px 4px 0' }}>{bars.map((height, index) => <div key={index} style={{ flex: 1, display: 'grid', gap: 8, justifyItems: 'center' }}><div style={{ width: '100%', maxWidth: 45, height: `${height * 1.55}px`, background: index === 5 ? 'hsl(var(--primary))' : 'hsl(35 71% 65% / .54)', borderRadius: '8px 8px 3px 3px', transition: 'height .4s' }} /><small className="muted">{['س', 'ح', 'ن', 'ث', 'ر', 'خ', 'ج'][index]}</small></div>)}</div></div><div className="card card-pad"><div className="card-title"><h3>توزيع المغذيات</h3><Sparkles size={19} color="hsl(var(--primary))" /></div>{[['بروتين', 32, 'hsl(var(--primary))'], ['كربوهيدرات', 46, 'hsl(35 71% 65%)'], ['دهون صحية', 22, 'hsl(196 48% 51%)']].map(([label, value, color]) => <div key={label as string} style={{ marginBottom: 18 }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span>{label}</span><strong>{value}%</strong></div><div className="progress"><i style={{ width: `${value}%`, background: color as string }} /></div></div>)}</div><div className="card card-pad full-card"><div className="card-title"><div><h3>ملخص لطيف</h3><p>مقارنة بهدفك اليومي</p></div><CheckCircle2 color="hsl(var(--primary))" /></div><div className="metric-row"><div className="metric"><Flame size={18} className="metric-icon" /><strong>{total.toLocaleString('ar-SA')}</strong><span>السعرات المتاحة في الثلاجة</span></div><div className="metric"><Droplets size={18} className="metric-icon" /><strong>{data.water} / 8</strong><span>أكواب الماء اليوم</span></div><div className="metric"><Leaf size={18} className="metric-icon" /><strong>{data.items.filter(item => item.category === 'خضروات').length}</strong><span>أصناف نباتية</span></div><div className="metric"><Zap size={18} className="metric-icon" /><strong>{Math.max(0, goal - total)}</strong><span>سعرة متبقية للهدف</span></div></div></div></div></main>;
}

function ShoppingPage({ data, setData, setNotice, onAdd }: { data: UserData; setData: Dispatch<SetStateAction<UserData>>; setNotice: (v: string) => void; onAdd: () => void }) {
  const [input, setInput] = useState(''); const [quantity, setQuantity] = useState('1');
  const add = () => { if (!input.trim()) return; setData(prev => ({ ...prev, shopping: [...prev.shopping, { id: `s-${Date.now()}`, name: input.trim(), quantity, done: false }] })); setInput(''); flash(setNotice, 'أضيفت للقائمة'); };
  const exportList = async () => { const text = data.shopping.filter(item => !item.done).map(item => `- ${item.name} (${item.quantity})`).join('\n'); try { await navigator.clipboard.writeText(text); flash(setNotice, 'تم نسخ قائمة التسوق'); } catch { flash(setNotice, 'حددي القائمة وانسخيها'); } };
  const lowStock = data.items.filter(item => item.quantity <= 1 && !data.shopping.some(row => row.name === item.name));
  return <main className="app-main"><PageHeading title="قائمة التسوق" description="كل ما تحتاجه رحلتك القادمة، في مكان واحد." action={<div style={{ display: 'flex', gap: 8 }}><button className="secondary-btn" onClick={exportList} data-testid="button-copy-shopping"><ClipboardCopy size={16} />نسخ القائمة</button><button className="primary-btn" onClick={onAdd} data-testid="button-shopping-add-food"><Plus size={17} />إضافة للثلاجة</button></div>} /><div className="dashboard-grid"><div className="card card-pad"><div className="card-title"><div><h3>قائمتك</h3><p>{data.shopping.filter(item => !item.done).length} عناصر متبقية</p></div><button className="icon-btn" onClick={() => setData(prev => ({ ...prev, shopping: prev.shopping.filter(item => !item.done) }))} data-testid="button-clear-done"><Trash2 size={16} /></button></div><div className="shopping-list">{data.shopping.map(item => <div className={`shopping-item ${item.done ? 'done' : ''}`} key={item.id}><input type="checkbox" checked={item.done} onChange={() => setData(prev => ({ ...prev, shopping: prev.shopping.map(row => row.id === item.id ? { ...row, done: !row.done } : row) }))} data-testid={`checkbox-shopping-full-${item.id}`} /><label>{item.name}</label><span className="item-quantity">{item.quantity}</span><button className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => setData(prev => ({ ...prev, shopping: prev.shopping.filter(row => row.id !== item.id) }))} data-testid={`button-delete-shopping-${item.id}`}><X size={13} /></button></div>)}{!data.shopping.length && <div className="empty-state"><ShoppingBasket size={30} /><strong>السلة فارغة الآن</strong><span>أضيفي شيئاً قبل أن تنسيه.</span></div>}</div><div style={{ display: 'flex', gap: 8, marginTop: 20 }}><input className="search-box" style={{ minWidth: 0 }} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} placeholder="أضيفي عنصراً..." data-testid="input-shopping-name" /><input className="search-box" style={{ maxWidth: 90, minWidth: 70 }} value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="الكمية" data-testid="input-shopping-quantity" /><button className="primary-btn" onClick={add} data-testid="button-add-shopping"><Plus size={17} /></button></div></div><div className="stack"><div className="card card-pad"><div className="card-title"><div><h3>اقتراحات ذكية</h3><p>أصناف قاربت على النفاد</p></div><Sparkles size={18} color="hsl(var(--accent-foreground))" /></div>{lowStock.length ? <div className="shopping-list">{lowStock.map(item => <div className="shopping-item" key={item.id}><FoodArt item={item} size={31} /><label>{item.name}</label><button className="secondary-btn" style={{ padding: '7px 10px', fontSize: 11 }} onClick={() => setData(prev => ({ ...prev, shopping: [...prev.shopping, { id: `s-${Date.now()}`, name: item.name, quantity: item.unit, done: false }] }))} data-testid={`button-suggest-${item.id}`}><Plus size={13} />أضف</button></div>)}</div> : <div className="empty-state" style={{ padding: 18 }}><CheckCircle2 size={25} /><strong>مخزونك بخير</strong><span>لا توجد اقتراحات عاجلة.</span></div>}</div><div className="card card-pad"><div className="card-title"><h3>ملاحظة للمتجر</h3><Pencil size={16} /></div><textarea className="field" style={{ width: '100%', border: '1px solid hsl(var(--border))', borderRadius: 11, padding: 10, background: 'hsl(39 33% 94%)', minHeight: 90 }} placeholder="مثال: تذكري اختيار الطماطم الناضجة..." data-testid="textarea-shopping-note" /></div></div></div></main>;
}

function RecipesPage({ data, setData }: { data: UserData; setData: Dispatch<SetStateAction<UserData>> }) {
  const [query, setQuery] = useState(''); const filtered = recipes.filter(recipe => recipe.name.includes(query) || recipe.description.includes(query) || recipe.tags.some(tag => tag.includes(query)));
  const toggle = (id: string) => setData(prev => ({ ...prev, favorites: prev.favorites.includes(id) ? prev.favorites.filter(item => item !== id) : [...prev.favorites, id] }));
  return <main className="app-main"><PageHeading title="وصفات مقترحة" description="أفكار لذيذة، تبدأ مما هو موجود عندك." action={<Link href="/favorites" className="secondary-btn" data-testid="link-recipes-favorites"><Heart size={16} />مفضلاتي</Link>} /><div className="toolbar"><div className="search-box"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="ابحثي عن وصفة..." data-testid="input-recipe-search" /></div><span className="date-chip">{filtered.length} وصفات</span></div><div className="recipe-grid">{filtered.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} favorite={data.favorites.includes(recipe.id)} onFavorite={() => toggle(recipe.id)} />)}</div>{!filtered.length && <div className="card empty-state"><Search size={30} /><strong>لم نجد هذه المرة</strong><span>جربي كلمة أخرى أو تصفحي كل الوصفات.</span></div>}</main>;
}

function FavoritesPage({ data, setData }: { data: UserData; setData: Dispatch<SetStateAction<UserData>> }) {
  const favorites = recipes.filter(recipe => data.favorites.includes(recipe.id));
  return <main className="app-main"><PageHeading title="المفضلة" description="الوصفات التي نالت إعجابك، قريبة دائماً." /><div className="card card-pad">{favorites.length ? <div className="recipe-grid">{favorites.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} favorite onFavorite={() => setData(prev => ({ ...prev, favorites: prev.favorites.filter(id => id !== recipe.id) }))} />)}</div> : <div className="empty-state"><Heart size={35} /><strong>لم تختاري مفضلات بعد</strong><span>اضغطي على القلب بجانب أي وصفة لتحفظيها هنا.</span><Link href="/recipes" className="primary-btn" style={{ marginTop: 18 }} data-testid="link-empty-favorites">تصفحي الوصفات</Link></div>}</div></main>;
}

function SettingsPage({ user, data, setData, setNotice, onLogout }: { user: User; data: UserData; setData: Dispatch<SetStateAction<UserData>>; setNotice: (v: string) => void; onLogout: () => void }) {
  const [section, setSection] = useState('عام'); const [goal, setGoal] = useState(String(data.calorieGoal));
  const saveGoal = () => { const number = Number(goal); if (number > 500) { setData(prev => ({ ...prev, calorieGoal: number })); flash(setNotice, 'تم تحديث هدف السعرات'); } };
  return <main className="app-main"><PageHeading title="الإعدادات" description="اجعلي تلاجتي تشبه طريقتك أكثر." /><div className="settings-grid"><div className="card settings-nav">{['عام', 'التنبيهات', 'الخصوصية'].map(item => <button key={item} className={section === item ? 'active' : ''} onClick={() => setSection(item)} data-testid={`button-settings-${item}`}>{item}</button>)}</div><div className="card card-pad">{section === 'عام' && <><div className="card-title"><div><h3>تفضيلاتك</h3><p>بعض اللمسات الصغيرة لمساحتك</p></div><Settings size={20} color="hsl(var(--primary))" /></div><div className="setting-line"><div><strong>الاسم</strong><p>{user.name}</p></div><button className="secondary-btn" onClick={() => flash(setNotice, 'يمكن تعديل الاسم من صفحة الحساب قريباً')} data-testid="button-edit-name"><Pencil size={14} />تعديل</button></div><div className="setting-line"><div><strong>هدف السعرات اليومي</strong><p>الرقم الذي يساعدك على توازن يومك</p></div><div style={{ display: 'flex', gap: 7 }}><input className="search-box" style={{ width: 100, minWidth: 100, height: 38 }} type="number" value={goal} onChange={e => setGoal(e.target.value)} data-testid="input-calorie-goal" /><button className="primary-btn" style={{ padding: '7px 12px' }} onClick={saveGoal} data-testid="button-save-goal">حفظ</button></div></div><div className="setting-line"><div><strong>وحدات القياس</strong><p>السعرات والكميات تظهر بالعربية</p></div><span className="status-pill">عربي</span></div></>}{section === 'التنبيهات' && <><div className="card-title"><div><h3>تنبيهات لطيفة</h3><p>نذكّرك عندما يكون الوقت مناسباً</p></div><Bell size={20} color="hsl(var(--primary))" /></div><div className="setting-line"><div><strong>تذكير انتهاء الصلاحية</strong><p>قبل يومين من انتهاء الطعام</p></div><button className={`toggle ${data.reminders ? 'on' : ''}`} onClick={() => setData(prev => ({ ...prev, reminders: !prev.reminders }))} data-testid="toggle-reminders"><i /></button></div><div className="setting-line"><div><strong>ملخص نهاية اليوم</strong><p>لمحة عن الماء والسعرات</p></div><button className={`toggle ${data.notifications ? 'on' : ''}`} onClick={() => setData(prev => ({ ...prev, notifications: !prev.notifications }))} data-testid="toggle-notifications"><i /></button></div></>}{section === 'الخصوصية' && <><div className="card-title"><div><h3>خصوصيتك أولاً</h3><p>لا نرسل بياناتك إلى أي مكان</p></div><CircleHelp size={20} color="hsl(var(--primary))" /></div><div className="empty-state" style={{ padding: 30 }}><CheckCircle2 size={32} /><strong>بياناتك محلية تماماً</strong><span>يتم حفظ حسابك ومحتويات تلاجتك في هذا المتصفح فقط.</span></div><button className="danger-btn" onClick={onLogout} data-testid="button-settings-logout"><LogOut size={15} style={{ verticalAlign: 'middle', marginLeft: 5 }} />تسجيل الخروج من هذا الجهاز</button></>}</div></div></main>;
}

function RoutedPages({ user, data, setData, onLogout, setNotice }: { user: User; data: UserData; setData: Dispatch<SetStateAction<UserData>>; onLogout: () => void; setNotice: (v: string) => void }) {
  const [addOpen, setAddOpen] = useState(false);
  return <AppShell user={user} onLogout={onLogout}><Switch><Route path="/"><Dashboard userName={user.name} data={data} setData={setData} onAdd={() => setAddOpen(true)} setNotice={setNotice} /></Route><Route path="/meals"><MealsPage data={data} setData={setData} setNotice={setNotice} /></Route><Route path="/daily-analysis"><DailyAnalysis data={data} /></Route><Route path="/shopping"><ShoppingPage data={data} setData={setData} setNotice={setNotice} onAdd={() => setAddOpen(true)} /></Route><Route path="/recipes"><RecipesPage data={data} setData={setData} /></Route><Route path="/favorites"><FavoritesPage data={data} setData={setData} /></Route><Route path="/settings"><SettingsPage user={user} data={data} setData={setData} setNotice={setNotice} onLogout={onLogout} /></Route><Route component={NotFound} /></Switch>{addOpen && <AddFoodModal onClose={() => setAddOpen(false)} onAdd={item => { setData(prev => ({ ...prev, items: [...prev.items, { ...item, id: `food-${Date.now()}` }] })); flash(setNotice, 'أضيف الطعام إلى ثلاجتك'); }} />}</AppShell>;
}

function App() {
  const [session, setSession] = useState<string | null>(() => localStorage.getItem(SESSION_KEY));
  const [notice, setNotice] = useState('');
  const [data, setData] = useState<UserData>(() => loadData(session || ''));
  const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const user = users.find(item => item.id === session);
  useEffect(() => { if (session && user) { setData(loadData(session)); } }, [session]);
  useEffect(() => { if (session) saveData(session, data); }, [data, session]);
  const login = (nextUser: User) => { localStorage.setItem(SESSION_KEY, nextUser.id); setSession(nextUser.id); setData(loadData(nextUser.id)); };
  const logout = () => { localStorage.removeItem(SESSION_KEY); setSession(null); setNotice(''); };
  if (!session || !user) return <AuthScreen onLogin={login} />;
  return <><RoutedPages user={user} data={data} setData={setData} onLogout={logout} setNotice={setNotice} />{notice && <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 60, padding: '12px 17px', borderRadius: 12, background: 'hsl(var(--sidebar))', color: 'hsl(var(--card))', boxShadow: '0 10px 25px hsl(155 22% 17% / .2)', animation: 'modal-in .2s ease-out' }} role="status" data-testid="status-notice"><CheckCircle2 size={16} style={{ verticalAlign: 'middle', marginLeft: 7, color: 'hsl(var(--accent))' }} />{notice}</div>}</>;
}

export default function AppWithProviders() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><ErrorBoundary resetKey={location.pathname}><App /></ErrorBoundary></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}
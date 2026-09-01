import { createContext, useContext, type CSSProperties, type Dispatch, type FormEvent, type ReactNode, type SetStateAction, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  Apple, ArrowLeft, Bell, Check, CheckCircle2, ChevronLeft, CircleHelp,
  ClipboardCopy, Droplets, Egg, Fish, Flame, Heart, Home, Leaf, LogOut, Minus,
  Menu, Package, Pencil, Plus, Refrigerator, Search, Settings, ShoppingBasket, Sparkles,
  Trash2, UserRound, Utensils, X, Zap, Eye, EyeOff, Globe2, LockKeyhole, Mail,
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import NotFound from '@/pages/not-found';
import milkPhoto from '@assets/generated_images/fridge-milk.png';
import eggsPhoto from '@assets/generated_images/fridge-eggs.png';
import proteinPhoto from '@assets/generated_images/fridge-protein.png';
import vegetablesPhoto from '@assets/generated_images/fridge-vegetables.png';
import fruitPhoto from '@assets/generated_images/fridge-fruit.png';
import cheesePhoto from '@assets/generated_images/fridge-cheese.png';
import freezerPhoto from '@assets/generated_images/fridge-freezer.png';
const assetUrl = (file: string) => `${import.meta.env.BASE_URL}${file}`;
const strawberryPhoto = assetUrl('food-strawberry.png');
const cherriesPhoto = assetUrl('food-cherries.png');
const tomatoPhoto = assetUrl('food-tomato.png');
const grapesPhoto = assetUrl('food-grapes.png');

type FridgeItem = {
  id: string; name: string; quantity: number; unit: string; category: string;
  expiry: string; calories: number; art: string;
};
type ShoppingItem = { id: string; name: string; quantity: string; done: boolean };
type User = { id: string; name: string; email: string; password: string; gender?: 'female' | 'male' };
type UserProfileUpdate = Partial<Pick<User, 'name' | 'email' | 'password'>>;
type UserData = {
  items: FridgeItem[]; shopping: ShoppingItem[]; note: string; water: number;
  calorieGoal: number; favorites: string[]; reminders: boolean; notifications: boolean; darkMode: boolean;
};
type Recipe = { id: string; name: string; description: string; time: string; calories: number; color: string; tags: string[] };
type AppNotification = { id: string; type: 'danger' | 'warning' | 'success' | 'info'; icon: string; title: string; message: string; time: string };
type Language = 'ar' | 'en';
const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void }>({ language: 'ar', setLanguage: () => undefined });
const useLanguage = () => useContext(LanguageContext);
type SidebarControls = { sidebarOpen: boolean; toggleSidebar: () => void };
const SidebarContext = createContext<SidebarControls>({ sidebarOpen: false, toggleSidebar: () => undefined });
const useSidebarControls = () => useContext(SidebarContext);
const text = (language: Language, ar: string, en: string) => language === 'ar' ? ar : en;
const getInitialLanguage = (): Language => {
  const saved = localStorage.getItem('smart_fridge_language');
  if (saved === 'ar' || saved === 'en') return saved;
  return typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('ar') ? 'ar' : 'en';
};
const englishTranslations: Record<string, string> = {
  'ثلاجتي': 'Smart Fridge', 'رفيق البيت الطازج': 'Fresh home companion', 'وجباتي': 'My meals',
  'تحليل يومي': 'Daily analysis', 'قائمة التسوق': 'Shopping list', 'وصفات مقترحة': 'Suggested recipes',
  'المفضلة': 'Favorites', 'الإعدادات': 'Settings', 'مساحتي الشخصية': 'My space', 'تسجيل الخروج': 'Sign out',
  'معلومات الملف الشخصي': 'Profile Information', 'فتح معلومات الملف الشخصي': 'Open profile information',
  'مساحتي اليومية': 'My daily space', 'محتويات ثلاجتك': 'Your fridge contents', 'تفاصيل العنصر': 'Item details',
  'قائمة التنبيهات': 'Notifications', 'التنبيهات': 'Notifications', 'تعليم الكل كمقروء': 'Mark all as read',
  'لا توجد إشعارات جديدة 🎉': 'No new notifications 🎉', 'قائمة التسوق ': 'Shopping list ',
  'تصدير القائمة': 'Export list', 'إضافة': 'Add', 'تعديل': 'Edit', 'استهلكت': 'Consumed',
  'إضافة إلى الثلاجة': 'Add to fridge', 'حفظ': 'Save', 'إلغاء': 'Cancel', 'اسم الطعام': 'Food name',
  'الكمية': 'Quantity', 'الوحدة': 'Unit', 'القسم': 'Category', 'تاريخ الانتهاء': 'Expiry date',
  'السعرات الحرارية': 'Calories', 'السعرات لكل وحدة': 'Calories per unit', 'أضف طعاماً جديداً': 'Add new food',
  'اشرب الماء': 'Drink water', 'السعرات المتبقية': 'Calories remaining', 'توزيع المغذيات': 'Nutrients',
  'نصيحة اليوم': 'Tip of the day', 'هدفك اليومي': 'Daily goal', 'استهلاكك اليوم': 'Today’s intake',
  'سعرة': 'kcal', 'أهلاً بعودتك': 'Welcome back', 'لنبدأ معاً': 'Let’s get started',
  'تسجيل الدخول': 'Sign in', 'حساب جديد': 'Create account', 'البريد الإلكتروني': 'Email',
  'كلمة المرور': 'Password', 'الاسم': 'Name', 'الجنس': 'Gender', 'تذكرني': 'Remember me',
  'نسيت كلمة المرور؟': 'Forgot password?', 'إنشاء مساحتي': 'Create my space', 'دخول إلى ثلاجتي': 'Enter my fridge',
  'تجربة ثلاجتي الآن': 'Try Smart Fridge', 'أو': 'or', 'أضف': 'Add', 'سهل': 'Easy',
  'عرض الوصفة': 'View recipe', 'مفضلاتي': 'My favorites', 'خطة اليوم': 'Today’s plan',
  'اقتراحات ذكية': 'Smart suggestions', 'ملاحظة للمتجر': 'Note for the store', 'قائمتك': 'Your list',
  'قائمتك فارغة': 'Your list is empty', 'مخزونك بخير': 'Your stock is healthy', 'السلة فارغة الآن': 'Your basket is empty',
  'لم تختر مفضلات بعد': 'No favorites yet', 'تصفح الوصفات': 'Browse recipes', 'تفضيلاتك': 'Your preferences',
  'مظهر ثلاجتي': 'Smart Fridge appearance', 'الوضع الليلي': 'Dark mode', 'تنبيهات لطيفة': 'Gentle notifications',
  'الخصوصية': 'Privacy', 'خصوصيتك أولاً': 'Your privacy first', 'عربي': 'Arabic', 'بياناتك محلية تماماً': 'Your data stays local',
  'العربية': 'Arabic', 'نظام ثلاجتي الذكي': 'Smart Fridge system', 'طازج': 'Fresh', 'منطقة الطزاجة': 'Fresh zone',
  'الصلصات والمربيات': 'Sauces and jams', 'المشروبات والعصائر': 'Drinks and juices', 'ملاحظة اليوم': 'Today’s note',
  'حضّر شيئاً طازجاً': 'Prepare something fresh', 'تبريد ذكي': 'Smart cooling', 'تعمل بكفاءة': 'Running efficiently',
  'الفريزر': 'Freezer', 'الثلاجة': 'Fridge', 'أضف صنفاً جديداً': 'Add a new item', 'خضروات طازجة': 'Fresh vegetables',
  'جذور وبطاطا': 'Roots and potatoes', 'أصناف': 'items', 'لحوم': 'Meat', 'ثلج': 'Ice', 'جاهز': 'Ready',
  'أكمل هدفك!': 'Goal reached!', 'تذكير انتهاء الصلاحية': 'Expiry reminder', 'قبل يومين من انتهاء الطعام': 'Two days before food expires',
  'ملخص نهاية اليوم': 'End-of-day summary', 'لمحة عن الماء والسعرات': 'A look at water and calories',
  'هدف السعرات اليومي': 'Daily calorie goal', 'الرقم الذي يساعدك على توازن يومك': 'The number that helps balance your day',
  'وحدات القياس': 'Measurement units', 'السعرات والكميات تظهر بالعربية': 'Calories and quantities appear in Arabic',
  'بعض اللمسات الصغيرة لمساحتك': 'A few small touches for your space', 'يمكن تعديل الاسم من صفحة الحساب قريباً': 'Name editing will be available soon',
  'اختر الإضاءة التي تناسب وقتك': 'Choose the lighting that suits you', 'يخفف إضاءة الثلاجة ويجعل الداخل أكثر هدوءاً': 'Dims the fridge for a calmer interior',
  'إضاءة ليلية هادئة': 'Calm night lighting', 'إضاءة نهارية مشرقة': 'Bright daylight lighting',
  'نذكّرك عندما يكون الوقت مناسباً': 'We remind you at the right time',
  'لا نرسل بياناتك إلى أي مكان': 'We never send your data anywhere', 'يتم حفظ حسابك ومحتويات ثلاجتك في هذا المتصفح فقط.': 'Your account and fridge contents are saved only in this browser.',
  'تسجيل الخروج من هذا الجهاز': 'Sign out from this device', 'أكملي البيانات، وكلمة المرور 4 أحرف على الأقل.': 'Complete the fields; the password must be at least 4 characters.',
  'هذا البريد مسجل مسبقاً.': 'This email is already registered.', 'البريد أو كلمة المرور غير صحيحة.': 'The email or password is incorrect.',
  'سنرسل لك رابط استعادة كلمة المرور قريباً.': 'We will send a password reset link soon.', 'اختر الجنس': 'Choose gender',
  'أنثى': 'Female', 'ذكر': 'Male', 'إخفاء كلمة المرور': 'Hide password', 'إظهار كلمة المرور': 'Show password',
  'بياناتك محفوظة على هذا الجهاز': 'Your data is saved on this device', 'ثلاجتك، بإيقاع يومك': 'Your fridge, at your rhythm',
  'شيء جديد يستحق مكاناً في مساحتك.': 'Something new deserves a place in your space.', 'اكتب اسم الطعام...': 'Type a food name...',
  'لم نجد هذه المرة': 'Nothing found this time', 'جربي كلمة أخرى أو تصفحي كل الوصفات.': 'Try another word or browse all recipes.',
  'كل ما تحتاجه رحلتك القادمة، في مكان واحد.': 'Everything you need for your next trip, in one place.',
  'نسخ القائمة': 'Copy list', 'إضافة للثلاجة': 'Add to fridge', 'عناصر متبقية': 'items remaining',
  'تفاصيل الطعام': 'Food details', 'حفظ الكمية': 'Save quantity', 'حذف العنصر': 'Delete item',
  'هل تريد حذف هذا العنصر؟': 'Delete this item?', 'تأكيد الحذف': 'Confirm deletion',
  'إلغاء الحذف': 'Cancel deletion', 'تم تحديث الكمية': 'Quantity updated',
  'تم حذف العنصر': 'Item deleted', 'أدخل كمية صحيحة': 'Enter a valid quantity',
  'أضف ما ينقصك.': 'Add what is missing.', 'أضف شيئاً قبل أن تنساه.': 'Add something before you forget.',
  'أضف عنصراً...': 'Add an item...', 'أصناف قاربت على النفاد': 'Items running low',
  'لا توجد اقتراحات عاجلة.': 'No urgent suggestions.', 'مثال: اختر الطماطم الناضجة...': 'Example: choose ripe tomatoes...',
  'أفكار لذيذة، تبدأ مما هو موجود عندك.': 'Delicious ideas, starting with what you have.',
  'ابحثي عن وصفة...': 'Search for a recipe...', 'وصفات': 'recipes', 'الوصفات التي نالت إعجابك، قريبة دائماً.': 'Recipes you love, always close by.',
  'اضغط على القلب بجانب أي وصفة لحفظها هنا.': 'Press the heart beside a recipe to save it here.',
  'اجعل ثلاجتي تشبه طريقتك أكثر.': 'Make Smart Fridge feel more like you.',
  'طازج وجاهز': 'Fresh and ready', 'بارد ومنعش': 'Chilled and fresh',
  'رسم توضيحي لثلاجة ذكية': 'Illustration of a smart fridge', 'إخفاء التفاصيل': 'Close details',
  'جار تحميل صورة الطبق': 'Loading dish image', 'صورة طبق محايد': 'Neutral dish image',
  'أكملت': 'Completed', 'أيام': 'days', 'اليوم': 'Today', 'الآن': 'Now',
  'أكواب': 'cups', 'منتهية الصلاحية': 'expired', 'قريب انتهاء الصلاحية': 'Expiring soon',
  'كمية منخفضة': 'Low quantity', 'تذكير شرب الماء': 'Water reminder',
  'عدّل الكمية': 'Edit quantity', 'تم تسجيل استهلاك': 'Consumption recorded',
  'إغلاق التفاصيل': 'Close details', 'السعرات للوحدة': 'Calories per unit',
  'إجمالي السعرات': 'Total calories', 'وجبة': 'meal', 'وجبات': 'meals',
  'اسم الوجبة': 'Meal name', 'الوقت': 'Time', 'إضافة وجبة': 'Add meal',
  'مثال: فطور صحي': 'Example: healthy breakfast', 'لم تضف وجبات بعد': 'No meals added yet',
  'ابدأ بإضافة أول وجبة ليومك.': 'Start by adding your first meal.',
  'حذف الوجبة': 'Delete meal', 'أضيفت الوجبة إلى يومك': 'Meal added to your day',
  'أضيفت للقائمة': 'Added to the list', 'تم نسخ قائمة التسوق': 'Shopping list copied',
  'حدّد القائمة وانسخها': 'Select the list and copy it', 'إضافة عنصر': 'Add item',
  'مساء الخير،': 'Good evening,', 'صورة طبق': 'Dish image', 'وجباتك التي أضفتها بنفسك': 'Meals you added yourself',
  'إيقاع السعرات': 'Calorie rhythm', 'آخر سبعة أيام': 'Last seven days',
  'ملخص لطيف': 'A gentle summary', 'مقارنة بهدفك اليومي': 'Compared with your daily goal',
  'السعرات المتاحة في الثلاجة': 'Calories in your fridge', 'أكواب الماء اليوم': 'Water cups today',
  'أصناف نباتية': 'Plant-based items', 'سعرة متبقية للهدف': 'kcal left to goal',
  'بروتين': 'Protein', 'كربوهيدرات': 'Carbohydrates', 'دهون صحية': 'Healthy fats',
  'تناول الخضروات في كل وجبة': 'Eat vegetables with every meal', 'للحصول على صحة أفضل.': 'for better health.',
  'تفضيراتك': 'Your preferences',
  'شربت': 'You drank', 'سعرة حرارية اليوم': 'kcal today',
  'أكواب فقط، هدفك 8 أكواب': 'cups only; your goal is 8 cups',
  'ينتهي خلال': 'expires in', 'كميته منخفضة، أضفه لقائمة التسوق': 'is running low; add it to your shopping list',
};
function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  useEffect(() => {
    localStorage.setItem('smart_fridge_language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.body.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}

const queryClient = new QueryClient();
const USERS_KEY = 'smart_fridge_users';
const SESSION_KEY = 'smart_fridge_session';
const DATA_KEY = 'smart_fridge_data';
const readStoredUsers = (): User[] => {
  try {
    const stored = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

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
  { id: 'orange-juice', name: 'عصير برتقال', quantity: 1, unit: 'عبوة', category: 'مشروبات', expiry: '2025-06-08', calories: 110, art: 'orange' },
  { id: 'water', name: 'ماء', quantity: 4, unit: 'عبوة', category: 'مشروبات', expiry: '2025-12-31', calories: 0, art: 'bottle' },
  { id: 'strawberry', name: 'فراولة', quantity: 6, unit: 'حبة', category: 'فواكه', expiry: '2025-06-04', calories: 6, art: 'strawberry' },
  { id: 'cherries', name: 'كرز', quantity: 12, unit: 'حبة', category: 'فواكه', expiry: '2025-06-04', calories: 5, art: 'cherries' },
  { id: 'grapes', name: 'عنب', quantity: 1, unit: 'عنقود', category: 'فواكه', expiry: '2025-06-05', calories: 104, art: 'grapes' },
];
const defaultData: UserData = {
  items: defaultItems, shopping: [
    { id: 's1', name: 'خبز عربي', quantity: 'كيس', done: false },
    { id: 's2', name: 'موز', quantity: '6 حبات', done: false },
    { id: 's3', name: 'زيت زيتون', quantity: 'عبوة', done: true },
  ], note: 'لا تنسَ إخراج الدجاج للتتبيل قبل الغداء.', water: 4, calorieGoal: 2000,
  favorites: ['r1'], reminders: true, notifications: true, darkMode: false,
};
const recipes: Recipe[] = [
  { id: 'r1', name: 'سلطة الدجاج والحمص', description: 'طبق خفيف من مكونات ثلاجتك، غني ومقرمش.', time: '20 دقيقة', calories: 410, color: 'linear-gradient(135deg, #cadb95, #709657)', tags: ['غداء', 'غني بالبروتين'] },
  { id: 'r2', name: 'شكشوكة صباحية', description: 'طماطم دافئة وبيض مع لمسة كمون شرقية.', time: '15 دقيقة', calories: 285, color: 'linear-gradient(135deg, #eeb58b, #ce6547)', tags: ['فطور', 'سريع'] },
  { id: 'r3', name: 'توست الجبن والخضار', description: 'وجبة سريعة لأيام العمل المزدحمة.', time: '10 دقائق', calories: 330, color: 'linear-gradient(135deg, #eed68d, #d0a949)', tags: ['خفيف', 'نباتي'] },
  { id: 'r4', name: 'كوب الفواكه المنعش', description: 'برتقال وتفاح مع زبادي بارد.', time: '8 دقائق', calories: 205, color: 'linear-gradient(135deg, #f0b47f, #db725d)', tags: ['سناك', 'منعش'] },
  { id: 'r5', name: 'راب الدجاج الأخضر', description: 'لفافة عملية من الدجاج والخس والصلصة.', time: '25 دقيقة', calories: 390, color: 'linear-gradient(135deg, #b4cf9b, #477e62)', tags: ['غداء', 'للعمل'] },
  { id: 'r6', name: 'حمص بالليمون', description: 'طبق جانبي كريمي يرافق كل شيء.', time: '12 دقيقة', calories: 240, color: 'linear-gradient(135deg, #e5d59d, #ad9352)', tags: ['جانبي', 'نباتي'] },
  { id: 'r7', name: 'رز ودجاج', description: 'طبق دافئ ومشبع من الأرز المتبّل وقطع الدجاج الطرية.', time: '35 دقيقة', calories: 560, color: 'linear-gradient(135deg, #e8c58e, #a66d42)', tags: ['غداء', 'مشبع'] },
];
const defaultFoodImage = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 600 400%22%3E%3Crect width=%22600%22 height=%22400%22 fill=%22%23F0EBE0%22/%3E%3Cellipse cx=%22300%22 cy=%22208%22 rx=%22135%22 ry=%2278%22 fill=%22%23FFFFFF%22 stroke=%22%23D4CFC6%22 stroke-width=%2212%22/%3E%3Ccircle cx=%22300%22 cy=%22208%22 r=%2240%22 fill=%22%23E8F2EC%22/%3E%3C/svg%3E';
const mealImageMap: Record<string, string> = {
  'رز ودجاج': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=200',
  'سلطة الدجاج والحمص': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200',
  'راب الدجاج الأخضر': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c2?w=200',
  'توست الجبن والخضار': 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=200',
  'بيض بلدي مع خضار': 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=200',
  'كوب الفواكه المنعش': 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=200',
  'حمص بالليمون': 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=200',
  فطور: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=200',
  غداء: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=200',
  عشاء: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200',
  سلطة: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200',
  شوربة: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=200',
  دجاج: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c2?w=200',
  سمك: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200',
  بيض: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=200',
  default: defaultFoodImage,
};
const recipeImageMap: Record<string, string> = {
  'رز ودجاج': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=300',
  'سلطة الدجاج والحمص': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300',
  'راب الدجاج الأخضر': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c2?w=300',
  'توست الجبن والخضار': 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=300',
  'بيض بلدي مع خضار': 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=300',
  'كوب الفواكه المنعش': 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=300',
  'حمص بالليمون': 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=300',
  سلطة: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300',
  شوربة: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=300',
  'دجاج مشوي': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c2?w=300',
  بيض: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=300',
  معكرونة: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=300',
  أرز: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=300',
  سمك: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300',
  default: defaultFoodImage,
};
function findMappedImage(name: string, map: Record<string, string>) {
  if (map[name]) return map[name];
  const key = Object.keys(map).find(item => item !== 'default' && name.includes(item));
  return key ? map[key] : map.default;
}
const translateToEnglish: Record<string, string> = {
  'حليب طازج': 'Fresh milk', 'بيض بلدي': 'Farm eggs', 'جبن أبيض': 'White cheese',
  'تفاح أحمر': 'Red apples', 'برتقال': 'Oranges', 'خس طازج': 'Fresh lettuce',
  'طماطم كرزية': 'Cherry tomatoes', 'صدور دجاج': 'Chicken breast',
  'حمص جاهز': 'Ready hummus', 'عصير برتقال': 'Orange juice', 'ماء': 'Water',
  'خبز عربي': 'Arabic bread', 'موز': 'Bananas', 'زيت زيتون': 'Olive oil',
  'حليب': 'Milk', 'بيض': 'Eggs', 'جبن': 'Cheese',
  'تفاح': 'Apples', 'خس': 'Lettuce', 'طماطم': 'Tomatoes', 'بصل': 'Onions',
  'بطاطا': 'Potatoes', 'بطاطس': 'Potatoes', 'جزر': 'Carrots', 'فلفل': 'Peppers',
  'زبادي': 'Yogurt', 'لبن': 'Yogurt', 'خبز': 'Bread', 'موزة': 'Banana',
  'زيت': 'Oil', 'ماء معدني': 'Mineral water', 'عصير': 'Juice',
  'فراولة': 'Strawberries', 'كرز': 'Cherries', 'عنب': 'Grapes',
  'بروكلي': 'Broccoli', 'أفوكادو': 'Avocado', 'ذرة': 'Corn', 'خس روماني': 'Romaine lettuce',
  'تفاح أخضر': 'Green apples', 'كيوي': 'Kiwi', 'ليمون أخضر': 'Limes',
  حمص: 'hummus', فلافل: 'falafel', شاورما: 'shawarma', سلطة: 'salad', 'شوربة دجاج': 'chicken soup',
  مندي: 'mandi rice', كبسة: 'kabsa', 'دجاج مشوي': 'grilled chicken', 'سمك مشوي': 'grilled fish',
  معكرونة: 'pasta', أرز: 'rice', رز: 'rice', برياني: 'biryani', تبولة: 'tabbouleh',
  فتوش: 'fattoush', كباب: 'kebab', شوكولاتة: 'chocolate cake', بيتزا: 'pizza', برغر: 'burger',
  دجاج: 'chicken', 'رز ودجاج': 'rice and chicken',
};
function getEnglishName(arabicName: string) {
  if (translateToEnglish[arabicName]) return translateToEnglish[arabicName];
  return Object.keys(translateToEnglish)
    .sort((a, b) => b.length - a.length)
    .reduce((name, arabic) => name.replaceAll(arabic, translateToEnglish[arabic]), arabicName);
}
function displayFoodName(name: string, language: Language) {
  return language === 'en' ? getEnglishName(name) : name;
}
function displayShoppingQuantity(quantity: string, language: Language) {
  if (language === 'ar') return quantity;
  return quantity
    .replaceAll('حبات', 'items')
    .replaceAll('حبة', 'item')
    .replaceAll('شرائح', 'slices')
    .replaceAll('علبة', 'box')
    .replaceAll('كيس', 'bag')
    .replaceAll('قطعة', 'piece')
    .replaceAll('رأس', 'head')
    .replaceAll('عنقود', 'bunch')
    .replaceAll('عبوة', 'bottle');
}
async function getFoodImage(foodName: string): Promise<string | null> {
  const cacheKey = 'smart_fridge_source_unsplash_images_v2';
  let cache: Record<string, string | null> = {};
  try { cache = JSON.parse(localStorage.getItem(cacheKey) || '{}'); } catch { cache = {}; }
  const englishName = getEnglishName(foodName);
  if (Object.prototype.hasOwnProperty.call(cache, englishName)) return cache[englishName];
  const image = `https://source.unsplash.com/300x200/?${encodeURIComponent(englishName)}`;
  localStorage.setItem(cacheKey, JSON.stringify({ ...cache, [englishName]: image }));
  return image;
}
function RemoteFoodImage({ foodName, alt }: { foodName: string; alt: string }) {
  const { language } = useLanguage();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    setLoading(true); setFailed(false);
    getFoodImage(foodName).then(result => {
      if (!cancelled) { setImage(result); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [foodName]);
  if (loading) return <div className="recipe-image-placeholder is-loading" aria-label={text(language, 'جار تحميل صورة الطبق', 'Loading dish image')}><span /></div>;
  if (!image || failed) return <img className="recipe-card-image" src={defaultFoodImage} alt={text(language, 'صورة طبق محايد', 'Neutral dish image')} loading="lazy" />;
  return <img className="recipe-card-image" src={image} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}

function loadData(userId: string): UserData {
  try {
    const stored = JSON.parse(localStorage.getItem(DATA_KEY) || '{}');
    if (!stored[userId]) return { ...defaultData, items: defaultItems.map(item => ({ ...item })) };
    const saved = stored[userId] as UserData;
    const cleanedItems = (saved.items || []).filter(item => !removedBrokenImageItemIds.has(item.id));
    const savedIds = new Set(cleanedItems.map(item => item.id));
    return { ...defaultData, ...saved, items: [...cleanedItems, ...defaultItems.filter(item => !savedIds.has(item.id)).map(item => ({ ...item }))] };
  } catch { return { ...defaultData, items: defaultItems.map(item => ({ ...item })) }; }
}
function saveData(userId: string, data: UserData) {
  const stored = JSON.parse(localStorage.getItem(DATA_KEY) || '{}');
  localStorage.setItem(DATA_KEY, JSON.stringify({ ...stored, [userId]: data }));
}
function ProfileAvatar({ gender = 'female' }: { gender?: User['gender'] }) {
  const hairColor = gender === 'male' ? '#315b40' : '#5b3d35';
  return <span className="profile-avatar-sticker" aria-hidden="true">
    <svg viewBox="0 0 48 48" focusable="false">
      <circle cx="24" cy="24" r="23" fill="#e8f4e8" />
      <path d="M10 44c1.7-7.2 6.5-10.8 14-10.8S36.3 36.8 38 44" fill="#f0b957" />
      <path d="M13.2 22.5c0-8.7 4.4-14.1 10.8-14.1 7 0 11.1 5.4 11.1 14.1v4.1H13.2z" fill={hairColor} />
      <circle cx="24" cy="24.2" r="9.5" fill="#ffd9bf" />
      <path d="M15 21.2c1.2-6.2 4.2-9.4 9.3-9.4 5.1 0 8.7 3.1 9.8 9.4-2.4-1.9-4.8-2.8-7.3-2.8-4.1 0-7.3 1.8-11.8 2.8z" fill={hairColor} />
      <circle cx="20.4" cy="24.3" r="1" fill="#315b40" />
      <circle cx="27.7" cy="24.3" r="1" fill="#315b40" />
      <path d="M21 28c1.9 1.5 4.1 1.5 6 0" fill="none" stroke="#d17d73" strokeLinecap="round" strokeWidth="1.3" />
      <circle cx="39.5" cy="9" r="3.2" fill="#f0b957" />
      <path d="M39.5 6.9v4.2M37.4 9h4.2" stroke="#fff8e5" strokeLinecap="round" strokeWidth="1.1" />
    </svg>
  </span>;
}
function TransparentFoodImage({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) {
  const [transparentSrc, setTransparentSrc] = useState('');
  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.drawImage(image, 0, 0);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      for (let index = 0; index < pixels.data.length; index += 4) {
        const red = pixels.data[index];
        const green = pixels.data[index + 1];
        const blue = pixels.data[index + 2];
        const spread = Math.max(red, green, blue) - Math.min(red, green, blue);
        if (Math.min(red, green, blue) > 216 && spread < 16) pixels.data[index + 3] = 0;
      }
      context.putImageData(pixels, 0, 0);
      if (!cancelled) setTransparentSrc(canvas.toDataURL('image/png'));
    };
    image.src = src;
    return () => { cancelled = true; };
  }, [src]);
  return <img className="food-photo" src={transparentSrc || src} alt={alt} style={{ width, height }} />;
}
function daysUntil(date: string) {
  return Math.ceil((new Date(date).getTime() - new Date().setHours(0, 0, 0, 0)) / 86400000);
}
function toWesternNums(value: string | number) {
  return String(value).replace(/[٠-٩]/g, digit => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(digit)]);
}
function formatArabicDate(language: Language = 'ar') {
  return toWesternNums(new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date()));
}
function flash(setNotice: (value: string) => void, text: string) {
  setNotice(text); window.setTimeout(() => setNotice(''), 2400);
}
function checkAndGenerateNotifications(data: UserData, language: Language): AppNotification[] {
  const notifications: AppNotification[] = [];
  data.items.forEach(item => {
    const daysLeft = daysUntil(item.expiry);
    const itemName = displayFoodName(item.name, language);
    if (daysLeft <= 0) notifications.push({
      id: `expired_${item.id}`, type: 'danger', icon: '⚠️',
      title: text(language, 'طعام منتهي الصلاحية', 'Food expired'),
      message: `${itemName} ${text(language, 'انتهت صلاحيته!', 'has expired!')}`, time: text(language, 'الآن', 'Now'),
    });
    else if (daysLeft <= 3) notifications.push({
      id: `expiring_${item.id}`, type: 'warning', icon: '🕐',
      title: text(language, 'قريب انتهاء الصلاحية', 'Expiring soon'),
      message: `${itemName} ${text(language, 'ينتهي خلال', 'expires in')} ${toWesternNums(daysLeft)} ${text(language, 'أيام', 'days')}`,
      time: `${toWesternNums(daysLeft)} ${text(language, 'أيام', 'days')}`,
    });
    if (item.quantity <= 1) notifications.push({
      id: `low_${item.id}`, type: 'info', icon: '📦',
      title: text(language, 'كمية منخفضة', 'Low quantity'),
      message: `${itemName} ${text(language, 'كميته منخفضة، أضفه لقائمة التسوق', 'is running low; add it to your shopping list')}`,
      time: text(language, 'اليوم', 'Today'),
    });
  });
  const calories = data.items.reduce((sum, item) => sum + item.calories * item.quantity, 0);
  if (calories >= data.calorieGoal) notifications.push({
    id: 'calorie_goal', type: 'success', icon: '🎯', title: text(language, 'وصلت هدفك!', 'Goal reached!'),
    message: `${text(language, 'أكملت', 'Completed')} ${toWesternNums(data.calorieGoal)} ${text(language, 'سعرة حرارية اليوم', 'kcal today')}`,
    time: text(language, 'اليوم', 'Today'),
  });
  if (data.water < 4) notifications.push({
    id: 'water_reminder', type: 'info', icon: '💧', title: text(language, 'تذكير شرب الماء', 'Water reminder'),
    message: `${text(language, 'شربت', 'You drank')} ${toWesternNums(data.water)} ${text(language, 'أكواب فقط، هدفك 8 أكواب', 'cups only; your goal is 8 cups')}`,
    time: text(language, 'اليوم', 'Today'),
  });
  return notifications;
}

const removedBrokenImageItemIds = new Set([
  'broccoli', 'avocado', 'corn', 'romaine', 'carrots', 'red-apple', 'bananas',
  'kiwi', 'green-apple', 'lime', 'mandarins', 'steak', 'water-bottle', 'juice-bottles',
]);

function FoodArt({ item, size = 40 }: { item?: FridgeItem; size?: number }) {
  const art = item?.art || 'apple';
  const photo = art === 'strawberry' ? strawberryPhoto : art === 'cherries' ? cherriesPhoto : art === 'grapes' ? grapesPhoto
    : art === 'tomato' ? tomatoPhoto : art === 'milk' ? milkPhoto : art === 'egg' ? eggsPhoto : art === 'chicken' ? proteinPhoto
    : art === 'leaf' ? vegetablesPhoto : art === 'apple' || art === 'orange' ? fruitPhoto
    : art === 'cheese' ? cheesePhoto : art === 'hummus' ? cheesePhoto : art === 'package' ? milkPhoto : freezerPhoto;
  const style = art === 'apple' ? { color: 'hsl(6 58% 48%)' }
    : art === 'orange' ? { color: 'hsl(32 69% 44%)' }
    : art === 'leaf' ? { color: 'hsl(152 44% 29%)' }
    : art === 'tomato' ? { color: 'hsl(4 65% 48%)' }
    : art === 'chicken' ? { color: 'hsl(274 35% 48%)' }
    : art === 'egg' ? { color: 'hsl(34 52% 40%)' }
    : { color: 'hsl(196 48% 40%)' };
  return <div className={`food-art art-${art}`} style={{ ...style, width: size, height: size }}><span className="food-shadow" aria-hidden="true" /><TransparentFoodImage src={photo} alt="" width={size * 1.5} height={size * 1.5} /></div>;
}

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const next = language === 'ar' ? 'en' : 'ar';
  return <div className="language-switcher" aria-label={text(language, 'تغيير اللغة إلى الإنجليزية', 'Switch language to Arabic')}><Globe2 size={16} /><button type="button" onClick={() => setLanguage(next)} aria-label={text(language, 'English', 'العربية')}>{text(language, 'English', 'العربية')}</button></div>;
}

function AuthScreen({ onLogin }: { onLogin: (user: User) => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'' | 'female' | 'male'>('');
  const [email, setEmail] = useState(() => localStorage.getItem('smart_fridge_email') || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(() => localStorage.getItem('smart_fridge_remember') === 'true');
  const { language } = useLanguage();
  const submit = (event: FormEvent) => {
    event.preventDefault(); setError('');
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (remember) {
      localStorage.setItem('smart_fridge_remember', 'true');
      localStorage.setItem('smart_fridge_email', email.trim());
    } else {
      localStorage.removeItem('smart_fridge_remember');
      localStorage.removeItem('smart_fridge_email');
    }
    if (mode === 'register') {
      if (!name.trim() || !email.trim() || password.length < 4) { setError(text(language, 'أكملي البيانات، وكلمة المرور 4 أحرف على الأقل.', 'Complete all fields; the password must be at least 4 characters.')); return; }
      if (users.some(user => user.email === email.trim().toLowerCase())) { setError(text(language, 'هذا البريد مسجل مسبقاً.', 'This email is already registered.')); return; }
      const user: User = { id: `u-${Date.now()}`, name: name.trim(), email: email.trim().toLowerCase(), password, gender: gender || undefined };
      localStorage.setItem(USERS_KEY, JSON.stringify([...users, user])); onLogin(user);
    } else {
      const user = users.find(candidate => candidate.email === email.trim().toLowerCase() && candidate.password === password);
      if (!user) { setError(text(language, 'البريد أو كلمة المرور غير صحيحة.', 'The email or password is incorrect.')); return; }
      onLogin(user);
    }
  };
  const demo = () => {
    const user: User = { id: 'demo-user', name: 'سارة', email: 'demo@thalajati.local', password: 'demo', gender: 'female' };
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (!users.some(item => item.id === user.id)) localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
    onLogin(user);
  };
  const forgotPassword = () => setError(text(language, 'سنرسل لك رابط استعادة كلمة المرور قريباً.', 'We will send a password reset link soon.'));
  return <main className="auth-shell auth-redesign">
    <section className="auth-art auth-visual-panel">
      <div className="auth-visual-inner">
       <div className="visual-topline"><span><i className="live-dot" /> {text(language, 'نظام ثلاجتي الذكي', 'Smart Fridge system')}</span></div>
        <div className="auth-visual-content">
           <div className="fridge-stage" aria-label={text(language, 'رسم توضيحي لثلاجة ذكية', 'Illustration of a smart fridge')}>
            <div className="fridge-halo" />
            <div className="smart-fridge-illustration">
              <div className="fridge-top-cap" />
              <div className="fridge-freezer">
                 <span className="fridge-display"><b>{toWesternNums('4°')}</b><small>{text(language, 'طازج', 'Fresh')}</small></span>
                <span className="fridge-handle handle-freezer" />
              </div>
              <div className="fridge-fresh">
                <div className="fridge-interior">
                  <span className="interior-lamp" />
                  <div className="fridge-shelf-row"><i className="fridge-food food-jar" /><i className="fridge-food food-leaf" /><i className="fridge-food food-milk" /></div>
                  <div className="fridge-shelf-row"><i className="fridge-food food-orange" /><i className="fridge-food food-apple" /><i className="fridge-food food-bottle" /></div>
                  <div className="fridge-shelf-row low"><i className="fridge-food food-greens" /><i className="fridge-food food-box" /></div>
                </div>
                <span className="fridge-handle handle-fresh" />
              </div>
              <div className="fridge-base" />
            </div>
            <span className="stage-shadow" />
          </div>
          <div className="auth-copy">
             <div className="copy-kicker"><Sparkles size={14} /> {text(language, 'طازج، مرتب، على طريقتك', 'Fresh, organized, your way')}</div>
              <h2>{text(language, 'ثلاجتك الذكية..', 'Your smart fridge..')}<br /><em>{text(language, 'طعامك دائماً طازج', 'Your food, always fresh')}</em></h2>
             <p>{text(language, 'إدارة ذكية لمحتويات ثلاجتك، للحفاظ على طعامك طازجًا وحياتك أسهل.', 'Smartly manage your fridge contents to keep food fresh and life easier.')}</p>
            <div className="auth-benefits">
                <div className="benefit-item"><span><Leaf size={17} /></span><div><strong>{text(language, 'تتبع ذكي للمحتويات والصلاحية', 'Smart inventory and expiry tracking')}</strong></div></div>
                <div className="benefit-item"><span><ShoppingBasket size={17} /></span><div><strong>{text(language, 'قائمة تسوق أذكى وأسرع', 'A smarter, faster shopping list')}</strong></div></div>
                <div className="benefit-item"><span><Bell size={17} /></span><div><strong>{text(language, 'تنبيهات انتهاء صلاحية الطعام', 'Food expiry reminders')}</strong></div></div>
            </div>
          </div>
        </div>
         <div className="visual-footer"><span><LockKeyhole size={13} /> {text(language, 'بياناتك محفوظة على هذا الجهاز', 'Your data is saved on this device')}</span><span>{text(language, 'ثلاجتك، بإيقاع يومك', 'Your fridge, your rhythm')}</span></div>
      </div>
    </section>
    <section className="auth-form-wrap">
      <form className="auth-form auth-card" onSubmit={submit}>
         <LanguageSwitcher />
         <div className="auth-card-heading"><h2>{mode === 'login' ? text(language, 'أهلاً بعودتك', 'Welcome back') : text(language, 'لنبدأ معاً', 'Let’s get started')}</h2><p>{mode === 'login' ? text(language, 'سجّل دخولك لثلاجتك الذكية', 'Sign in to your Smart Fridge') : text(language, 'أنشئ مساحتك الخاصة في دقائق.', 'Create your own space in minutes.')}</p></div>
         <div className="auth-tabs"><button type="button" className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError(''); }} data-testid="tab-login">{text(language, 'تسجيل الدخول', 'Sign in')}</button><button type="button" className={`auth-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => { setMode('register'); setError(''); }} data-testid="tab-register">{text(language, 'حساب جديد', 'Create account')}</button></div>
         {mode === 'register' && <div className="field auth-field"><label htmlFor="auth-name">{text(language, 'الاسم', 'Name')}</label><input id="auth-name" data-testid="input-auth-name" value={name} onChange={e => setName(e.target.value)} /></div>}
         <div className="field auth-field"><label htmlFor="auth-email">{text(language, 'البريد الإلكتروني', 'Email')}</label><div className="input-with-icon"><Mail size={17} /><input id="auth-email" type="email" autoComplete="email" dir="ltr" aria-describedby={error ? 'auth-error' : undefined} data-testid="input-auth-email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" /></div></div>
         <div className="field auth-field"><label htmlFor="auth-password">{text(language, 'كلمة المرور', 'Password')}</label><div className="input-with-icon password-control"><LockKeyhole size={17} /><input id="auth-password" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} dir="ltr" aria-describedby={error ? 'auth-error' : undefined} data-testid="input-auth-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" /><button type="button" className="password-toggle" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? text(language, 'إخفاء كلمة المرور', 'Hide password') : text(language, 'إظهار كلمة المرور', 'Show password')}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></div>
        {error && <p id="auth-error" className="auth-error" role="alert" data-testid="status-auth-error">{error}</p>}
         {mode === 'register' && <div className="field auth-field"><label htmlFor="auth-gender">{text(language, 'الجنس', 'Gender')}</label><select id="auth-gender" value={gender} onChange={e => setGender(e.target.value as '' | 'female' | 'male')} data-testid="select-auth-gender"><option value="" disabled>{text(language, 'اختر الجنس', 'Choose gender')}</option><option value="female">{text(language, 'أنثى', 'Female')}</option><option value="male">{text(language, 'ذكر', 'Male')}</option></select></div>}
         <div className="auth-options"><label htmlFor="remember-me"><input id="remember-me" type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} /> <span>{text(language, 'تذكرني', 'Remember me')}</span></label><button type="button" className="link-btn" onClick={forgotPassword}>{text(language, 'نسيت كلمة المرور؟', 'Forgot password?')}</button></div>
         <button className="primary-btn auth-submit" type="submit" data-testid="button-auth-submit">{mode === 'login' ? text(language, 'دخول إلى ثلاجتي', 'Enter my fridge') : text(language, 'إنشاء مساحتي', 'Create my space')}<ArrowLeft size={17} /></button>
         <div className="auth-divider"><span>{text(language, 'أو', 'or')}</span></div>
         <button className="secondary-btn auth-demo" type="button" onClick={demo} data-testid="button-demo-login"><Sparkles size={16} /> {text(language, 'تجربة ثلاجتي الآن', 'Try Smart Fridge')}</button>
         <p className="create-account">{mode === 'login' ? text(language, 'ليس لديك حساب؟', 'Don’t have an account?') : text(language, 'لديك حساب بالفعل؟', 'Already have an account?')} <button type="button" className="link-btn" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>{mode === 'login' ? text(language, 'أنشئ حساباً', 'Create one') : text(language, 'تسجيل الدخول', 'Sign in')}</button></p>
         <div className="auth-note"><LockKeyhole size={12} /> {text(language, 'بياناتك تبقى في هذا الجهاز، ومساحتك لك وحدك.', 'Your data stays on this device, and your space is private.')}</div>
      </form>
    </section>
  </main>;
}

const navItems = [
  { href: '/', ar: 'ثلاجتي', en: 'My fridge', icon: Home },
  { href: '/meals', ar: 'وجباتي', en: 'My meals', icon: Utensils },
  { href: '/daily-analysis', ar: 'تحليل يومي', en: 'Daily analysis', icon: Flame },
  { href: '/shopping', ar: 'قائمة التسوق', en: 'Shopping list', icon: ShoppingBasket },
];

function AppShell({ user, shoppingCount, children, onLogout }: { user: User; shoppingCount: number; children: ReactNode; onLogout: () => void }) {
  const [location] = useLocation();
  const { language } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(value => !value);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeSidebar();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    closeSidebar();
  }, [location]);

    return <SidebarContext.Provider value={{ sidebarOpen, toggleSidebar }}>
      <div className={`app-shell ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      <button className={`smart-sidebar-scrim ${sidebarOpen ? 'is-open' : ''}`} type="button" aria-hidden={!sidebarOpen} tabIndex={sidebarOpen ? 0 : -1} aria-label={text(language, 'إغلاق القائمة', 'Close menu')} onClick={closeSidebar} />
      <aside className="smart-sidebar" dir={language === 'ar' ? 'rtl' : 'ltr'} aria-label={text(language, 'القائمة الجانبية', 'Sidebar navigation')}>
        <div className="smart-sidebar__inner">
          <div className="smart-sidebar__head">
            <div className="smart-sidebar__brand" aria-label={text(language, 'ثلاجتي الذكية', 'Smart Fridge')}>
              <span className="smart-sidebar__brand-mark" aria-hidden="true"><Refrigerator size={18} /></span>
              <span className="smart-sidebar__brand-copy"><strong>{text(language, 'ثلاجتي', 'Smart Fridge')}</strong><small>{text(language, 'مساحتك الطازجة', 'Fresh space')}</small></span>
            </div>
            <button className="smart-sidebar__toggle" type="button" onClick={toggleSidebar} aria-label={sidebarOpen ? text(language, 'إغلاق القائمة', 'Close menu') : text(language, 'فتح القائمة', 'Open menu')} aria-expanded={sidebarOpen} data-testid="button-sidebar-toggle">{sidebarOpen ? <X size={18} /> : <Menu size={18} />}</button>
          </div>
          <nav className="smart-sidebar__nav" aria-label={text(language, 'التنقل الرئيسي', 'Main navigation')}>
             {navItems.map(item => { const Icon = item.icon; const label = text(language, item.ar, item.en); return <Link key={item.href} href={item.href} onClick={closeSidebar} aria-label={label} data-tooltip={label} className={`smart-sidebar__link ${location === item.href ? 'active' : ''}`} data-testid={`link-nav-${item.ar}`}>{item.href === '/shopping' ? <span className="smart-sidebar__shopping-icon"><span className="smart-sidebar__icon"><Icon size={18} aria-hidden="true" /></span><b className="smart-sidebar__count" aria-hidden="true">{shoppingCount}</b></span> : <span className="smart-sidebar__icon"><Icon size={18} aria-hidden="true" /></span>}<span className="smart-sidebar__label">{label}</span></Link>; })}
          </nav>
          <div className="smart-sidebar__footer">
              <Link href="/settings" onClick={closeSidebar} aria-label={text(language, 'الإعدادات', 'Settings')} data-tooltip={text(language, 'الإعدادات', 'Settings')} className={`smart-sidebar__link ${location === '/settings' ? 'active' : ''}`} data-testid="link-nav-settings"><span className="smart-sidebar__icon"><Settings size={18} aria-hidden="true" /></span><span className="smart-sidebar__label">{text(language, 'الإعدادات', 'Settings')}</span></Link>
             <button className="smart-sidebar__logout" onClick={onLogout} data-tooltip={text(language, 'تسجيل الخروج', 'Sign out')} aria-label={text(language, 'تسجيل الخروج', 'Sign out')} data-testid="button-logout"><span className="smart-sidebar__icon"><LogOut size={15} aria-hidden="true" /></span><span className="smart-sidebar__label">{text(language, 'تسجيل الخروج', 'Sign out')}</span></button>
          </div>
        </div>
      </aside>
    <div className="app-shell__content" style={{ minWidth: 0 }}>
        <header className={`mobile-topbar ${location === '/' ? 'mobile-topbar-dashboard' : ''} ${location.startsWith('/daily-analysis') ? 'mobile-topbar-daily-analysis' : ''} ${location.startsWith('/meals') || location.startsWith('/shopping') || location.startsWith('/daily-analysis') ? 'mobile-topbar-centered' : ''}`}>
         {!location.startsWith('/settings') && !location.startsWith('/daily-analysis') && !location.startsWith('/shopping') && !location.startsWith('/meals') && <button className="menu-toggle icon-btn" type="button" onClick={toggleSidebar} aria-label={sidebarOpen ? text(language, 'إغلاق القائمة', 'Close menu') : text(language, 'فتح القائمة', 'Open menu')} aria-expanded={sidebarOpen} data-testid="button-mobile-menu-legacy">{sidebarOpen ? <X size={19} /> : <Menu size={19} />}</button>}
          <div className="brand" aria-label={text(language, 'ثلاجتي الذكية', 'Smart Fridge')}>
            <span className="brand-mark" aria-hidden="true"><Refrigerator size={19} /></span>
            <span className="brand-copy"><strong>{text(language, 'ثلاجتي', 'Smart Fridge')}</strong><small>{text(language, 'مساحتك الطازجة', 'Fresh space')}</small></span>
          </div>
       </header>
      {children}
    </div>
      </div>
    </SidebarContext.Provider>;
}

function PageHeading({ title, description, action, eyebrow, hideMenu = false }: { title: string; description?: string; action?: ReactNode; eyebrow?: string; hideMenu?: boolean }) {
  const { language } = useLanguage();
  const { sidebarOpen, toggleSidebar } = useSidebarControls();
  const [location] = useLocation();
  const shouldHideMenu = hideMenu || location === '/meals' || location === '/shopping';
  return <div className="page-heading">
    {!shouldHideMenu && <button className="sidebar-inline-toggle page-heading-menu" type="button" onClick={toggleSidebar} aria-label={sidebarOpen ? text(language, 'إغلاق القائمة', 'Close menu') : text(language, 'فتح القائمة', 'Open menu')} aria-expanded={sidebarOpen} data-testid="button-page-menu">
      {sidebarOpen ? <X size={19} /> : <Menu size={19} />}
    </button>}
    <div className="page-heading-copy"><div className="eyebrow">{eyebrow || text(language, 'مساحتي اليومية', 'My daily space')}</div><h2>{title}</h2>{description && <p>{description}</p>}</div>
    {action && <div className="page-heading-action">{action}</div>}
  </div>;
}

function AddFoodModal({ onClose, onAdd }: { onClose: () => void; onAdd: (item: Omit<FridgeItem, 'id'>) => void }) {
  const { language } = useLanguage();
  const [form, setForm] = useState({ name: '', quantity: '1', unit: 'حبة', category: 'خضروات', expiry: '', calories: '80' });
  const update = (key: keyof typeof form, value: string) => setForm(prev => ({ ...prev, [key]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    const art = form.category === 'فواكه' ? 'apple' : form.category === 'ألبان' ? 'milk' : form.category === 'لحوم' ? 'chicken' : form.category === 'خضروات' ? 'leaf' : 'package';
    const expiry = form.expiry || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
    onAdd({ name: form.name.trim(), quantity: Math.max(1, Number(form.quantity) || 1), unit: form.unit, category: form.category, expiry, calories: Math.max(0, Number(form.calories) || 0), art });
    onClose();
  };
  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
     <div className="modal" role="dialog" aria-modal="true" aria-labelledby="add-food-title">
       <div className="modal-head"><div><h2 id="add-food-title">{text(language, 'إضافة إلى الثلاجة', 'Add to fridge')}</h2><p>{text(language, 'شيء جديد يستحق مكاناً في مساحتك.', 'Something new deserves a place in your space.')}</p></div><button className="icon-btn" onClick={onClose} aria-label={text(language, 'إغلاق', 'Close')} data-testid="button-close-add-food"><X size={18} /></button></div>
      <form className="form-grid" onSubmit={submit}>
         <div className="field full"><label htmlFor="food-name">{text(language, 'اسم الطعام', 'Food name')}</label><input autoFocus id="food-name" type="text" autoComplete="off" data-testid="input-food-name" value={form.name} onChange={e => update('name', e.target.value)} placeholder={text(language, 'اكتب اسم الطعام...', 'Type a food name...')} required /></div>
         <div className="field"><label htmlFor="food-quantity">{text(language, 'الكمية', 'Quantity')}</label><input id="food-quantity" type="number" min="1" data-testid="input-food-quantity" value={form.quantity} onChange={e => update('quantity', e.target.value)} /></div>
         <div className="field"><label htmlFor="food-unit">{text(language, 'الوحدة', 'Unit')}</label><select id="food-unit" data-testid="select-food-unit" value={form.unit} onChange={e => update('unit', e.target.value)}><option value="حبة">{text(language, 'حبة', 'Piece')}</option><option value="علبة">{text(language, 'علبة', 'Box')}</option><option value="كيس">{text(language, 'كيس', 'Bag')}</option><option value="قطعة">{text(language, 'قطعة', 'Item')}</option><option value="رأس">{text(language, 'رأس', 'Head')}</option><option value="عبوة">{text(language, 'عبوة', 'Pack')}</option></select></div>
         <div className="field"><label htmlFor="food-category">{text(language, 'القسم', 'Category')}</label><select id="food-category" data-testid="select-food-category" value={form.category} onChange={e => update('category', e.target.value)}><option value="خضروات">{text(language, 'خضروات', 'Vegetables')}</option><option value="فواكه">{text(language, 'فواكه', 'Fruits')}</option><option value="ألبان">{text(language, 'ألبان', 'Dairy')}</option><option value="لحوم">{text(language, 'لحوم', 'Meat')}</option><option value="جاهز">{text(language, 'جاهز', 'Ready meals')}</option><option value="مشروبات">{text(language, 'مشروبات', 'Drinks')}</option></select></div>
         <div className="field"><label htmlFor="food-expiry">{text(language, 'تاريخ الانتهاء', 'Expiry date')}</label><input id="food-expiry" type="date" data-testid="input-food-expiry" value={form.expiry} onChange={e => update('expiry', e.target.value)} /></div>
         <div className="calorie-preview"><span>{text(language, 'السعرات لكل وحدة', 'Calories per unit')}</span><strong>{Number(form.calories) || 0} <small>{text(language, 'سعرة', 'kcal')}</small></strong></div>
         <div className="field full"><label htmlFor="food-calories">{text(language, 'السعرات الحرارية', 'Calories')}</label><input id="food-calories" type="number" min="0" data-testid="input-food-calories" value={form.calories} onChange={e => update('calories', e.target.value)} /></div>
         <div className="form-actions"><button className="primary-btn" type="submit" data-testid="button-save-food"><Plus size={17} />{text(language, 'حفظ الطعام', 'Save food')}</button><button className="secondary-btn" type="button" onClick={onClose} data-testid="button-cancel-food">{text(language, 'إلغاء', 'Cancel')}</button></div>
      </form>
    </div>
  </div>;
}

function FridgeVisual({ items, selected, onSelect }: { items: FridgeItem[]; selected: FridgeItem | undefined; onSelect: (item: FridgeItem) => void }) {
  const { language } = useLanguage();
  const categories = [
    { title: text(language, 'البروتينات', 'Proteins'), match: 'لحوم', tone: 'protein', emoji: '🍗', note: text(language, 'جاهز للطهي', 'Ready to cook') },
    { title: text(language, 'الخضروات', 'Vegetables'), match: 'خضروات', tone: 'vegetables', emoji: '🥗', note: text(language, 'طازجة ومقرمشة', 'Fresh and crisp') },
    { title: text(language, 'الفواكه', 'Fruits'), match: 'فواكه', tone: 'fruit', emoji: '🍎', note: text(language, 'باردة ومنعشة', 'Chilled and fresh') },
    { title: text(language, 'الألبان', 'Dairy'), match: 'ألبان', tone: 'dairy', emoji: '🥛', note: text(language, 'محفوظة ببرودة', 'Kept chilled') },
    { title: text(language, 'المشروبات', 'Drinks'), match: 'مشروبات', tone: 'drinks', emoji: '🧃', note: text(language, 'جاهزة للتقديم', 'Ready to serve') },
    { title: text(language, 'وجبات جاهزة', 'Ready meals'), match: 'جاهز', tone: 'ready', emoji: '🍱', note: text(language, 'حل سريع ولذيذ', 'Quick and easy') },
  ];
  const renderFood = (item: FridgeItem) => <button key={item.id} className={`smart-food-card ${selected?.id === item.id ? 'selected' : ''}`} onClick={() => onSelect(item)} aria-pressed={selected?.id === item.id} aria-label={`${displayFoodName(item.name, language)}، ${toWesternNums(item.quantity)} ${item.unit}`} data-testid={`button-food-${item.id}`}>
    <span className="smart-food-visual"><FoodArt item={item} size={52} /><b className="quantity-badge" aria-hidden="true">{toWesternNums(item.quantity)}</b></span>
    <span className="smart-food-name">{displayFoodName(item.name, language)}</span>
  </button>;
  return <div className="smart-shelf-card">
    <div className="smart-shelf-grid">
      {categories.map(category => {
        const categoryItems = items.filter(item => item.category === category.match).slice(0, 8);
        return <section className={`smart-shelf-section ${category.tone}`} key={category.match} aria-labelledby={`smart-shelf-${category.match}`}>
          <div className="smart-shelf-section-head">
            <div className="smart-shelf-section-title">
              <span className="smart-shelf-emoji" aria-hidden="true">{category.emoji}</span>
              <div><h4 id={`smart-shelf-${category.match}`}>{category.title}</h4><p>{category.note}</p></div>
            </div>
            <span className="smart-shelf-count">{toWesternNums(categoryItems.length)} <small>{text(language, 'أصناف', 'items')}</small></span>
          </div>
          <div className="smart-shelf-foods" aria-label={category.title} data-testid={`shelf-items-${category.tone}`}>
            {categoryItems.length ? categoryItems.map(renderFood) : <span className="smart-shelf-empty">{text(language, 'لا توجد أصناف بعد', 'No items yet')}</span>}
          </div>
        </section>;
      })}
    </div>
    <div className="smart-shelf-foot"><span><CheckCircle2 size={15} aria-hidden="true" />{text(language, 'مساحتك مرتبة', 'Your space is organized')}</span><strong>{toWesternNums(items.length)} {text(language, 'أصناف محفوظة', 'items stored')}</strong></div>
  </div>;
}

function FoodDetailsDialog({
  item,
  quantity,
  onQuantityChange,
  onSave,
  onDelete,
  onClose,
}: {
  item: FridgeItem;
  quantity: string;
  onQuantityChange: (value: string) => void;
  onSave: (quantity: number) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const { language } = useLanguage();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [deletePending, setDeletePending] = useState(false);
  const [quantityError, setQuantityError] = useState('');

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, []);

  useEffect(() => {
    if (!window.matchMedia('(max-width: 560px)').matches) return;
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyOverscroll = body.style.overscrollBehavior;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'contain';
    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.overscrollBehavior = previousBodyOverscroll;
    };
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuantity = Number(quantity);
    if (!Number.isInteger(nextQuantity) || nextQuantity < 1) {
      setQuantityError(text(language, 'أدخل كمية صحيحة', 'Enter a valid quantity'));
      return;
    }
    setQuantityError('');
    onSave(nextQuantity);
  };

  return <div className="modal-backdrop food-details-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="food-details-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="food-details-title" tabIndex={-1}>
      <div className="food-details-head">
        <div>
          <span className="eyebrow">{text(language, 'تفاصيل الطعام', 'Food details')}</span>
          <h2 id="food-details-title">{displayFoodName(item.name, language)}</h2>
          <p>{text(language, 'حدّث الكمية أو أزل العنصر من ثلاجتك.', 'Update the quantity or remove this item from your fridge.')}</p>
        </div>
        <button className="icon-btn" type="button" onClick={onClose} aria-label={text(language, 'إغلاق التفاصيل', 'Close details')} data-testid="button-close-food-details"><X size={18} /></button>
      </div>
      <div className="food-details-summary">
        <FoodArt item={item} size={92} />
        <div>
          <strong>{displayFoodName(item.name, language)}</strong>
          <span>{toWesternNums(item.quantity)} {language === 'en' ? 'units' : item.unit}</span>
        </div>
      </div>
      <div className="food-details-stats">
        <div><small>{text(language, 'تاريخ الانتهاء', 'Expiry date')}</small><strong>{toWesternNums(new Date(item.expiry).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US'))}</strong></div>
        <div><small>{text(language, 'السعرات للوحدة', 'Calories per unit')}</small><strong>{toWesternNums(item.calories)} {text(language, 'سعرة', 'kcal')}</strong></div>
      </div>
      <form className="food-details-form" onSubmit={submit}>
        <div className="field">
          <label htmlFor="food-details-quantity">{text(language, 'كمية الطعام', 'Food quantity')}</label>
          <input id="food-details-quantity" type="number" min="1" step="1" inputMode="numeric" value={quantity} onChange={event => { onQuantityChange(event.target.value); setQuantityError(''); }} aria-describedby={quantityError ? 'food-details-quantity-error' : undefined} data-testid="input-food-details-quantity" />
          {quantityError && <p className="food-details-error" id="food-details-quantity-error" role="alert">{quantityError}</p>}
        </div>
        <div className="food-details-actions">
          {deletePending ? <div className="food-delete-confirm" role="alert">
            <span>{text(language, 'هل تريد حذف هذا العنصر؟', 'Delete this item?')}</span>
            <div><button className="danger-btn" type="button" onClick={onDelete} data-testid="button-confirm-delete-food">{text(language, 'تأكيد الحذف', 'Confirm deletion')}</button><button className="secondary-btn" type="button" onClick={() => setDeletePending(false)} data-testid="button-cancel-delete-food">{text(language, 'إلغاء الحذف', 'Cancel deletion')}</button></div>
          </div> : <button className="danger-btn" type="button" onClick={() => setDeletePending(true)} data-testid="button-delete-food"><Trash2 size={15} />{text(language, 'حذف العنصر', 'Delete item')}</button>}
          {!deletePending && <button className="primary-btn" type="submit" data-testid="button-save-food-details"><Check size={16} />{text(language, 'حفظ الكمية', 'Save quantity')}</button>}
        </div>
      </form>
    </div>
  </div>;
}

function Dashboard({ user, data, setData, onAdd, setNotice }: { user: User; data: UserData; setData: Dispatch<SetStateAction<UserData>>; onAdd: () => void; setNotice: (value: string) => void }) {
  const { language } = useLanguage();
  const { sidebarOpen, toggleSidebar } = useSidebarControls();
  const [selectedId, setSelectedId] = useState(data.items.find(item => item.id === 'eggs')?.id || data.items[0]?.id);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [quantityDraft, setQuantityDraft] = useState(String(data.items.find(item => item.id === 'eggs')?.quantity || data.items[0]?.quantity || 1));
  const [showAddButton, setShowAddButton] = useState(false);
  const fridgeEndRef = useRef<HTMLSpanElement>(null);
  const selected = data.items.find(item => item.id === selectedId) || data.items[0];
  const totalCalories = data.items.reduce((sum, item) => sum + item.calories * item.quantity, 0);
  const openFoodDetails = (item: FridgeItem) => {
    setSelectedId(item.id);
    setQuantityDraft(String(item.quantity));
    setDetailsOpen(true);
  };
  const selectFood = (item: FridgeItem) => {
    if (window.matchMedia('(max-width: 767px)').matches) {
      openFoodDetails(item);
      return;
    }
    setSelectedId(item.id);
  };
  const saveSelectedQuantity = (quantity: number) => {
    if (!selected) return;
    setData(prev => ({ ...prev, items: prev.items.map(item => item.id === selected.id ? { ...item, quantity } : item) }));
    setQuantityDraft(String(quantity));
    flash(setNotice, `${text(language, 'تم تحديث الكمية', 'Quantity updated')}: ${displayFoodName(selected.name, language)}`);
  };
  const deleteSelected = () => {
    if (!selected) return;
    const remaining = data.items.filter(item => item.id !== selected.id);
    setData(prev => ({ ...prev, items: prev.items.filter(item => item.id !== selected.id) }));
    setSelectedId(remaining[0]?.id);
    setDetailsOpen(false);
    flash(setNotice, `${text(language, 'تم حذف العنصر', 'Item deleted')}: ${displayFoodName(selected.name, language)}`);
  };
  const consume = () => {
    if (!selected) return;
    setData(prev => ({ ...prev, items: prev.items.map(item => item.id === selected.id ? { ...item, quantity: item.quantity - 1 } : item).filter(item => item.quantity > 0) }));
    flash(setNotice, `${text(language, 'تم تسجيل استهلاك', 'Consumption recorded')}: ${displayFoodName(selected.name, language)}`);
  };
  useEffect(() => {
    const endMarker = fridgeEndRef.current;
    if (!endMarker) return;
    if (!('IntersectionObserver' in window)) {
      setShowAddButton(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setShowAddButton(entry.isIntersecting), {
      threshold: 0,
      rootMargin: '0px 0px -48px 0px',
    });
    observer.observe(endMarker);
    return () => observer.disconnect();
  }, [data.items.length]);
  const percentage = Math.min(100, Math.round(totalCalories / data.calorieGoal * 100));
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('smart_fridge_read_notifications') || '[]'); } catch { return []; }
  });
  const refreshNotifications = () => setNotifications(checkAndGenerateNotifications(data, language));
  useEffect(() => {
    refreshNotifications();
    const timer = window.setInterval(refreshNotifications, 60000);
    return () => window.clearInterval(timer);
  }, [data, language]);
  const unreadCount = notifications.filter(item => !readIds.includes(item.id)).length;
  const markAllRead = () => {
    const ids = notifications.map(item => item.id);
    setReadIds(ids);
    localStorage.setItem('smart_fridge_read_notifications', JSON.stringify(ids));
  };
  const markRead = (id: string) => {
    setReadIds(previous => {
      if (previous.includes(id)) return previous;
      const next = [...previous, id];
      localStorage.setItem('smart_fridge_read_notifications', JSON.stringify(next));
      return next;
    });
  };
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setNotificationsOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);
  return <main className={`app-main dashboard-main ${notificationsOpen ? 'notifications-open' : ''}`}>
     <button className={`notification-scrim ${notificationsOpen ? 'is-open' : ''}`} type="button" aria-hidden={!notificationsOpen} tabIndex={notificationsOpen ? 0 : -1} aria-label={text(language, 'إغلاق الإشعارات', 'Close notifications')} onClick={() => setNotificationsOpen(false)} />
     <div className="dashboard-topbar">
       <div className="dashboard-header-start">
        <button className="sidebar-inline-toggle" type="button" onClick={toggleSidebar} aria-label={sidebarOpen ? text(language, 'إغلاق القائمة', 'Close menu') : text(language, 'فتح القائمة', 'Open menu')} aria-expanded={sidebarOpen} data-testid="button-mobile-menu">
         {sidebarOpen ? <X size={19} /> : <Menu size={19} />}
       </button>
       <div className="dashboard-header-context">
          <span className="eyebrow dashboard-header-label">{text(language, 'ملخص اليوم', 'Today at a glance')}</span>
          <strong className="dashboard-welcome"><span>{text(language, 'أهلاً بعودتك،', 'Welcome back,')}</span> <b>{user.name}</b></strong>
          <span className="dashboard-header-date">{formatArabicDate(language)}</span>
        </div>
       </div>
        <div className="dashboard-metrics" aria-label={text(language, 'ملخص اليوم', 'Daily summary')}>
         <div className="dashboard-stat">
           <Flame size={21} aria-hidden="true" />
           <div><small>{text(language, 'الهدف اليومي', 'Daily goal')}</small><strong>{toWesternNums(data.calorieGoal.toLocaleString('en-US'))} {text(language, 'سعرة', 'kcal')}</strong></div>
         </div>
         <div className="dashboard-stat">
           <div className="mini-ring" style={{ '--ring-progress': `${percentage}%` } as CSSProperties}><strong>{toWesternNums(percentage)}%</strong></div>
           <div><small>{text(language, 'المتناول اليوم', 'Calories eaten')}</small><strong>{toWesternNums(totalCalories.toLocaleString('en-US'))} {text(language, 'سعرة', 'kcal')}</strong></div>
         </div>
          <div className="dashboard-stat water-header-stat">
            <Droplets size={21} aria-hidden="true" />
            <div><small>{text(language, 'الماء اليوم', 'Water intake')}</small><strong>{toWesternNums(data.water)} / 8 {text(language, 'أكواب', 'cups')}</strong></div>
          </div>
       </div>
       <div className="dashboard-actions">
          <div className="notification-wrap">
           <button className="topbar-bell icon-btn" aria-label={`${text(language, 'التنبيهات', 'Notifications')}${unreadCount ? `، ${toWesternNums(unreadCount)} ${text(language, 'جديدة', 'new')}` : ''}`} aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen(value => !value)} data-testid="button-notifications"><Bell size={20} /></button>
           {unreadCount > 0 && <b className="notification-count">{toWesternNums(unreadCount)}</b>}
            <div className={`notification-dropdown ${notificationsOpen ? 'is-open' : ''}`} role="region" aria-label={text(language, 'قائمة التنبيهات', 'Notifications list')} aria-hidden={!notificationsOpen}>
               <div className="notification-head"><div className="notification-head-copy"><strong>{text(language, 'التنبيهات', 'Notifications')}</strong><span>{unreadCount ? `${toWesternNums(unreadCount)} ${text(language, 'جديدة', 'new')}` : text(language, 'كل التنبيهات مقروءة', 'All caught up')}</span></div><div className="notification-head-actions">{unreadCount > 0 && <button className="link-btn" onClick={markAllRead}>{text(language, 'تعليم الكل كمقروء', 'Mark all as read')}</button>}<button className="notification-close icon-btn" type="button" onClick={() => setNotificationsOpen(false)} aria-label={text(language, 'إغلاق الإشعارات', 'Close notifications')} data-testid="button-close-notifications"><X size={18} aria-hidden="true" /></button></div></div>
              <div className="notification-list">{notifications.length ? notifications.map(item => <button type="button" className={`notification-item notification-${item.type} ${readIds.includes(item.id) ? 'is-read' : ''}`} key={item.id} onClick={() => markRead(item.id)} aria-label={`${item.title}: ${item.message}`}><span className="notification-icon" aria-hidden="true">{item.icon}</span><span className="notification-copy"><strong>{item.title}</strong><span>{item.message}</span><small>{item.time}</small></span><span className="notification-arrow" aria-hidden="true"><ChevronLeft size={14} /></span></button>) : <div className="notification-empty">{text(language, 'لا توجد إشعارات جديدة 🎉', 'No new notifications 🎉')}</div>}</div>
            </div>
         </div>
           <Link href="/settings?section=profile" className="dashboard-profile" aria-label={text(language, 'فتح معلومات الملف الشخصي', 'Open profile information')} data-testid="link-dashboard-profile">
            <ProfileAvatar gender={user.gender} />
            <div><strong>{user.name}</strong><small>{text(language, 'معلومات الملف الشخصي', 'Profile Information')}</small></div>
          </Link>
       </div>
    </div>
        <div className="reference-heading"><h2>{text(language, 'محتويات ثلاجتك', 'Your fridge contents')}</h2></div>
    <div className="reference-dashboard">
       <section className="reference-fridge"><FridgeVisual items={data.items} selected={selected} onSelect={selectFood} /><span className="fridge-end-sentinel" ref={fridgeEndRef} aria-hidden="true" /></section>
      <aside className="reference-rail">
           <div className="item-detail-panel card card-pad"><div className="rail-title"><span>{text(language, 'تفاصيل العنصر', 'Item details')}</span></div>{selected ? <><div className="detail-hero" key={selected.id}><FoodArt item={selected} size={108} /><h3>{displayFoodName(selected.name, language)}</h3><span>{toWesternNums(selected.quantity)} {language === 'en' ? 'units' : selected.unit}</span></div><div className="detail-stats"><div><small>{text(language, 'تاريخ الانتهاء', 'Expiry date')}</small><strong>{toWesternNums(new Date(selected.expiry).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US'))}</strong></div><div><small>{text(language, 'إجمالي السعرات', 'Total calories')}</small><strong>{toWesternNums(selected.calories * selected.quantity)} {text(language, 'سعرة', 'kcal')}</strong></div><div><small>{text(language, 'السعرات للوحدة', 'Calories per unit')}</small><strong>{toWesternNums(selected.calories)} {text(language, 'سعرة', 'kcal')}</strong></div></div><div className="detail-actions"><button className="secondary-btn" onClick={() => openFoodDetails(selected)} data-testid="button-edit-selected"><Pencil size={15} />{text(language, 'تعديل', 'Edit')}</button><button className="primary-btn" onClick={consume} data-testid="button-consume-food"><Check size={16} />{text(language, 'استهلكت', 'Consumed')}</button><button className="icon-btn" onClick={onAdd} data-testid="button-add-related"><Plus size={17} /> <span>{text(language, 'إضافة', 'Add')}</span></button></div></> : <div className="empty-state">{text(language, 'الثلاجة فارغة', 'The fridge is empty')}</div>}</div>
          <div className="shopping-panel card card-pad"><div className="rail-title"><span className="shopping-heading"><span className="shopping-heading-icon"><ShoppingBasket size={17} aria-hidden="true" /><b className="shopping-count-badge" aria-label={`${toWesternNums(data.shopping.filter(item => !item.done).length)} ${text(language, 'احتياجات متبقية', 'items remaining')}`}>{toWesternNums(data.shopping.filter(item => !item.done).length)}</b></span><span className="shopping-heading-label">{text(language, 'قائمة التسوق', 'Shopping list')}</span></span><Link href="/shopping"><ChevronLeft size={16} /></Link></div><ShoppingPreview data={data} setData={setData} /><Link href="/shopping" className="export-list"><ClipboardCopy size={15} /> {text(language, 'تصدير القائمة', 'Export list')}</Link></div>
      </aside>
    </div>
         <div className="dashboard-footer">
           <div className="macro-stat" aria-label={text(language, 'إحصائية توزيع المغذيات', 'Nutrient distribution statistic')}><small>{text(language, 'توزيع المغذيات', 'Nutrients')}</small><div className="macro-lines"><span><i className="macro-protein" />{text(language, 'بروتين', 'Protein')} <b>35%</b></span><span><i className="macro-carb" />{text(language, 'كربوهيدرات', 'Carbohydrates')} <b>40%</b></span><span><i className="macro-fat" />{text(language, 'دهون صحية', 'Healthy fats')} <b>25%</b></span></div></div>
           <div className="health-tip" aria-label={text(language, 'نصيحة اليوم', 'Daily tip')}><Leaf size={20} /><div><small>{text(language, 'نصيحة اليوم', 'Tip of the day')}</small><strong>{text(language, 'تناول الخضروات في كل وجبة', 'Eat vegetables with every meal')}<br />{text(language, 'للحصول على صحة أفضل.', 'for better health.')}</strong></div></div>
             <button className={`floating-add ${showAddButton ? 'is-visible' : ''} ${sidebarOpen ? 'is-sidebar-hidden' : ''}`} onClick={onAdd} data-testid="button-add-food-dashboard" aria-label={text(language, 'أضف طعاماً جديداً', 'Add new food')} aria-hidden={!showAddButton || sidebarOpen} tabIndex={showAddButton && !sidebarOpen ? 0 : -1}><Plus size={26} /><span>{text(language, 'أضف طعاماً جديداً', 'Add new food')}</span></button>
         </div>
          {detailsOpen && selected && <FoodDetailsDialog item={selected} quantity={quantityDraft} onQuantityChange={setQuantityDraft} onSave={saveSelectedQuantity} onDelete={deleteSelected} onClose={() => setDetailsOpen(false)} />}
  </main>;
}

function ShoppingPreview({ data, setData }: { data: UserData; setData: Dispatch<SetStateAction<UserData>> }) {
  const { language } = useLanguage();
  const visible = data.shopping.slice(0, 4);
  return <div className="shopping-list">{visible.length ? visible.map(item => <div className={`shopping-item ${item.done ? 'done' : ''}`} key={item.id}><input type="checkbox" checked={item.done} onChange={() => setData(prev => ({ ...prev, shopping: prev.shopping.map(row => row.id === item.id ? { ...row, done: !row.done } : row) }))} data-testid={`checkbox-shopping-${item.id}`} /><label>{displayFoodName(item.name, language)}</label><span className="item-quantity">{displayShoppingQuantity(item.quantity, language)}</span></div>) : <div className="empty-state" style={{ padding: 20 }}><ShoppingBasket size={23} /><strong>{text(language, 'قائمتك فارغة', 'Your list is empty')}</strong><span>{text(language, 'أضف ما ينقصك.', 'Add what is missing.')}</span></div>}</div>;
}

function RecipeCard({ recipe, favorite, onFavorite, compact = false }: { recipe: Recipe; favorite: boolean; onFavorite: () => void; compact?: boolean }) {
  const { language } = useLanguage();
  return <article className={`recipe-card ${compact ? 'recipe-compact' : ''}`}>
    <div className="recipe-visual">
      <RemoteFoodImage foodName={recipe.name} alt={displayFoodName(recipe.name, language)} />
      <span className="recipe-difficulty">{text(language, 'سهل', 'Easy')}</span>
      <button className="icon-btn" style={{ marginRight: 'auto', position: 'relative', zIndex: 2, color: favorite ? 'hsl(var(--destructive))' : undefined }} onClick={onFavorite} data-testid={`button-favorite-${recipe.id}`} aria-label={text(language, 'إضافة للمفضلة', 'Save to favorites')}><Heart size={16} fill={favorite ? 'currentColor' : 'none'} /></button>
    </div>
     <div className="recipe-body"><h3>{displayFoodName(recipe.name, language)}</h3><p>{recipe.description}</p><div className="recipe-meta"><span>{toWesternNums(recipe.time)}</span><span>{toWesternNums(recipe.calories)} {text(language, 'سعرة', 'kcal')}</span></div><button className="recipe-view-btn" type="button" data-testid={`button-view-recipe-${recipe.id}`}>{text(language, 'عرض الوصفة', 'View recipe')}</button></div>
  </article>;
}

function MealsPage({ data, setData, setNotice }: { data: UserData; setData: Dispatch<SetStateAction<UserData>>; setNotice: (v: string) => void }) {
  const { language } = useLanguage();
  const [name, setName] = useState('');
  const [time, setTime] = useState('08:00');
  const [planned, setPlanned] = useState<{ id: string; name: string; time: string }[]>([]);
  const addMeal = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    setPlanned(prev => [...prev, { id: `m-${Date.now()}`, name: name.trim(), time }]);
    setName('');
    flash(setNotice, text(language, 'أضيفت الوجبة إلى يومك', 'Meal added to your day'));
  };
  return <main className="app-main"><PageHeading title={text(language, 'وجباتي', 'My meals')} description={text(language, 'أضف وجباتك وخطط ليومك بنفسك.', 'Add your own meals and plan your day.')} /><div className="card card-pad"><div className="card-title"><div><h3>{text(language, 'إضافة وجبة', 'Add a meal')}</h3><p>{text(language, 'اكتب اسم الوجبة وحدد وقتها.', 'Enter a meal name and choose its time.')}</p></div><Utensils size={20} color="hsl(var(--primary))" /></div><form className="form-grid" onSubmit={addMeal}><div className="field full"><label htmlFor="meal-name">{text(language, 'اسم الوجبة', 'Meal name')}</label><input id="meal-name" className="search-box" value={name} onChange={e => setName(e.target.value)} placeholder={text(language, 'مثال: فطور صحي', 'Example: Healthy breakfast')} required data-testid="input-meal-name" /></div><div className="field"><label htmlFor="meal-time">{text(language, 'الوقت', 'Time')}</label><input id="meal-time" className="search-box" type="time" value={time} onChange={e => setTime(e.target.value)} data-testid="input-meal-time" /></div><div className="form-actions"><button className="primary-btn" type="submit" data-testid="button-add-meal"><Plus size={17} />{text(language, 'إضافة وجبة', 'Add meal')}</button></div></form></div><div className="card card-pad" style={{ marginTop: 21 }}><div className="card-title"><div><h3>{text(language, 'خطة اليوم', 'Today’s plan')}</h3><p>{text(language, 'وجباتك التي أضفتها بنفسك', 'Meals you added yourself')}</p></div><span className="status-pill">{planned.length} {text(language, 'وجبات', 'meals')}</span></div><div className="table-list">{planned.length ? planned.map(item => <div className="data-row" key={item.id}><strong><Utensils size={15} style={{ verticalAlign: 'middle', marginLeft: 7, color: 'hsl(var(--primary))' }} />{item.name}</strong><span>{item.time}</span><button className="icon-btn" onClick={() => setPlanned(prev => prev.filter(row => row.id !== item.id))} aria-label={text(language, 'حذف الوجبة', 'Delete meal')} data-testid={`button-remove-meal-${item.id}`}><Trash2 size={15} /></button></div>) : <div className="empty-state"><Utensils size={30} /><strong>{text(language, 'لم تضف وجبات بعد', 'No meals added yet')}</strong><span>{text(language, 'ابدأ بإضافة أول وجبة ليومك.', 'Start by adding your first meal.')}</span></div>}</div></div></main>;
}

function DailyAnalysis({ data }: { data: UserData }) {
  const { language } = useLanguage();
  const total = data.items.reduce((sum, item) => sum + item.calories * item.quantity, 0);
  const goal = data.calorieGoal;
  const days = language === 'ar' ? ['س', 'ح', 'ن', 'ث', 'ر', 'خ', 'ج'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const chartPercents = [42, 58, 36, 72, 64, Math.min(92, goal > 0 ? total / goal * 100 : 0), 28];
  const chartData = chartPercents.map((percent, index) => ({ day: days[index], calories: Math.round(goal * percent / 100) }));
  const nutrients = [
    { ar: 'بروتين', en: 'Protein', value: 32, color: 'var(--daily-sage)' },
    { ar: 'كربوهيدرات', en: 'Carbohydrates', value: 46, color: 'var(--daily-gold)' },
    { ar: 'دهون صحية', en: 'Healthy fats', value: 22, color: 'var(--daily-water)' },
  ];
  return <main className="app-main daily-analysis-page">
    <PageHeading title={text(language, 'تحليل يومي', 'Daily analysis')} description={text(language, 'نظرة هادئة على اختياراتك، بدون أحكام.', 'A calm look at your choices, without judgment.')} hideMenu action={<div className="date-chip">{formatArabicDate(language)}</div>} />
    <div className="daily-analysis-grid">
      <section className="card card-pad daily-analysis-card daily-chart-card" aria-labelledby="daily-calorie-heading">
        <div className="card-title">
          <div><h3 id="daily-calorie-heading">{text(language, 'إيقاع السعرات', 'Calorie rhythm')}</h3><p>{text(language, 'آخر سبعة أيام', 'Last seven days')}</p></div>
          <span className="daily-card-icon"><Flame size={18} aria-hidden="true" /></span>
        </div>
        <div className="daily-chart" role="img" aria-label={text(language, 'رسم يوضح إيقاع السعرات خلال آخر سبعة أيام', 'Chart showing your calorie rhythm over the last seven days')}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 12, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="daily-area-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.015} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="hsl(var(--border) / .58)" strokeDasharray="3 6" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} dy={10} />
              <YAxis hide domain={[0, 'dataMax + 260']} />
              <Tooltip cursor={{ stroke: 'hsl(var(--primary) / .24)', strokeWidth: 1 }} contentStyle={{ background: 'hsl(var(--card) / .92)', border: '1px solid hsl(var(--border) / .75)', borderRadius: 12, boxShadow: '0 10px 24px hsl(155 20% 26% / .12)', color: 'hsl(var(--foreground))', direction: language === 'ar' ? 'rtl' : 'ltr' }} labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: 3 }} />
              <Area type="monotone" dataKey="calories" name={text(language, 'السعرات', 'Calories')} stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#daily-area-fill)" dot={{ r: 3, fill: 'hsl(var(--card))', stroke: 'hsl(var(--primary))', strokeWidth: 2 }} activeDot={{ r: 5, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--card))', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="daily-chart-legend"><span><i className="daily-legend-dot" />{text(language, 'هدفك اليومي', 'Your daily goal')}</span><strong>{toWesternNums(goal)} {text(language, 'سعرة', 'kcal')}</strong></div>
      </section>
      <section className="card card-pad daily-analysis-card daily-nutrients-card" aria-labelledby="daily-nutrients-heading">
        <div className="card-title">
          <div><h3 id="daily-nutrients-heading">{text(language, 'توزيع المغذيات', 'Nutrients')}</h3><p>{text(language, 'نسب متوازنة ليومك', 'Balanced portions for your day')}</p></div>
          <span className="daily-card-icon daily-card-icon-gold"><Sparkles size={17} aria-hidden="true" /></span>
        </div>
        <div className="daily-nutrient-list">
          {nutrients.map(nutrient => <div className="daily-nutrient-row" key={nutrient.en}>
            <span className="daily-ring" style={{ '--ring-progress': `${nutrient.value}%`, '--ring-color': nutrient.color } as CSSProperties} aria-label={`${toWesternNums(nutrient.value)}%`}>
              <strong>{toWesternNums(nutrient.value)}%</strong>
            </span>
            <span className="daily-nutrient-copy"><b>{text(language, nutrient.ar, nutrient.en)}</b><small>{text(language, 'من احتياجك اليومي', 'of your daily balance')}</small></span>
          </div>)}
        </div>
      </section>
      <section className="card card-pad full-card daily-analysis-card daily-summary-card" aria-labelledby="daily-summary-heading">
        <div className="card-title">
          <div><h3 id="daily-summary-heading">{text(language, 'ملخص لطيف', 'A gentle summary')}</h3><p>{text(language, 'مقارنة بهدفك اليومي', 'Compared with your daily goal')}</p></div>
          <span className="daily-card-icon daily-card-icon-check"><CheckCircle2 size={18} aria-hidden="true" /></span>
        </div>
        <div className="metric-row daily-metric-row">
          <div className="metric daily-metric"><Flame size={18} className="metric-icon" /><strong>{toWesternNums(total.toLocaleString('en-US'))}</strong><span>{text(language, 'السعرات المتاحة في الثلاجة', 'Calories in your fridge')}</span></div>
          <div className="metric daily-metric"><Droplets size={18} className="metric-icon" /><strong>{toWesternNums(data.water)} / 8</strong><span>{text(language, 'أكواب الماء اليوم', 'Water cups today')}</span></div>
          <div className="metric daily-metric"><Leaf size={18} className="metric-icon" /><strong>{toWesternNums(data.items.filter(item => item.category === 'خضروات').length)}</strong><span>{text(language, 'أصناف نباتية', 'Plant-based items')}</span></div>
          <div className="metric daily-metric"><Zap size={18} className="metric-icon" /><strong>{toWesternNums(Math.max(0, goal - total))}</strong><span>{text(language, 'سعرة متبقية للهدف', 'kcal left to goal')}</span></div>
        </div>
      </section>
    </div>
  </main>;
}

function ShoppingPage({ data, setData, setNotice, onAdd }: { data: UserData; setData: Dispatch<SetStateAction<UserData>>; setNotice: (v: string) => void; onAdd: () => void }) {
  const { language } = useLanguage();
  const [input, setInput] = useState(''); const [quantity, setQuantity] = useState('1');
  const add = () => { if (!input.trim()) return; setData(prev => ({ ...prev, shopping: [...prev.shopping, { id: `s-${Date.now()}`, name: input.trim(), quantity, done: false }] })); setInput(''); flash(setNotice, text(language, 'أضيفت للقائمة', 'Added to the list')); };
  const exportList = async () => { const listText = data.shopping.filter(item => !item.done).map(item => `- ${item.name} (${item.quantity})`).join('\n'); try { await navigator.clipboard.writeText(listText); flash(setNotice, text(language, 'تم نسخ العناصر المتبقية كنص', 'Remaining items copied as text')); } catch { flash(setNotice, text(language, 'حدّد القائمة وانسخها', 'Select the list and copy it')); } };
  const lowStock = data.items.filter(item => item.quantity <= 1 && !data.shopping.some(row => row.name === item.name));
  return <main className="app-main shopping-page">
    <PageHeading
      title={text(language, 'قائمة التسوق', 'Shopping list')}
      description={text(language, 'كل ما تحتاجه رحلتك القادمة، في مكان واحد.', 'Everything you need for your next trip, in one place.')}
      hideMenu
      action={<div className="page-actions">
        <button className="secondary-btn" onClick={exportList} title={text(language, 'ينسخ العناصر غير المكتملة كنص للمشاركة أو اللصق', 'Copy unfinished items as text to share or paste')} aria-label={text(language, 'نسخ العناصر غير المكتملة كنص للمشاركة أو اللصق', 'Copy unfinished items as text to share or paste')} data-testid="button-copy-shopping"><ClipboardCopy size={16} />{text(language, 'نسخ كنص', 'Copy as text')}</button>
        <button className="primary-btn" onClick={onAdd} data-testid="button-shopping-add-food"><Plus size={17} />{text(language, 'إضافة للثلاجة', 'Add to fridge')}</button>
      </div>}
    />
    <div className="shopping-layout">
      <section className="card card-pad shopping-list-card" aria-labelledby="shopping-list-heading">
        <div className="shopping-section-heading">
          <div>
            <h3 id="shopping-list-heading">{text(language, 'قائمتك', 'Your list')}</h3>
            <p>{toWesternNums(data.shopping.filter(item => !item.done).length)} {text(language, 'عناصر متبقية', 'items remaining')}</p>
          </div>
          <button className="icon-btn shopping-clear-button" onClick={() => setData(prev => ({ ...prev, shopping: prev.shopping.filter(item => !item.done) }))} aria-label={text(language, 'حذف العناصر المكتملة', 'Clear completed items')} data-testid="button-clear-done"><Trash2 size={16} /></button>
        </div>
        <div className="shopping-list shopping-list-primary">
          {data.shopping.map(item => <div className={`shopping-item shopping-item-main ${item.done ? 'done' : ''}`} key={item.id}>
            <label className="shopping-check">
              <input type="checkbox" checked={item.done} onChange={() => setData(prev => ({ ...prev, shopping: prev.shopping.map(row => row.id === item.id ? { ...row, done: !row.done } : row) }))} aria-label={`${text(language, 'تحديد', 'Mark')} ${displayFoodName(item.name, language)}`} data-testid={`checkbox-shopping-full-${item.id}`} />
              <span className="shopping-checkmark" aria-hidden="true"><Check size={15} /></span>
            </label>
            <span className="shopping-item-copy"><strong>{displayFoodName(item.name, language)}</strong><small>{displayShoppingQuantity(item.quantity, language)}</small></span>
            <button className="icon-btn shopping-delete" onClick={() => setData(prev => ({ ...prev, shopping: prev.shopping.filter(row => row.id !== item.id) }))} aria-label={`${text(language, 'حذف العنصر', 'Delete item')}: ${displayFoodName(item.name, language)}`} data-testid={`button-delete-shopping-${item.id}`}><X size={14} /></button>
          </div>)}
          {!data.shopping.length && <div className="empty-state shopping-empty-state"><ShoppingBasket size={28} /><strong>{text(language, 'السلة فارغة الآن', 'Your basket is empty')}</strong><span>{text(language, 'أضف شيئاً قبل أن تنساه.', 'Add something before you forget.')}</span></div>}
        </div>
        <form className="shopping-add-row shopping-add-form" onSubmit={event => { event.preventDefault(); add(); }}>
          <label className="sr-only" htmlFor="shopping-name">{text(language, 'اسم العنصر', 'Item name')}</label>
          <input id="shopping-name" className="search-box" value={input} onChange={e => setInput(e.target.value)} placeholder={text(language, 'أضف عنصراً...', 'Add an item...')} data-testid="input-shopping-name" />
          <label className="sr-only" htmlFor="shopping-quantity">{text(language, 'الكمية', 'Quantity')}</label>
          <input id="shopping-quantity" className="search-box" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder={text(language, 'الكمية', 'Qty')} data-testid="input-shopping-quantity" />
          <button className="primary-btn shopping-add-button" type="submit" data-testid="button-add-shopping" aria-label={text(language, 'إضافة عنصر', 'Add item')}><Plus size={17} /></button>
        </form>
      </section>

      <div className="shopping-side-column">
        <section className="card card-pad shopping-suggestions-card" aria-labelledby="shopping-suggestions-heading">
          <div className="shopping-section-heading">
            <div>
              <h3 id="shopping-suggestions-heading">{text(language, 'اقتراحات ذكية', 'Smart suggestions')}</h3>
              <p>{text(language, 'أصناف قاربت على النفاد', 'Items running low')}</p>
            </div>
            <span className="shopping-section-icon"><Sparkles size={16} aria-hidden="true" /></span>
          </div>
          {lowStock.length ? <div className="shopping-suggestions">{lowStock.map(item => <div className="shopping-suggestion" key={item.id}>
            <span className="shopping-suggestion-art"><FoodArt item={item} size={25} /></span>
            <span className="shopping-item-copy"><strong>{displayFoodName(item.name, language)}</strong><small>{text(language, 'اقتراح لإعادة التخزين', 'Restock suggestion')}</small></span>
            <button className="secondary-btn shopping-suggestion-button" onClick={() => setData(prev => ({ ...prev, shopping: [...prev.shopping, { id: `s-${Date.now()}`, name: item.name, quantity: item.unit, done: false }] }))} data-testid={`button-suggest-${item.id}`} aria-label={`${text(language, 'إضافة', 'Add')} ${displayFoodName(item.name, language)}`}><Plus size={13} />{text(language, 'أضف', 'Add')}</button>
          </div>)}</div> : <div className="empty-state shopping-small-empty"><CheckCircle2 size={24} /><strong>{text(language, 'مخزونك بخير', 'Your stock is healthy')}</strong><span>{text(language, 'لا توجد اقتراحات عاجلة.', 'No urgent suggestions.')}</span></div>}
        </section>

        <section className="card card-pad shopping-note-card" aria-labelledby="shopping-note-heading">
          <div className="shopping-section-heading">
            <div><h3 id="shopping-note-heading">{text(language, 'ملاحظة للمتجر', 'Note for the store')}</h3></div>
            <Pencil size={16} aria-hidden="true" />
          </div>
          <label className="sr-only" htmlFor="shopping-note">{text(language, 'ملاحظة للمتجر', 'Note for the store')}</label>
          <textarea id="shopping-note" value={data.note} onChange={e => setData(prev => ({ ...prev, note: e.target.value }))} placeholder={text(language, 'مثال: اختر الطماطم الناضجة...', 'Example: choose ripe tomatoes...')} data-testid="textarea-shopping-note" />
        </section>
      </div>
    </div>
  </main>;
}

function RecipesPage({ data, setData }: { data: UserData; setData: Dispatch<SetStateAction<UserData>> }) {
  const [query, setQuery] = useState(''); const filtered = recipes.filter(recipe => recipe.name.includes(query) || recipe.description.includes(query) || recipe.tags.some(tag => tag.includes(query)));
  const toggle = (id: string) => setData(prev => ({ ...prev, favorites: prev.favorites.includes(id) ? prev.favorites.filter(item => item !== id) : [...prev.favorites, id] }));
  return <main className="app-main"><PageHeading title="وصفات مقترحة" description="أفكار لذيذة، تبدأ مما هو موجود عندك." action={<Link href="/favorites" className="secondary-btn" data-testid="link-recipes-favorites"><Heart size={16} />مفضلاتي</Link>} /><div className="toolbar"><div className="search-box"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="ابحثي عن وصفة..." data-testid="input-recipe-search" /></div><span className="date-chip">{toWesternNums(filtered.length)} وصفات</span></div><div className="recipe-grid">{filtered.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} favorite={data.favorites.includes(recipe.id)} onFavorite={() => toggle(recipe.id)} />)}</div>{!filtered.length && <div className="card empty-state"><Search size={30} /><strong>لم نجد هذه المرة</strong><span>جربي كلمة أخرى أو تصفحي كل الوصفات.</span></div>}</main>;
}

function FavoritesPage({ data, setData }: { data: UserData; setData: Dispatch<SetStateAction<UserData>> }) {
  const favorites = recipes.filter(recipe => data.favorites.includes(recipe.id));
  return <main className="app-main"><PageHeading title="المفضلة" description="الوصفات التي نالت إعجابك، قريبة دائماً." /><div className="card card-pad">{favorites.length ? <div className="recipe-grid">{favorites.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} favorite onFavorite={() => setData(prev => ({ ...prev, favorites: prev.favorites.filter(id => id !== recipe.id) }))} />)}</div> : <div className="empty-state"><Heart size={35} /><strong>لم تختر مفضلات بعد</strong><span>اضغط على القلب بجانب أي وصفة لحفظها هنا.</span><Link href="/recipes" className="primary-btn" style={{ marginTop: 18 }} data-testid="link-empty-favorites">تصفح الوصفات</Link></div>}</div></main>;
}

function SettingsPage({ user, data, setData, setNotice, onUserUpdate }: { user: User; data: UserData; setData: Dispatch<SetStateAction<UserData>>; setNotice: (v: string) => void; onUserUpdate: (updates: UserProfileUpdate) => void }) {
  const { language } = useLanguage();
    const sections = [
      { key: 'عام', ar: 'عام', en: 'General' },
      { key: 'معلومات الملف الشخصي', ar: 'الحساب', en: 'Profile' },
      { key: 'المظهر', ar: 'المظهر', en: 'Theme' },
      { key: 'التنبيهات', ar: 'التنبيهات', en: 'Alerts' },
      { key: 'الخصوصية', ar: 'الخصوصية', en: 'Privacy' },
    ] as const;
   const [location] = useLocation();
   const requestedSection = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : location.split('?')[1] || '').get('section');
   const [section, setSection] = useState<string>(requestedSection === 'profile' ? 'معلومات الملف الشخصي' : sections[0].key);
  const [goal, setGoal] = useState(String(data.calorieGoal));
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profilePassword, setProfilePassword] = useState('');
  const [profileError, setProfileError] = useState('');
  const saveGoal = () => {
    const number = Number(goal);
    if (number > 500) {
      setData(prev => ({ ...prev, calorieGoal: number }));
      flash(setNotice, text(language, 'تم تحديث هدف السعرات', 'Calorie goal updated'));
    }
  };
  const saveProfile = (event: FormEvent) => {
    event.preventDefault();
    const name = profileName.trim();
    const email = profileEmail.trim().toLowerCase();
    if (!name || !email) {
      setProfileError(text(language, 'اكتب الاسم والبريد الإلكتروني أولاً.', 'Enter your name and email first.'));
      return;
    }
    if (profilePassword && profilePassword.length < 4) {
      setProfileError(text(language, 'كلمة السر يجب أن تكون 4 أحرف على الأقل.', 'Password must be at least 4 characters.'));
      return;
    }
    const otherUserUsesEmail = readStoredUsers().some(candidate => candidate.id !== user.id && candidate.email === email);
    if (otherUserUsesEmail) {
      setProfileError(text(language, 'هذا البريد مستخدم لحساب آخر.', 'This email is already used by another account.'));
      return;
    }
    onUserUpdate({ name, email, ...(profilePassword ? { password: profilePassword } : {}) });
    setProfileName(name);
    setProfileEmail(email);
    setProfilePassword('');
    setProfileError('');
    flash(setNotice, text(language, 'تم حفظ بيانات الحساب', 'Account details saved'));
  };
   const sectionLabel = (item: typeof sections[number]) => language === 'ar' ? item.ar : item.en;
  return <main className="app-main">
    <PageHeading title={text(language, 'الإعدادات', 'Settings')} hideMenu />
    <div className="settings-grid">
       <div className="card settings-nav">{sections.map(item => <button key={item.key} className={section === item.key ? 'active' : ''} onClick={() => setSection(item.key)} data-testid={`button-settings-${item.key}`}>{sectionLabel(item)}</button>)}</div>
      <div className="card card-pad">
            {section === 'عام' && <><div className="card-title"><h3>{text(language, 'عام', 'General')}</h3><Settings size={20} color="hsl(var(--primary))" /></div>
            <div className="setting-line"><strong>{text(language, 'لغة التطبيق', 'App language')}</strong><LanguageSwitcher /></div>
           <div className="setting-line"><strong>{text(language, 'هدف السعرات اليومي', 'Daily calorie goal')}</strong><div className="setting-control"><input className="search-box" style={{ width: 100, minWidth: 100, height: 38 }} type="number" value={goal} onChange={e => setGoal(e.target.value)} aria-label={text(language, 'هدف السعرات اليومي', 'Daily calorie goal')} data-testid="input-calorie-goal" /><button className="primary-btn" style={{ padding: '7px 12px' }} onClick={saveGoal} data-testid="button-save-goal">{text(language, 'حفظ', 'Save')}</button></div></div>
           <div className="setting-line"><strong>{text(language, 'وحدات القياس', 'Measurement units')}</strong><span className="status-pill">{text(language, 'عربي', 'Arabic')}</span></div>
        </>}
           {section === 'معلومات الملف الشخصي' && <><div className="card-title"><h3>{text(language, 'الحساب', 'Profile')}</h3><UserRound size={20} color="hsl(var(--primary))" /></div>
            <form className="settings-profile-form" onSubmit={saveProfile}>
               <div className="settings-profile-heading"><h3>{text(language, 'بيانات الحساب', 'Account details')}</h3><ProfileAvatar gender={user.gender} /></div>
              <div className="settings-profile-fields">
                <div className="field"><label htmlFor="profile-name">{text(language, 'الاسم', 'Name')}</label><input id="profile-name" value={profileName} onChange={event => setProfileName(event.target.value)} autoComplete="name" data-testid="input-profile-name" /></div>
                <div className="field"><label htmlFor="profile-email">{text(language, 'البريد الإلكتروني', 'Email')}</label><input id="profile-email" type="email" value={profileEmail} onChange={event => setProfileEmail(event.target.value)} autoComplete="email" dir="ltr" data-testid="input-profile-email" /></div>
                 <div className="field full"><label htmlFor="profile-password">{text(language, 'تغيير كلمة السر', 'Change password')}</label><input id="profile-password" type="password" value={profilePassword} onChange={event => setProfilePassword(event.target.value)} autoComplete="new-password" dir="ltr" placeholder="••••••••" aria-describedby={profileError ? 'profile-error' : undefined} data-testid="input-profile-password" /></div>
              </div>
              {profileError && <p id="profile-error" className="auth-error" role="alert" data-testid="status-profile-error">{profileError}</p>}
               <div className="settings-profile-actions"><button className="primary-btn" type="submit" data-testid="button-save-profile"><Check size={15} />{text(language, 'حفظ بيانات الحساب', 'Save account details')}</button></div>
            </form>
         </>}
          {section === 'المظهر' && <><div className="card-title"><h3>{text(language, 'المظهر', 'Theme')}</h3><Sparkles size={20} color="hsl(var(--accent-foreground))" /></div>
           <div className="setting-line"><strong>{text(language, 'الوضع الليلي', 'Dark mode')}</strong><button className={`toggle ${data.darkMode ? 'on' : ''}`} onClick={() => setData(prev => ({ ...prev, darkMode: !prev.darkMode }))} aria-label={text(language, 'تبديل الوضع الليلي', 'Toggle dark mode')} aria-pressed={data.darkMode} data-testid="toggle-dark-mode"><i /></button></div>
          <div className={`theme-preview ${data.darkMode ? 'night' : ''}`}><span className="preview-light" /><strong>{data.darkMode ? text(language, 'إضاءة ليلية هادئة', 'Calm night lighting') : text(language, 'إضاءة نهارية مشرقة', 'Bright daytime lighting')}</strong></div>
        </>}
          {section === 'التنبيهات' && <><div className="card-title"><h3>{text(language, 'التنبيهات', 'Alerts')}</h3><Bell size={20} color="hsl(var(--primary))" /></div>
           <div className="setting-line"><strong>{text(language, 'تذكير انتهاء الصلاحية', 'Expiry reminder')}</strong><button className={`toggle ${data.reminders ? 'on' : ''}`} onClick={() => setData(prev => ({ ...prev, reminders: !prev.reminders }))} aria-label={text(language, 'تبديل تذكير انتهاء الصلاحية', 'Toggle expiry reminders')} aria-pressed={data.reminders} data-testid="toggle-reminders"><i /></button></div>
           <div className="setting-line"><strong>{text(language, 'ملخص نهاية اليوم', 'End-of-day summary')}</strong><button className={`toggle ${data.notifications ? 'on' : ''}`} onClick={() => setData(prev => ({ ...prev, notifications: !prev.notifications }))} aria-label={text(language, 'تبديل ملخص نهاية اليوم', 'Toggle end-of-day summary')} aria-pressed={data.notifications} data-testid="toggle-notifications"><i /></button></div>
        </>}
          {section === 'الخصوصية' && <><div className="card-title"><h3>{text(language, 'الخصوصية', 'Privacy')}</h3><CircleHelp size={20} color="hsl(var(--primary))" /></div>
           <div className="empty-state" style={{ padding: 30 }}><CheckCircle2 size={32} /><strong>{text(language, 'بياناتك محلية تماماً', 'Your data is fully local')}</strong></div>
        </>}
      </div>
    </div>
  </main>;
}

function RoutedPages({ user, data, setData, onLogout, setNotice, onUserUpdate }: { user: User; data: UserData; setData: Dispatch<SetStateAction<UserData>>; onLogout: () => void; setNotice: (v: string) => void; onUserUpdate: (updates: UserProfileUpdate) => void }) {
  const { language } = useLanguage();
  const [addOpen, setAddOpen] = useState(false);
  return <AppShell user={user} shoppingCount={data.shopping.filter(item => !item.done).length} onLogout={onLogout}><Switch><Route path="/"><Dashboard user={user} data={data} setData={setData} onAdd={() => setAddOpen(true)} setNotice={setNotice} /></Route><Route path="/meals"><MealsPage data={data} setData={setData} setNotice={setNotice} /></Route><Route path="/daily-analysis"><DailyAnalysis data={data} /></Route><Route path="/shopping"><ShoppingPage data={data} setData={setData} setNotice={setNotice} onAdd={() => setAddOpen(true)} /></Route><Route path="/recipes"><RecipesPage data={data} setData={setData} /></Route><Route path="/favorites"><FavoritesPage data={data} setData={setData} /></Route><Route path="/settings"><SettingsPage user={user} data={data} setData={setData} setNotice={setNotice} onUserUpdate={onUserUpdate} /></Route><Route component={NotFound} /></Switch>{addOpen && <AddFoodModal onClose={() => setAddOpen(false)} onAdd={item => { setData(prev => ({ ...prev, items: [...prev.items, { ...item, id: `food-${Date.now()}` }] })); flash(setNotice, text(language, 'أضيف الطعام إلى ثلاجتك', 'Food added to your fridge')); }} />}</AppShell>;
}

function App() {
  const [session, setSession] = useState<string | null>(() => localStorage.getItem(SESSION_KEY));
  const [users, setUsers] = useState<User[]>(readStoredUsers);
  const [notice, setNotice] = useState('');
  const [data, setData] = useState<UserData>(() => loadData(session || ''));
  const user = users.find(item => item.id === session);
  useEffect(() => { if (session && user) { setData(loadData(session)); } }, [session]);
  useEffect(() => { if (session) saveData(session, data); }, [data, session]);
  const login = (nextUser: User) => { setUsers(readStoredUsers()); localStorage.setItem(SESSION_KEY, nextUser.id); setSession(nextUser.id); setData(loadData(nextUser.id)); };
  const updateUser = (updates: UserProfileUpdate) => {
    setUsers(previous => {
      const next = previous.map(candidate => candidate.id === session ? { ...candidate, ...updates } : candidate);
      localStorage.setItem(USERS_KEY, JSON.stringify(next));
      return next;
    });
  };
  const logout = () => { localStorage.removeItem(SESSION_KEY); setSession(null); setNotice(''); };
  if (!session || !user) return <AuthScreen onLogin={login} />;
  return <div className={data.darkMode ? 'theme-dark' : ''} data-theme={data.darkMode ? 'dark' : undefined}><RoutedPages user={user} data={data} setData={setData} onLogout={logout} setNotice={setNotice} onUserUpdate={updateUser} />{notice && <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 60, padding: '12px 17px', borderRadius: 12, background: 'hsl(var(--sidebar))', color: 'hsl(var(--card))', boxShadow: '0 10px 25px hsl(155 22% 17% / .2)', animation: 'modal-in .2s ease-out' }} role="status" data-testid="status-notice"><CheckCircle2 size={16} style={{ verticalAlign: 'middle', marginLeft: 7, color: 'hsl(var(--accent))' }} />{notice}</div>}</div>;
}

export default function AppWithProviders() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><LanguageProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><ErrorBoundary resetKey={location.pathname}><App /></ErrorBoundary></WouterRouter><Toaster /></LanguageProvider></TooltipProvider></QueryClientProvider>;
}
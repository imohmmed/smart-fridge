import { createContext, useContext, type CSSProperties, type Dispatch, type FormEvent, type ReactNode, type SetStateAction, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  Apple, ArrowLeft, Bell, BookOpen, Check, CheckCircle2, ChevronLeft, CircleHelp,
  ClipboardCopy, Droplets, Egg, Fish, Flame, Heart, Home, Leaf, LogOut, Minus,
  Package, Pencil, Plus, Refrigerator, Search, Settings, ShoppingBasket, Sparkles,
  Trash2, UserRound, Utensils, X, Zap, Eye, EyeOff, Globe2, LockKeyhole, Mail,
} from 'lucide-react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import NotFound from '@/pages/not-found';
import milkPhoto from '@assets/generated_images/fridge-milk.png';
import eggsPhoto from '@assets/generated_images/fridge-eggs.png';
import proteinPhoto from '@assets/generated_images/fridge-protein.png';
import vegetablesPhoto from '@assets/generated_images/fridge-vegetables.png';
import fruitPhoto from '@assets/generated_images/fridge-fruit.png';
import cheesePhoto from '@assets/generated_images/fridge-cheese.png';
import freezerPhoto from '@assets/generated_images/fridge-freezer.png';

type FridgeItem = {
  id: string; name: string; quantity: number; unit: string; category: string;
  expiry: string; calories: number; art: string;
};
type ShoppingItem = { id: string; name: string; quantity: string; done: boolean };
type User = { id: string; name: string; email: string; password: string; gender?: 'female' | 'male' };
type UserData = {
  items: FridgeItem[]; shopping: ShoppingItem[]; note: string; water: number;
  calorieGoal: number; favorites: string[]; reminders: boolean; notifications: boolean; darkMode: boolean;
};
type Recipe = { id: string; name: string; description: string; time: string; calories: number; color: string; tags: string[] };
type AppNotification = { id: string; type: 'danger' | 'warning' | 'success' | 'info'; icon: string; title: string; message: string; time: string };
type Language = 'ar' | 'en';
const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void }>({ language: 'ar', setLanguage: () => undefined });
const useLanguage = () => useContext(LanguageContext);
const text = (language: Language, ar: string, en: string) => language === 'ar' ? ar : en;
const englishTranslations: Record<string, string> = {
  'ثلاجتي': 'Smart Fridge', 'رفيق البيت الطازج': 'Fresh home companion', 'وجباتي': 'My meals',
  'تحليل يومي': 'Daily analysis', 'قائمة التسوق': 'Shopping list', 'وصفات مقترحة': 'Suggested recipes',
  'المفضلة': 'Favorites', 'الإعدادات': 'Settings', 'مساحتي الشخصية': 'My space', 'تسجيل الخروج': 'Sign out',
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
  'أضف ما ينقصك.': 'Add what is missing.', 'أضف شيئاً قبل أن تنساه.': 'Add something before you forget.',
  'أضف عنصراً...': 'Add an item...', 'أصناف قاربت على النفاد': 'Items running low',
  'لا توجد اقتراحات عاجلة.': 'No urgent suggestions.', 'مثال: اختر الطماطم الناضجة...': 'Example: choose ripe tomatoes...',
  'أفكار لذيذة، تبدأ مما هو موجود عندك.': 'Delicious ideas, starting with what you have.',
  'ابحثي عن وصفة...': 'Search for a recipe...', 'وصفات': 'recipes', 'الوصفات التي نالت إعجابك، قريبة دائماً.': 'Recipes you love, always close by.',
  'اضغط على القلب بجانب أي وصفة لحفظها هنا.': 'Press the heart beside a recipe to save it here.',
  'اجعل ثلاجتي تشبه طريقتك أكثر.': 'Make Smart Fridge feel more like you.',
  'طازج وجاهز': 'Fresh and ready', 'بارد ومنعش': 'Chilled and fresh',
};
function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => localStorage.getItem('smart_fridge_language') === 'en' ? 'en' : 'ar');
  useEffect(() => {
    localStorage.setItem('smart_fridge_language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.body.dir = language === 'ar' ? 'rtl' : 'ltr';
    const originals = new WeakMap<Text, string>();
    const translate = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const textNode = node as Text;
        if (!textNode.parentElement || ['SCRIPT', 'STYLE'].includes(textNode.parentElement.tagName)) continue;
        const original = originals.get(textNode) ?? textNode.nodeValue ?? '';
        originals.set(textNode, original);
        const trimmed = original.trim();
        const translated = language === 'en' ? englishTranslations[trimmed] : original;
        if (translated && translated !== trimmed) textNode.nodeValue = original.replace(trimmed, translated);
        else if (language === 'ar' && textNode.nodeValue !== original) textNode.nodeValue = original;
      }
    };
    translate();
    const observer = new MutationObserver(translate);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}

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
  { id: 'orange-juice', name: 'عصير برتقال', quantity: 1, unit: 'عبوة', category: 'مشروبات', expiry: '2025-06-08', calories: 110, art: 'orange' },
  { id: 'water', name: 'ماء', quantity: 4, unit: 'عبوة', category: 'مشروبات', expiry: '2025-12-31', calories: 0, art: 'bottle' },
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
  حمص: 'hummus', فلافل: 'falafel', شاورما: 'shawarma', سلطة: 'salad', 'شوربة دجاج': 'chicken soup',
  مندي: 'mandi rice', كبسة: 'kabsa', 'دجاج مشوي': 'grilled chicken', 'سمك مشوي': 'grilled fish',
  بيض: 'eggs', معكرونة: 'pasta', أرز: 'rice', رز: 'rice', برياني: 'biryani', تبولة: 'tabbouleh',
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
    .replaceAll('علبة', 'box')
    .replaceAll('كيس', 'bag')
    .replaceAll('قطعة', 'piece')
    .replaceAll('رأس', 'head')
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
  if (loading) return <div className="recipe-image-placeholder is-loading" aria-label="جار تحميل صورة الطبق"><span /></div>;
  if (!image || failed) return <img className="recipe-card-image" src={defaultFoodImage} alt="صورة طبق محايد" loading="lazy" />;
  return <img className="recipe-card-image" src={image} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}

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
function genderSticker(_gender?: User['gender']) { return '🧑🏻‍🍳'; }
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
function checkAndGenerateNotifications(data: UserData): AppNotification[] {
  const notifications: AppNotification[] = [];
  data.items.forEach(item => {
    const daysLeft = daysUntil(item.expiry);
    if (daysLeft <= 0) notifications.push({ id: `expired_${item.id}`, type: 'danger', icon: '⚠️', title: 'طعام منتهي الصلاحية', message: `${item.name} انتهت صلاحيته!`, time: 'الآن' });
    else if (daysLeft <= 3) notifications.push({ id: `expiring_${item.id}`, type: 'warning', icon: '🕐', title: 'قريب انتهاء الصلاحية', message: `${item.name} ينتهي خلال ${toWesternNums(daysLeft)} أيام`, time: `${toWesternNums(daysLeft)} أيام` });
    if (item.quantity <= 1) notifications.push({ id: `low_${item.id}`, type: 'info', icon: '📦', title: 'كمية منخفضة', message: `${item.name} كميته منخفضة، أضفه لقائمة التسوق`, time: 'اليوم' });
  });
  const calories = data.items.reduce((sum, item) => sum + item.calories * item.quantity, 0);
  if (calories >= data.calorieGoal) notifications.push({ id: 'calorie_goal', type: 'success', icon: '🎯', title: 'وصلت هدفك!', message: `أكملت ${toWesternNums(data.calorieGoal)} سعرة حرارية اليوم`, time: 'اليوم' });
  if (data.water < 4) notifications.push({ id: 'water_reminder', type: 'info', icon: '💧', title: 'تذكير شرب الماء', message: `شربت ${toWesternNums(data.water)} أكواب فقط، هدفك 8 أكواب`, time: 'اليوم' });
  return notifications;
}

const foodEmojiMap: Record<string, string> = {
  برتقال: '🍊', موز: '🍌', تفاح: '🍎', 'تفاح أحمر': '🍎', عنب: '🍇', فراولة: '🍓', بطيخ: '🍉',
  مانجو: '🥭', كمثرى: '🍐', خوخ: '🍑', أناناس: '🍍', توت: '🫐', ليمون: '🍋', كيوي: '🥝',
  رمان: '🍎', تمر: '🌴', طماطم: '🍅', 'طماطم كرزية': '🍅', خس: '🥬', 'خس طازج': '🥬',
  جزر: '🥕', بروكلي: '🥦', فلفل: '🫑', خيار: '🥒', بصل: '🧅', ثوم: '🧄', بطاطس: '🥔',
  ذرة: '🌽', باذنجان: '🍆', أفوكادو: '🥑', فطر: '🍄', دجاج: '🍗', 'صدور دجاج': '🍗',
  لحم: '🥩', سمك: '🐟', بيض: '🥚', روبيان: '🦐', حليب: '🥛', جبن: '🧀', زبدة: '🧈',
  زبادي: '🥛', كريمة: '🥛', 'عصير برتقال': '🍊', 'عصير تفاح': '🍎', ماء: '💧', default: '🍽️',
};
function getFoodEmoji(foodName: string) {
  return foodEmojiMap[foodName] || Object.keys(foodEmojiMap).find(key => key !== 'default' && foodName.includes(key)) && foodEmojiMap[Object.keys(foodEmojiMap).find(key => key !== 'default' && foodName.includes(key)) as string] || foodEmojiMap.default;
}

function FoodArt({ item, size = 40 }: { item?: FridgeItem; size?: number }) {
  const art = item?.art || 'apple';
  const photo = art === 'milk' ? milkPhoto : art === 'egg' ? eggsPhoto : art === 'chicken' ? proteinPhoto
    : art === 'leaf' || art === 'tomato' ? vegetablesPhoto : art === 'apple' || art === 'orange' ? fruitPhoto
    : art === 'cheese' ? cheesePhoto : art === 'hummus' ? cheesePhoto : art === 'package' ? milkPhoto : freezerPhoto;
  const emoji = art === 'milk' ? '🥛' : art === 'egg' ? '🥚' : art === 'cheese' ? '🧀' : art === 'apple' ? '🍎'
    : art === 'orange' ? '🍊' : art === 'leaf' ? '🥦' : art === 'tomato' ? '🍅' : art === 'chicken' ? '🍗'
    : art === 'hummus' ? '🥫' : art === 'package' ? '🧃' : '🥕';
  const style = art === 'apple' ? { color: 'hsl(6 58% 48%)' }
    : art === 'orange' ? { color: 'hsl(32 69% 44%)' }
    : art === 'leaf' ? { color: 'hsl(152 44% 29%)' }
    : art === 'tomato' ? { color: 'hsl(4 65% 48%)' }
    : art === 'chicken' ? { color: 'hsl(274 35% 48%)' }
    : art === 'egg' ? { color: 'hsl(34 52% 40%)' }
    : { color: 'hsl(196 48% 40%)' };
  return <div className="food-art" style={{ ...style, width: size, height: size }}><TransparentFoodImage src={photo} alt="" width={size * 1.5} height={size * 1.5} /><span className="food-emoji" aria-hidden="true">{emoji}</span></div>;
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
      if (!name.trim() || !email.trim() || password.length < 4) { setError('أكملي البيانات، وكلمة المرور 4 أحرف على الأقل.'); return; }
      if (users.some(user => user.email === email.trim().toLowerCase())) { setError('هذا البريد مسجل مسبقاً.'); return; }
      const user: User = { id: `u-${Date.now()}`, name: name.trim(), email: email.trim().toLowerCase(), password, gender: gender || undefined };
      localStorage.setItem(USERS_KEY, JSON.stringify([...users, user])); onLogin(user);
    } else {
      const user = users.find(candidate => candidate.email === email.trim().toLowerCase() && candidate.password === password);
      if (!user) { setError('البريد أو كلمة المرور غير صحيحة.'); return; }
      onLogin(user);
    }
  };
  const demo = () => {
    const user: User = { id: 'demo-user', name: 'سارة', email: 'demo@thalajati.local', password: 'demo', gender: 'female' };
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (!users.some(item => item.id === user.id)) localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
    onLogin(user);
  };
  const forgotPassword = () => setError('سنرسل لك رابط استعادة كلمة المرور قريباً.');
  return <main className="auth-shell auth-redesign">
    <section className="auth-art auth-visual-panel">
      <div className="auth-visual-inner">
        <div className="visual-topline"><span><i className="live-dot" /> نظام ثلاجتي الذكي</span></div>
        <div className="auth-visual-content">
          <div className="fridge-stage" aria-label="رسم توضيحي لثلاجة ذكية">
            <div className="fridge-halo" />
            <div className="smart-fridge-illustration">
              <div className="fridge-top-cap" />
              <div className="fridge-freezer">
                 <span className="fridge-display"><b>{toWesternNums('4°')}</b><small>طازج</small></span>
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
            <div className="copy-kicker"><Sparkles size={14} /> طازج، مرتب، على طريقتك</div>
             <h2>ثلاجتك الذكية..<br /><em>طعامك دائماً طازج</em></h2>
            <p>إدارة ذكية لمحتويات ثلاجتك، للحفاظ على طعامك طازجًا وحياتك أسهل.</p>
            <div className="auth-benefits">
               <div className="benefit-item"><span><Leaf size={17} /></span><div><strong>تتبع ذكي للمحتويات والصلاحية</strong></div></div>
               <div className="benefit-item"><span><ShoppingBasket size={17} /></span><div><strong>قائمة تسوق أذكى وأسرع</strong></div></div>
               <div className="benefit-item"><span><Bell size={17} /></span><div><strong>تنبيهات انتهاء صلاحية الطعام</strong></div></div>
            </div>
          </div>
        </div>
         <div className="visual-footer"><span><LockKeyhole size={13} /> {text(language, 'بياناتك محفوظة على هذا الجهاز', 'Your data is saved on this device')}</span><span>{text(language, 'ثلاجتك، بإيقاع يومك', 'Your fridge, your rhythm')}</span></div>
      </div>
    </section>
    <section className="auth-form-wrap">
      <form className="auth-form auth-card" onSubmit={submit}>
         <LanguageSwitcher />
        <div className="auth-card-heading"><h2>{mode === 'login' ? 'أهلاً بعودتك' : 'لنبدأ معاً'}</h2><p>{mode === 'login' ? 'سجّل دخولك لثلاجتك الذكية' : 'أنشئ مساحتك الخاصة في دقائق.'}</p></div>
        <div className="auth-tabs"><button type="button" className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError(''); }} data-testid="tab-login">تسجيل الدخول</button><button type="button" className={`auth-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => { setMode('register'); setError(''); }} data-testid="tab-register">حساب جديد</button></div>
        {mode === 'register' && <div className="field auth-field"><label htmlFor="auth-name">الاسم</label><input id="auth-name" data-testid="input-auth-name" value={name} onChange={e => setName(e.target.value)} /></div>}
        <div className="field auth-field"><label htmlFor="auth-email">البريد الإلكتروني</label><div className="input-with-icon"><Mail size={17} /><input id="auth-email" type="email" autoComplete="email" dir="ltr" aria-describedby={error ? 'auth-error' : undefined} data-testid="input-auth-email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" /></div></div>
        <div className="field auth-field"><label htmlFor="auth-password">كلمة المرور</label><div className="input-with-icon password-control"><LockKeyhole size={17} /><input id="auth-password" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} dir="ltr" aria-describedby={error ? 'auth-error' : undefined} data-testid="input-auth-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" /><button type="button" className="password-toggle" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></div>
        {error && <p id="auth-error" className="auth-error" role="alert" data-testid="status-auth-error">{error}</p>}
        {mode === 'register' && <div className="field auth-field"><label htmlFor="auth-gender">الجنس</label><select id="auth-gender" value={gender} onChange={e => setGender(e.target.value as '' | 'female' | 'male')} data-testid="select-auth-gender"><option value="" disabled>اختر الجنس</option><option value="female">أنثى</option><option value="male">ذكر</option></select></div>}
        <div className="auth-options"><label htmlFor="remember-me"><input id="remember-me" type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} /> <span>تذكرني</span></label><button type="button" className="link-btn" onClick={forgotPassword}>نسيت كلمة المرور؟</button></div>
        <button className="primary-btn auth-submit" type="submit" data-testid="button-auth-submit">{mode === 'login' ? 'دخول إلى ثلاجتي' : 'إنشاء مساحتي'}<ArrowLeft size={17} /></button>
        <div className="auth-divider"><span>أو</span></div>
        <button className="secondary-btn auth-demo" type="button" onClick={demo} data-testid="button-demo-login"><Sparkles size={16} /> تجربة ثلاجتي الآن</button>
        <p className="create-account">{mode === 'login' ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'} <button type="button" className="link-btn" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>{mode === 'login' ? 'أنشئ حساباً' : 'تسجيل الدخول'}</button></p>
        <div className="auth-note"><LockKeyhole size={12} /> بياناتك تبقى في هذا الجهاز، ومساحتك لك وحدك.</div>
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
  return <div className="app-shell">
     <aside className="sidebar">
       <div className="brand"><div className="brand-mark"><Refrigerator size={24} /></div><div className="brand-copy"><h1>{text(language, 'ثلاجتي', 'Smart Fridge')}</h1><small>{text(language, 'رفيق البيت الطازج', 'Fresh home companion')}</small></div></div>
       <nav className="nav-list" aria-label={text(language, 'التنقل الرئيسي', 'Main navigation')}>
         {navItems.map(item => { const Icon = item.icon; const label = text(language, item.ar, item.en); return <Link key={item.href} href={item.href} className={`nav-item ${location === item.href ? 'active' : ''}`} data-testid={`link-nav-${item.ar}`}><Icon size={18} /><span className="nav-label">{label}</span>{item.href === '/shopping' && <b className="nav-count">{shoppingCount}</b>}</Link>; })}
      </nav>
      <div className="sidebar-footer">
         <Link href="/settings" className={`nav-item ${location === '/settings' ? 'active' : ''}`} data-testid="link-nav-settings"><Settings size={18} /><span className="nav-label">{text(language, 'الإعدادات', 'Settings')}</span></Link>
        <div className="profile-mini"><div className="avatar">{initials(user.name)}</div><div><strong>{user.name}</strong><span>مساحتي الشخصية</span></div></div>
        <button className="logout-btn" onClick={onLogout} data-testid="button-logout"><LogOut size={15} /><span>تسجيل الخروج</span></button>
      </div>
    </aside>
    <div style={{ minWidth: 0 }}>
      <header className="mobile-topbar"><div className="brand"><div className="brand-mark"><Refrigerator size={19} /></div><h1>ثلاجتي</h1></div><button className="icon-btn" onClick={onLogout} data-testid="button-mobile-logout"><LogOut size={17} /></button></header>
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
    if (!form.name.trim()) return;
    const art = form.category === 'فواكه' ? 'apple' : form.category === 'ألبان' ? 'milk' : form.category === 'لحوم' ? 'chicken' : form.category === 'خضروات' ? 'leaf' : 'package';
    const expiry = form.expiry || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
    onAdd({ name: form.name.trim(), quantity: Math.max(1, Number(form.quantity) || 1), unit: form.unit, category: form.category, expiry, calories: Math.max(0, Number(form.calories) || 0), art });
    onClose();
  };
  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-head"><div><h2>إضافة إلى الثلاجة</h2><p>شيء جديد يستحق مكاناً في مساحتك.</p></div><button className="icon-btn" onClick={onClose} data-testid="button-close-add-food"><X size={18} /></button></div>
      <form className="form-grid" onSubmit={submit}>
        <div className="field full"><label htmlFor="food-name">اسم الطعام</label><input autoFocus id="food-name" type="text" autoComplete="off" data-testid="input-food-name" value={form.name} onChange={e => update('name', e.target.value)} placeholder="اكتب اسم الطعام..." required /></div>
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
  const { language } = useLanguage();
  const categories = [
    { name: text(language, '🍗 البروتينات', '🍗 Proteins'), match: 'لحوم', tint: 'meat', note: text(language, 'طازج وجاهز', 'Fresh and ready') },
    { name: text(language, '🥗 الخضروات', '🥗 Vegetables'), match: 'خضروات', tint: 'greens', note: text(language, 'خضروات طازجة', 'Fresh vegetables') },
    { name: text(language, '🍎 الفواكه', '🍎 Fruits'), match: 'فواكه', tint: 'fruit', note: text(language, 'بارد ومنعش', 'Chilled and fresh') },
    { name: text(language, '🥛 الألبان', '🥛 Dairy'), match: 'ألبان', tint: 'dairy', note: '4° C' },
    { name: text(language, '🧃 العصائر والمشروبات', '🧃 Juices and drinks'), match: 'مشروبات', tint: 'drinks', note: text(language, 'بارد ومنعش', 'Chilled and fresh') },
  ];
  const doorDairy = items.filter(item => item.category === 'ألبان').slice(0, 3);
  const doorDrinks = items.filter(item => ['مشروبات', 'جاهز'].includes(item.category)).slice(0, 4);
  const renderFood = (item: FridgeItem, size = 43, door = false) => <button key={item.id} className={`${door ? 'door-food' : 'food-badge'} ${selected?.id === item.id ? 'selected' : ''}`} onClick={() => onSelect(item)} aria-pressed={selected?.id === item.id} data-testid={`button-food-${door ? 'door-' : ''}${item.id}`}>
     <span className="food-visual"><FoodArt item={item} size={door ? size + 8 : size + 12} /><b className="quantity-badge">{toWesternNums(item.quantity)}</b></span>
     <span className="food-name">{displayFoodName(item.name, language)}</span>
      {!door && <small>{toWesternNums(item.quantity)} {language === 'en' ? 'units' : item.unit}</small>}
    {daysUntil(item.expiry) <= 2 && <i className="food-dot" />}
  </button>;
  return <div className="fridge-card real-fridge-card">
     <div className="fridge-temperature"><span><Refrigerator size={15} /> {text(language, 'الثلاجة', 'Fridge')}</span><strong>4°C</strong><span><Zap size={14} /> {text(language, 'الفريزر', 'Freezer')}</span><strong>-18°C</strong></div>
    <div className="fridge-body real-fridge-body">
      <div className="fridge-door real-fridge-door">
        <span className="door-edge-shadow" />
        <span className="fridge-door-handle" />
         <div className="door-status"><span>{text(language, 'منطقة الطزاجة', 'Fresh zone')}</span><i /></div>
         <div className="door-rack rack-dairy"><h4>{text(language, 'الألبان والمشروبات', 'Dairy and drinks')}</h4>{doorDairy.map(item => renderFood(item, 30, true))}</div>
         <div className="door-rack rack-drinks"><h4>{text(language, 'الصلصات والمربيات', 'Sauces and jams')}</h4>{doorDrinks.map(item => renderFood(item, 28, true))}</div>
         <div className="door-rack rack-low"><h4>{text(language, 'المشروبات والعصائر', 'Drinks and juices')}</h4><div className="door-bottles"><span /><span /><span /></div></div>
         <div className="door-note"><span className="note-pin" /><span>{text(language, 'ملاحظة اليوم', 'Today’s note')}<br /><strong>{text(language, 'حضّر شيئاً طازجاً', 'Prepare something fresh')}</strong></span></div>
      </div>
      <div className="fridge-cabinet real-fridge-cabinet">
        <div className="cabinet-side cabinet-side-left" />
        <div className="cabinet-side cabinet-side-right" />
        <div className="fridge-glow"><span /></div>
        <div className="interior-light"><i /><i /><i /></div>
        <div className="cabinet-shelves">{categories.map(category => {
          const categoryItems = items.filter(item => item.category === category.match).slice(0, 5);
          return <div className={`cabinet-shelf ${category.tint}`} key={category.name}>
            <div className="shelf-title"><span>{category.name}</span><small>{category.note}</small></div>
             <div className="shelf-items">{categoryItems.map(item => renderFood(item))}{!categoryItems.length && <span className="muted shelf-empty">{text(language, 'أضف صنفاً جديداً', 'Add a new item')}</span>}</div>
            <div className="glass-front" />
          </div>;
        })}</div>
        <div className="produce-drawers">
            <div className="crisper-drawer"><span>{text(language, 'خضروات طازجة', 'Fresh vegetables')}</span><small>{toWesternNums(items.filter(item => item.category === 'خضروات').length || 0)} {text(language, 'أصناف', 'items')}</small><div className="drawer-handle" /></div>
            <div className="crisper-drawer"><span>{text(language, 'جذور وبطاطا', 'Roots and potatoes')}</span><small>{toWesternNums(items.filter(item => item.category === 'فواكه').length || 0)} {text(language, 'أصناف', 'items')}</small><div className="drawer-handle" /></div>
        </div>
        <div className="freezer-section">
           <div className="shelf-title"><span>{text(language, 'الفريزر', 'Freezer')}</span><small>-18° C</small></div>
           <div className="freezer-tray"><div className="freezer-bin"><i /><span>{text(language, 'لحوم', 'Meat')}</span></div><div className="freezer-bin"><i /><span>{text(language, 'ثلج', 'Ice')}</span></div><div className="freezer-bin"><i /><span>{text(language, 'جاهز', 'Ready')}</span></div></div>
        </div>
      </div>
    </div>
     <div className="fridge-foot"><span>{text(language, 'تبريد ذكي', 'Smart cooling')}</span><b>{text(language, 'تعمل بكفاءة', 'Running efficiently')}</b><i /></div>
  </div>;
}

function Dashboard({ userName, userGender, data, setData, onAdd, setNotice }: { userName: string; userGender?: User['gender']; data: UserData; setData: Dispatch<SetStateAction<UserData>>; onAdd: () => void; setNotice: (value: string) => void }) {
  const { language } = useLanguage();
  const [selectedId, setSelectedId] = useState(data.items.find(item => item.id === 'eggs')?.id || data.items[0]?.id);
  const selected = data.items.find(item => item.id === selectedId) || data.items[0];
  const totalCalories = data.items.reduce((sum, item) => sum + item.calories * item.quantity, 0);
  const consume = () => {
    if (!selected) return;
    setData(prev => ({ ...prev, items: prev.items.map(item => item.id === selected.id ? { ...item, quantity: item.quantity - 1 } : item).filter(item => item.quantity > 0) }));
    flash(setNotice, `تم تسجيل استهلاك ${selected.name}`);
  };
  const editSelected = () => {
    if (!selected) return;
    const quantity = window.prompt('عدّل الكمية', String(selected.quantity));
    if (quantity !== null && Number(quantity) > 0) setData(prev => ({ ...prev, items: prev.items.map(item => item.id === selected.id ? { ...item, quantity: Number(quantity) } : item) }));
  };
  const percentage = Math.min(100, Math.round(totalCalories / data.calorieGoal * 100));
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('smart_fridge_read_notifications') || '[]'); } catch { return []; }
  });
  const refreshNotifications = () => setNotifications(checkAndGenerateNotifications(data));
  useEffect(() => {
    refreshNotifications();
    const timer = window.setInterval(refreshNotifications, 60000);
    return () => window.clearInterval(timer);
  }, [data]);
  const unreadCount = notifications.filter(item => !readIds.includes(item.id)).length;
  const markAllRead = () => {
    const ids = notifications.map(item => item.id);
    setReadIds(ids);
    localStorage.setItem('smart_fridge_read_notifications', JSON.stringify(ids));
  };
  return <main className="app-main dashboard-main">
    <div className="dashboard-topbar">
       <div className="dashboard-greeting"><span className="user-sticker" aria-label={text(language, 'مستخدم', 'User')}>{genderSticker(userGender)}</span><span>{text(language, 'مساء الخير،', 'Good evening,')}</span><strong>{userName}</strong><ChevronLeft size={15} /></div>
        <div className="dashboard-stat"><Flame size={21} /><div><small>{text(language, 'هدفك اليومي', 'Daily goal')}</small><strong>{toWesternNums(data.calorieGoal.toLocaleString('en-US'))} {text(language, 'سعرة', 'kcal')}</strong></div></div>
        <div className="dashboard-stat"><div className="mini-ring" style={{ '--ring-progress': `${percentage}%` } as CSSProperties}><strong>{toWesternNums(percentage)}%</strong></div><div><small>{text(language, 'استهلاكك اليوم', 'Today’s intake')}</small><strong>{toWesternNums(totalCalories.toLocaleString('en-US'))} {text(language, 'سعرة', 'kcal')}</strong></div></div>
       <div className="notification-wrap">
         <button className="topbar-bell icon-btn" aria-label={`التنبيهات${unreadCount ? `، ${toWesternNums(unreadCount)} جديدة` : ''}`} aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen(value => !value)} data-testid="button-notifications"><Bell size={20} />{unreadCount > 0 && <b className="notification-count">{toWesternNums(unreadCount)}</b>}</button>
         {notificationsOpen && <div className="notification-dropdown" role="region" aria-label="قائمة التنبيهات">
           <div className="notification-head"><strong>التنبيهات</strong>{notifications.length > 0 && <button className="link-btn" onClick={markAllRead}>تعليم الكل كمقروء</button>}</div>
           {notifications.length ? notifications.map(item => <div className={`notification-item notification-${item.type}`} key={item.id}><span className="notification-icon" aria-hidden="true">{item.icon}</span><div><strong>{item.title}</strong><p>{item.message}</p><small>{item.time}</small></div></div>) : <div className="notification-empty">لا توجد إشعارات جديدة 🎉</div>}
         </div>}
       </div>
        <LanguageSwitcher />
    </div>
      <div className="reference-heading"><div><span className="eyebrow">{text(language, 'مساحتي اليومية', 'My daily space')}</span><h2>{text(language, 'محتويات ثلاجتك', 'Your fridge contents')}</h2></div><span className="date-chip" data-testid="text-current-date">{formatArabicDate(language)}</span></div>
    <div className="reference-dashboard">
      <section className="reference-fridge"><FridgeVisual items={data.items} selected={selected} onSelect={item => setSelectedId(item.id)} /></section>
      <aside className="reference-rail">
         <div className="item-detail-panel card card-pad"><div className="rail-title"><span>{text(language, 'تفاصيل العنصر', 'Item details')}</span><button className="detail-close" aria-label={text(language, 'إغلاق التفاصيل', 'Close details')}><X size={15} /></button></div>{selected ? <><div className="detail-hero" key={selected.id}><FoodArt item={selected} size={108} /><h3>{displayFoodName(selected.name, language)}</h3><span>{toWesternNums(selected.quantity)} {language === 'en' ? 'units' : selected.unit}</span></div><div className="detail-stats"><div><small>{text(language, 'تاريخ الانتهاء', 'Expiry date')}</small><strong>{toWesternNums(new Date(selected.expiry).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US'))}</strong></div><div><small>{text(language, 'إجمالي السعرات', 'Total calories')}</small><strong>{toWesternNums(selected.calories * selected.quantity)} {text(language, 'سعرة', 'kcal')}</strong></div><div><small>{text(language, 'السعرات للوحدة', 'Calories per unit')}</small><strong>{toWesternNums(selected.calories)} {text(language, 'سعرة', 'kcal')}</strong></div></div><div className="detail-actions"><button className="secondary-btn" onClick={editSelected} data-testid="button-edit-selected"><Pencil size={15} />{text(language, 'تعديل', 'Edit')}</button><button className="primary-btn" onClick={consume} data-testid="button-consume-food"><Check size={16} />{text(language, 'استهلكت', 'Consumed')}</button><button className="icon-btn" onClick={onAdd} data-testid="button-add-related"><Plus size={17} /> <span>{text(language, 'إضافة', 'Add')}</span></button></div></> : <div className="empty-state">{text(language, 'الثلاجة فارغة', 'The fridge is empty')}</div>}</div>
         <div className="shopping-panel card card-pad"><div className="rail-title"><span><ShoppingBasket size={17} /> {text(language, 'قائمة التسوق', 'Shopping list')} <b>{toWesternNums(data.shopping.filter(item => !item.done).length)}</b></span><Link href="/shopping"><ChevronLeft size={16} /></Link></div><ShoppingPreview data={data} setData={setData} /><Link href="/shopping" className="export-list"><ClipboardCopy size={15} /> {text(language, 'تصدير القائمة', 'Export list')}</Link></div>
      </aside>
    </div>
       <div className="dashboard-footer">
       <div className="footer-stat water-stat"><Droplets size={25} /><div><small>{text(language, 'اشرب الماء', 'Drink water')}</small><strong>{toWesternNums(data.water)} / 8 {text(language, 'أكواب', 'cups')}</strong><div className="footer-progress"><i style={{ width: `${data.water / 8 * 100}%` }} /></div></div></div>
       <div className="footer-stat"><Flame size={24} /><div><small>{text(language, 'السعرات المتبقية', 'Calories remaining')}</small><strong>{toWesternNums(Math.max(0, data.calorieGoal - totalCalories).toLocaleString('en-US'))} {text(language, 'سعرة', 'kcal')}</strong></div><div className="mini-ring small" style={{ '--ring-progress': `${percentage}%` } as CSSProperties}><strong>{toWesternNums(percentage)}%</strong></div></div>
      <div className="macro-stat"><small>{text(language, 'توزيع المغذيات', 'Nutrients')}</small><div className="macro-lines"><span><i className="macro-protein" />{text(language, 'بروتين', 'Protein')} <b>35%</b></span><span><i className="macro-carb" />{text(language, 'كربوهيدرات', 'Carbohydrates')} <b>40%</b></span><span><i className="macro-fat" />{text(language, 'دهون صحية', 'Healthy fats')} <b>25%</b></span></div></div>
      <div className="health-tip"><Leaf size={20} /><div><small>{text(language, 'نصيحة اليوم', 'Tip of the day')}</small><strong>{text(language, 'تناول الخضروات في كل وجبة', 'Eat vegetables with every meal')}<br />{text(language, 'للحصول على صحة أفضل.', 'for better health.')}</strong></div></div>
      <button className="floating-add" onClick={onAdd} data-testid="button-add-food-dashboard"><Plus size={26} /><span>{text(language, 'أضف طعاماً جديداً', 'Add new food')}</span></button>
    </div>
  </main>;
}

function ShoppingPreview({ data, setData }: { data: UserData; setData: Dispatch<SetStateAction<UserData>> }) {
  const { language } = useLanguage();
  const visible = data.shopping.slice(0, 4);
  return <div className="shopping-list">{visible.length ? visible.map(item => <div className={`shopping-item ${item.done ? 'done' : ''}`} key={item.id}><input type="checkbox" checked={item.done} onChange={() => setData(prev => ({ ...prev, shopping: prev.shopping.map(row => row.id === item.id ? { ...row, done: !row.done } : row) }))} data-testid={`checkbox-shopping-${item.id}`} /><label>{displayFoodName(item.name, language)}</label><span className="item-quantity">{displayShoppingQuantity(item.quantity, language)}</span></div>) : <div className="empty-state" style={{ padding: 20 }}><ShoppingBasket size={23} /><strong>{text(language, 'قائمتك فارغة', 'Your list is empty')}</strong><span>{text(language, 'أضف ما ينقصك.', 'Add what is missing.')}</span></div>}</div>;
}

function RecipeCard({ recipe, favorite, onFavorite, compact = false }: { recipe: Recipe; favorite: boolean; onFavorite: () => void; compact?: boolean }) {
  return <article className={`recipe-card ${compact ? 'recipe-compact' : ''}`}>
    <div className="recipe-visual">
      <RemoteFoodImage foodName={recipe.name} alt={recipe.name} />
      <span className="recipe-difficulty">سهل</span>
      <button className="icon-btn" style={{ marginRight: 'auto', position: 'relative', zIndex: 2, color: favorite ? 'hsl(var(--destructive))' : undefined }} onClick={onFavorite} data-testid={`button-favorite-${recipe.id}`} aria-label="إضافة للمفضلة"><Heart size={16} fill={favorite ? 'currentColor' : 'none'} /></button>
    </div>
     <div className="recipe-body"><h3>{recipe.name}</h3><p>{recipe.description}</p><div className="recipe-meta"><span>{toWesternNums(recipe.time)}</span><span>{toWesternNums(recipe.calories)} سعرة</span></div><button className="recipe-view-btn" type="button" data-testid={`button-view-recipe-${recipe.id}`}>عرض الوصفة</button></div>
  </article>;
}

function MealsPage({ data, setData, setNotice }: { data: UserData; setData: Dispatch<SetStateAction<UserData>>; setNotice: (v: string) => void }) {
  const [meal, setMeal] = useState('الفطور'); const [planned, setPlanned] = useState<{id: string; title: string; time: string; recipe: string}[]>([
    { id: 'm1', title: 'فطور خفيف', time: '08:00', recipe: 'بيض بلدي مع خضار' }, { id: 'm2', title: 'غداء اليوم', time: '13:30', recipe: 'سلطة الدجاج والحمص' },
  ]);
  const suggestions = meal === 'الفطور' ? ['بيض بلدي مع خضار', 'توست الجبن والخضار'] : meal === 'الغداء' ? ['رز ودجاج', 'سلطة الدجاج والحمص'] : ['كوب الفواكه المنعش', 'حمص بالليمون'];
  const addMeal = () => { setPlanned(prev => [...prev, { id: `m-${Date.now()}`, title: meal, time: meal === 'العشاء' ? '20:00' : '16:00', recipe: suggestions[0] }]); flash(setNotice, 'أضيفت الوجبة إلى يومك'); };
  return <main className="app-main"><PageHeading title="وجباتي" description="خطة مرنة، تترك مساحة لما يشتهيه يومك." action={<button className="primary-btn" onClick={addMeal} data-testid="button-add-meal"><Plus size={17} />إضافة وجبة</button>} /><div className="card card-pad"><div className="toolbar">{['الفطور', 'الغداء', 'العشاء', 'سناك'].map(tab => <button key={tab} className={meal === tab ? 'primary-btn' : 'secondary-btn'} onClick={() => setMeal(tab)} data-testid={`button-meal-tab-${tab}`}>{tab}</button>)}</div><div className="recipe-grid">{suggestions.map(name => { const recipe = recipes.find(item => item.name === name) || recipes[0]; return <RecipeCard key={recipe.id} recipe={recipe} favorite={data.favorites.includes(recipe.id)} onFavorite={() => setData(prev => ({ ...prev, favorites: prev.favorites.includes(recipe.id) ? prev.favorites.filter(id => id !== recipe.id) : [...prev.favorites, recipe.id] }))} />; })}</div></div><div className="card card-pad" style={{ marginTop: 21 }}><div className="card-title"><div><h3>خطة اليوم</h3><p>تعديلاتك محفوظة على هذا الجهاز</p></div><span className="status-pill">{planned.length} وجبات</span></div><div className="table-list">{planned.map(item => <div className="data-row" key={item.id}><strong><Utensils size={15} style={{ verticalAlign: 'middle', marginLeft: 7, color: 'hsl(var(--primary))' }} />{item.title}</strong><span>{item.recipe}</span><span>{item.time}</span><button className="icon-btn" onClick={() => setPlanned(prev => prev.filter(row => row.id !== item.id))} data-testid={`button-remove-meal-${item.id}`}><Trash2 size={15} /></button></div>)}</div></div></main>;
}

function DailyAnalysis({ data }: { data: UserData }) {
  const total = data.items.reduce((sum, item) => sum + item.calories * item.quantity, 0); const goal = data.calorieGoal;
  const bars = [42, 58, 36, 72, 64, Math.min(92, total / goal * 100), 28];
  return <main className="app-main"><PageHeading title="تحليل يومي" description="نظرة هادئة على اختياراتك، بدون أحكام." action={<div className="date-chip">{formatArabicDate()}</div>} /><div className="dashboard-grid"><div className="card card-pad"><div className="card-title"><div><h3>إيقاع السعرات</h3><p>آخر سبعة أيام</p></div><Flame size={20} color="hsl(var(--accent-foreground))" /></div><div style={{ height: 200, display: 'flex', alignItems: 'end', gap: 12, padding: '20px 4px 0' }}>{bars.map((height, index) => <div key={index} style={{ flex: 1, display: 'grid', gap: 8, justifyItems: 'center' }}><div style={{ width: '100%', maxWidth: 45, height: `${height * 1.55}px`, background: index === 5 ? 'hsl(var(--primary))' : 'hsl(35 71% 65% / .54)', borderRadius: '8px 8px 3px 3px', transition: 'height .4s' }} /><small className="muted">{['س', 'ح', 'ن', 'ث', 'ر', 'خ', 'ج'][index]}</small></div>)}</div></div><div className="card card-pad"><div className="card-title"><h3>توزيع المغذيات</h3><Sparkles size={19} color="hsl(var(--primary))" /></div>{[['بروتين', 32, 'hsl(var(--primary))'], ['كربوهيدرات', 46, 'hsl(35 71% 65%)'], ['دهون صحية', 22, 'hsl(196 48% 51%)']].map(([label, value, color]) => <div key={label as string} style={{ marginBottom: 18 }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span>{label}</span><strong>{toWesternNums(value as number)}%</strong></div><div className="progress"><i style={{ width: `${value}%`, background: color as string }} /></div></div>)}</div><div className="card card-pad full-card"><div className="card-title"><div><h3>ملخص لطيف</h3><p>مقارنة بهدفك اليومي</p></div><CheckCircle2 color="hsl(var(--primary))" /></div><div className="metric-row"><div className="metric"><Flame size={18} className="metric-icon" /><strong>{toWesternNums(total.toLocaleString('en-US'))}</strong><span>السعرات المتاحة في الثلاجة</span></div><div className="metric"><Droplets size={18} className="metric-icon" /><strong>{toWesternNums(data.water)} / 8</strong><span>أكواب الماء اليوم</span></div><div className="metric"><Leaf size={18} className="metric-icon" /><strong>{toWesternNums(data.items.filter(item => item.category === 'خضروات').length)}</strong><span>أصناف نباتية</span></div><div className="metric"><Zap size={18} className="metric-icon" /><strong>{toWesternNums(Math.max(0, goal - total))}</strong><span>سعرة متبقية للهدف</span></div></div></div></div></main>;
}

function ShoppingPage({ data, setData, setNotice, onAdd }: { data: UserData; setData: Dispatch<SetStateAction<UserData>>; setNotice: (v: string) => void; onAdd: () => void }) {
  const { language } = useLanguage();
  const [input, setInput] = useState(''); const [quantity, setQuantity] = useState('1');
  const add = () => { if (!input.trim()) return; setData(prev => ({ ...prev, shopping: [...prev.shopping, { id: `s-${Date.now()}`, name: input.trim(), quantity, done: false }] })); setInput(''); flash(setNotice, 'أضيفت للقائمة'); };
  const exportList = async () => { const text = data.shopping.filter(item => !item.done).map(item => `- ${item.name} (${item.quantity})`).join('\n'); try { await navigator.clipboard.writeText(text); flash(setNotice, 'تم نسخ قائمة التسوق'); } catch { flash(setNotice, 'حدّد القائمة وانسخها'); } };
  const lowStock = data.items.filter(item => item.quantity <= 1 && !data.shopping.some(row => row.name === item.name));
  return <main className="app-main"><PageHeading title="قائمة التسوق" description="كل ما تحتاجه رحلتك القادمة، في مكان واحد." action={<div style={{ display: 'flex', gap: 8 }}><button className="secondary-btn" onClick={exportList} data-testid="button-copy-shopping"><ClipboardCopy size={16} />نسخ القائمة</button><button className="primary-btn" onClick={onAdd} data-testid="button-shopping-add-food"><Plus size={17} />إضافة للثلاجة</button></div>} /><div className="dashboard-grid"><div className="card card-pad"><div className="card-title"><div><h3>قائمتك</h3><p>{data.shopping.filter(item => !item.done).length} عناصر متبقية</p></div><button className="icon-btn" onClick={() => setData(prev => ({ ...prev, shopping: prev.shopping.filter(item => !item.done) }))} data-testid="button-clear-done"><Trash2 size={16} /></button></div><div className="shopping-list">{data.shopping.map(item => <div className={`shopping-item ${item.done ? 'done' : ''}`} key={item.id}><input type="checkbox" checked={item.done} onChange={() => setData(prev => ({ ...prev, shopping: prev.shopping.map(row => row.id === item.id ? { ...row, done: !row.done } : row) }))} data-testid={`checkbox-shopping-full-${item.id}`} /><label>{displayFoodName(item.name, language)}</label><span className="item-quantity">{item.quantity}</span><button className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => setData(prev => ({ ...prev, shopping: prev.shopping.filter(row => row.id !== item.id) }))} data-testid={`button-delete-shopping-${item.id}`}><X size={13} /></button></div>)}{!data.shopping.length && <div className="empty-state"><ShoppingBasket size={30} /><strong>السلة فارغة الآن</strong><span>أضف شيئاً قبل أن تنساه.</span></div>}</div><div style={{ display: 'flex', gap: 8, marginTop: 20 }}><input className="search-box" style={{ minWidth: 0 }} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} placeholder="أضف عنصراً..." data-testid="input-shopping-name" /><input className="search-box" style={{ maxWidth: 90, minWidth: 70 }} value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="الكمية" data-testid="input-shopping-quantity" /><button className="primary-btn" onClick={add} data-testid="button-add-shopping"><Plus size={17} /></button></div></div><div className="stack"><div className="card card-pad"><div className="card-title"><div><h3>اقتراحات ذكية</h3><p>أصناف قاربت على النفاد</p></div><Sparkles size={18} color="hsl(var(--accent-foreground))" /></div>{lowStock.length ? <div className="shopping-list">{lowStock.map(item => <div className="shopping-item" key={item.id}><FoodArt item={item} size={31} /><label>{displayFoodName(item.name, language)}</label><button className="secondary-btn" style={{ padding: '7px 10px', fontSize: 11 }} onClick={() => setData(prev => ({ ...prev, shopping: [...prev.shopping, { id: `s-${Date.now()}`, name: item.name, quantity: item.unit, done: false }] }))} data-testid={`button-suggest-${item.id}`}><Plus size={13} />أضف</button></div>)}</div> : <div className="empty-state" style={{ padding: 18 }}><CheckCircle2 size={25} /><strong>مخزونك بخير</strong><span>لا توجد اقتراحات عاجلة.</span></div>}</div><div className="card card-pad"><div className="card-title"><h3>ملاحظة للمتجر</h3><Pencil size={16} /></div><textarea className="field" style={{ width: '100%', border: '1px solid hsl(var(--border))', borderRadius: 11, padding: 10, background: 'hsl(39 33% 94%)', minHeight: 90 }} placeholder="مثال: اختر الطماطم الناضجة..." data-testid="textarea-shopping-note" /></div></div></div></main>;
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

function SettingsPage({ user, data, setData, setNotice, onLogout }: { user: User; data: UserData; setData: Dispatch<SetStateAction<UserData>>; setNotice: (v: string) => void; onLogout: () => void }) {
  const [section, setSection] = useState('عام'); const [goal, setGoal] = useState(String(data.calorieGoal));
  const saveGoal = () => { const number = Number(goal); if (number > 500) { setData(prev => ({ ...prev, calorieGoal: number })); flash(setNotice, 'تم تحديث هدف السعرات'); } };
  return <main className="app-main"><PageHeading title="الإعدادات" description="اجعل ثلاجتي تشبه طريقتك أكثر." /><div className="settings-grid"><div className="card settings-nav">{['عام', 'المظهر', 'التنبيهات', 'الخصوصية'].map(item => <button key={item} className={section === item ? 'active' : ''} onClick={() => setSection(item)} data-testid={`button-settings-${item}`}>{item}</button>)}</div><div className="card card-pad">{section === 'عام' && <><div className="card-title"><div><h3>تفضيلاتك</h3><p>بعض اللمسات الصغيرة لمساحتك</p></div><Settings size={20} color="hsl(var(--primary))" /></div><div className="setting-line"><div><strong>الاسم</strong><p>{user.name}</p></div><button className="secondary-btn" onClick={() => flash(setNotice, 'يمكن تعديل الاسم من صفحة الحساب قريباً')} data-testid="button-edit-name"><Pencil size={14} />تعديل</button></div><div className="setting-line"><div><strong>هدف السعرات اليومي</strong><p>الرقم الذي يساعدك على توازن يومك</p></div><div style={{ display: 'flex', gap: 7 }}><input className="search-box" style={{ width: 100, minWidth: 100, height: 38 }} type="number" value={goal} onChange={e => setGoal(e.target.value)} data-testid="input-calorie-goal" /><button className="primary-btn" style={{ padding: '7px 12px' }} onClick={saveGoal} data-testid="button-save-goal">حفظ</button></div></div><div className="setting-line"><div><strong>وحدات القياس</strong><p>السعرات والكميات تظهر بالعربية</p></div><span className="status-pill">عربي</span></div></>}{section === 'المظهر' && <><div className="card-title"><div><h3>مظهر ثلاجتي</h3><p>اختر الإضاءة التي تناسب وقتك</p></div><Sparkles size={20} color="hsl(var(--accent-foreground))" /></div><div className="setting-line"><div><strong>الوضع الليلي</strong><p>يخفف إضاءة الثلاجة ويجعل الداخل أكثر هدوءاً</p></div><button className={`toggle ${data.darkMode ? 'on' : ''}`} onClick={() => setData(prev => ({ ...prev, darkMode: !prev.darkMode }))} data-testid="toggle-dark-mode"><i /></button></div><div className={`theme-preview ${data.darkMode ? 'night' : ''}`}><span className="preview-light" /><strong>{data.darkMode ? 'إضاءة ليلية هادئة' : 'إضاءة نهارية مشرقة'}</strong></div></>}{section === 'التنبيهات' && <><div className="card-title"><div><h3>تنبيهات لطيفة</h3><p>نذكّرك عندما يكون الوقت مناسباً</p></div><Bell size={20} color="hsl(var(--primary))" /></div><div className="setting-line"><div><strong>تذكير انتهاء الصلاحية</strong><p>قبل يومين من انتهاء الطعام</p></div><button className={`toggle ${data.reminders ? 'on' : ''}`} onClick={() => setData(prev => ({ ...prev, reminders: !prev.reminders }))} data-testid="toggle-reminders"><i /></button></div><div className="setting-line"><div><strong>ملخص نهاية اليوم</strong><p>لمحة عن الماء والسعرات</p></div><button className={`toggle ${data.notifications ? 'on' : ''}`} onClick={() => setData(prev => ({ ...prev, notifications: !prev.notifications }))} data-testid="toggle-notifications"><i /></button></div></>}{section === 'الخصوصية' && <><div className="card-title"><div><h3>خصوصيتك أولاً</h3><p>لا نرسل بياناتك إلى أي مكان</p></div><CircleHelp size={20} color="hsl(var(--primary))" /></div><div className="empty-state" style={{ padding: 30 }}><CheckCircle2 size={32} /><strong>بياناتك محلية تماماً</strong><span>يتم حفظ حسابك ومحتويات ثلاجتك في هذا المتصفح فقط.</span></div><button className="danger-btn" onClick={onLogout} data-testid="button-settings-logout"><LogOut size={15} style={{ verticalAlign: 'middle', marginLeft: 5 }} />تسجيل الخروج من هذا الجهاز</button></>}</div></div></main>;
}

function RoutedPages({ user, data, setData, onLogout, setNotice }: { user: User; data: UserData; setData: Dispatch<SetStateAction<UserData>>; onLogout: () => void; setNotice: (v: string) => void }) {
  const [addOpen, setAddOpen] = useState(false);
  return <AppShell user={user} shoppingCount={data.shopping.filter(item => !item.done).length} onLogout={onLogout}><Switch><Route path="/"><Dashboard userName={user.name} userGender={user.gender} data={data} setData={setData} onAdd={() => setAddOpen(true)} setNotice={setNotice} /></Route><Route path="/meals"><MealsPage data={data} setData={setData} setNotice={setNotice} /></Route><Route path="/daily-analysis"><DailyAnalysis data={data} /></Route><Route path="/shopping"><ShoppingPage data={data} setData={setData} setNotice={setNotice} onAdd={() => setAddOpen(true)} /></Route><Route path="/settings"><SettingsPage user={user} data={data} setData={setData} setNotice={setNotice} onLogout={onLogout} /></Route><Route component={NotFound} /></Switch>{addOpen && <AddFoodModal onClose={() => setAddOpen(false)} onAdd={item => { setData(prev => ({ ...prev, items: [...prev.items, { ...item, id: `food-${Date.now()}` }] })); flash(setNotice, 'أضيف الطعام إلى ثلاجتك'); }} />}</AppShell>;
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
  return <div className={data.darkMode ? 'theme-dark' : ''} data-theme={data.darkMode ? 'dark' : undefined}><RoutedPages user={user} data={data} setData={setData} onLogout={logout} setNotice={setNotice} />{notice && <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 60, padding: '12px 17px', borderRadius: 12, background: 'hsl(var(--sidebar))', color: 'hsl(var(--card))', boxShadow: '0 10px 25px hsl(155 22% 17% / .2)', animation: 'modal-in .2s ease-out' }} role="status" data-testid="status-notice"><CheckCircle2 size={16} style={{ verticalAlign: 'middle', marginLeft: 7, color: 'hsl(var(--accent))' }} />{notice}</div>}</div>;
}

export default function AppWithProviders() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><LanguageProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><ErrorBoundary resetKey={location.pathname}><App /></ErrorBoundary></WouterRouter><Toaster /></LanguageProvider></TooltipProvider></QueryClientProvider>;
}
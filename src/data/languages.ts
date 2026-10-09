import { LanguageCode, LanguageOption } from '../types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', direction: 'ltr' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', direction: 'ltr' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', direction: 'ltr' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', direction: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', direction: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', direction: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', direction: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', direction: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', direction: 'ltr' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', direction: 'ltr' },
];

export const DEFAULT_LANGUAGE_PREFERENCES = {
  interfaceLanguage: 'en' as LanguageCode,
  responseLanguage: 'en' as LanguageCode,
  learningLanguage: 'en' as LanguageCode,
};

// UI Translations dictionary for common interface strings across top languages
export const UI_TRANSLATIONS: Record<string, Record<string, string>> = {
  dashboard: {
    en: 'Dashboard',
    es: 'Panel',
    fr: 'Tableau de bord',
    de: 'Übersicht',
    hi: 'डैशबोर्ड',
    ta: 'முகப்பலகை',
    te: 'డాష్‌బోర్డ్',
    zh: '仪表板',
    ja: 'ダッシュボード',
    ar: 'لوحة القيادة',
  },
  learn: {
    en: 'Universal Learning',
    es: 'Aprendizaje Universal',
    fr: 'Apprentissage Universel',
    de: 'Universelles Lernen',
    hi: 'सार्वभौमिक अध्ययन',
    ta: 'உலகளாவிய கல்வி',
    te: 'సార్వత్రిక అభ్యాసం',
    zh: '通用学习',
    ja: 'ユニバーサル学習',
    ar: 'التعلم الشامل',
  },
  chakra: {
    en: 'CHAKRA Alignment',
    es: 'Alineación CHAKRA',
    fr: 'Alignement CHAKRA',
    de: 'CHAKRA-Ausrichtung',
    hi: 'चक्र संरेखण',
    ta: 'சக்கர ஒருமைப்பாடு',
    te: 'చక్ర సమలేఖనం',
    zh: '轮穴调和',
    ja: 'チャクラ・アライメント',
    ar: 'محاذاة الشاكرا',
  },
  roadmap: {
    en: 'My Learning Roadmaps',
    es: 'Mis Rutas de Aprendizaje',
    fr: 'Mes Feuilles de Route',
    de: 'Meine Lern-Roadmaps',
    hi: 'मेरी अध्ययन योजना',
    ta: 'என் கற்றல் வழிகாட்டி',
    te: 'నా అభ్యాస రోడ్‌మ్యాప్స్',
    zh: '我的学习路线图',
    ja: '学習ロードマップ',
    ar: 'خرائط طريقي التعليمية',
  },
  profile: {
    en: 'My Profile',
    es: 'Mi Perfil',
    fr: 'Mon Profil',
    de: 'Mein Profil',
    hi: 'मेरी प्रोफ़ाइल',
    ta: 'என் சுயவிவரம்',
    te: 'నా ప్రొఫైల్',
    zh: '我的档案',
    ja: 'マイプロフィール',
    ar: 'ملفي الشخصي',
  },
  security: {
    en: 'Security and Privacy',
    es: 'Seguridad y Privacidad',
    fr: 'Sécurité et Confidentialité',
    de: 'Sicherheit und Datenschutz',
    hi: 'सुरक्षा एवं गोपनीयता',
    ta: 'பாதுகாப்பு மற்றும் தனியுரிமை',
    te: 'భద్రత మరియు గోప్యత',
    zh: '安全与隐私',
    ja: 'セキュリティとプライバシー',
    ar: 'الأمان والخصوصية',
  },
  parental: {
    en: 'Parental Controls',
    es: 'Controles Parentales',
    fr: 'Contrôle Parental',
    de: 'Elterliche Kontrolle',
    hi: 'अभिभावक नियंत्रण',
    ta: 'பெற்றோர் கட்டுப்பாடு',
    te: 'తల్లిదండ్రుల నియంత్రణలు',
    zh: '家长控制',
    ja: 'ペアレンタルコントロール',
    ar: 'الرقابة الأبوية',
  },
  settings: {
    en: 'Settings',
    es: 'Configuración',
    fr: 'Paramètres',
    de: 'Einstellungen',
    hi: 'सेटिंग्स',
    ta: 'அமைப்புகள்',
    te: 'సెట్టింగ్‌లు',
    zh: '设置',
    ja: '設定',
    ar: 'الإعدادات',
  },
};

export function t(key: string, lang: LanguageCode): string {
  if (UI_TRANSLATIONS[key] && UI_TRANSLATIONS[key][lang]) {
    return UI_TRANSLATIONS[key][lang];
  }
  if (UI_TRANSLATIONS[key] && UI_TRANSLATIONS[key]['en']) {
    return UI_TRANSLATIONS[key]['en'];
  }
  return key;
}

export function getLanguageName(code: LanguageCode): string {
  const found = SUPPORTED_LANGUAGES.find(l => l.code === code);
  return found ? `${found.name} (${found.nativeName})` : code;
}

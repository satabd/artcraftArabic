import { useLocaleStore, type AppLanguage } from "./locale-store";

// Minimal string table for the app chrome. Keys are stable identifiers;
// English is the source of truth and the fallback for any missing Arabic
// entry. Add new UI strings here as screens get localized.

const TRANSLATIONS = {
  en: {
    "settings.title": "Settings",
    "settings.section.general": "General",
    "settings.section.downloads": "Downloads",
    "settings.section.accounts": "Accounts",
    "settings.section.billing": "Plan & Credits",
    "settings.section.appearance": "Appearance",
    "settings.section.language": "Language",
    "settings.section.keybinds": "Keybinds",
    "settings.section.alerts": "Alerts",
    "settings.section.about": "About",
    "settings.section.provider_priority": "Provider Priority",
    "settings.section.experimental": "Experimental",
    "settings.language.title": "Language & direction",
    "settings.language.description":
      "Choose the app language. Arabic switches the layout to right-to-left and uses an Arabic-ready font. Applies instantly.",
    "settings.language.rtlNote":
      "Prompts, notes and canvas text always follow the direction of what you type, in any language.",
  },
  ar: {
    "settings.title": "الإعدادات",
    "settings.section.general": "عام",
    "settings.section.downloads": "التنزيلات",
    "settings.section.accounts": "الحسابات",
    "settings.section.billing": "الخطة والرصيد",
    "settings.section.appearance": "المظهر",
    "settings.section.language": "اللغة",
    "settings.section.keybinds": "اختصارات لوحة المفاتيح",
    "settings.section.alerts": "التنبيهات",
    "settings.section.about": "حول",
    "settings.section.provider_priority": "أولوية المزوّد",
    "settings.section.experimental": "تجريبي",
    "settings.language.title": "اللغة واتجاه الواجهة",
    "settings.language.description":
      "اختر لغة التطبيق. تحوّل العربية الواجهة إلى الاتجاه من اليمين إلى اليسار وتستخدم خطاً يدعم العربية. يُطبَّق فوراً.",
    "settings.language.rtlNote":
      "تتبع الأوامر النصية والملاحظات ونصوص اللوحة دائماً اتجاه ما تكتبه، بأي لغة.",
  },
} as const satisfies Record<AppLanguage, Record<string, string>>;

export type TranslationKey = keyof (typeof TRANSLATIONS)["en"];

/** Translate `key` for `language`, falling back to English. */
export function translate(key: TranslationKey, language: AppLanguage): string {
  const table: Partial<Record<TranslationKey, string>> = TRANSLATIONS[language];
  return table[key] ?? TRANSLATIONS.en[key];
}

/** React hook: returns a `t(key)` bound to the current app language. */
export function useTranslation(): {
  t: (key: TranslationKey) => string;
  language: AppLanguage;
} {
  const language = useLocaleStore((s) => s.language);
  return { t: (key) => translate(key, language), language };
}

import { create } from "zustand";
import type { TextDirection } from "./text-direction";

// App-wide language + layout direction. Persisted next to the theme in
// localStorage and mirrored onto <html lang dir> so CSS (`:lang(ar)`,
// `[dir="rtl"]`, Tailwind `rtl:` variants) and the browser's own bidi
// handling all follow the user's choice.

export type AppLanguage = "en" | "ar";

export const LANGUAGE_STORAGE_KEY = "st-language";
export const DEFAULT_LANGUAGE: AppLanguage = "en";

export interface LanguageOption {
  id: AppLanguage;
  /** Name in the language itself, so users can always find their own. */
  nativeLabel: string;
  /** Name in English, shown as a hint next to the native label. */
  englishLabel: string;
  direction: TextDirection;
}

export const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  { id: "en", nativeLabel: "English", englishLabel: "English", direction: "ltr" },
  { id: "ar", nativeLabel: "العربية", englishLabel: "Arabic", direction: "rtl" },
];

interface LocaleState {
  language: AppLanguage;
  direction: TextDirection;
  setLanguage: (language: AppLanguage) => void;
}

export const useLocaleStore = create<LocaleState>((set) => {
  const language = readStoredLanguage();
  return {
    language,
    direction: getLanguageDirection(language),
    setLanguage: (next: AppLanguage) => {
      writeStoredLanguage(next);
      applyDocumentLocale(next);
      set({ language: next, direction: getLanguageDirection(next) });
    },
  };
});

export const useLanguage = () => useLocaleStore((s) => s.language);
export const useTextDirection = () => useLocaleStore((s) => s.direction);
export const useIsRtl = () => useLocaleStore((s) => s.direction === "rtl");

/** Apply the stored language to <html> once on boot (before first paint). */
export function initDocumentLocale(): void {
  applyDocumentLocale(useLocaleStore.getState().language);
}

export function getLanguageDirection(language: AppLanguage): TextDirection {
  return LANGUAGE_OPTIONS.find((o) => o.id === language)?.direction ?? "ltr";
}

export function isAppLanguage(value: unknown): value is AppLanguage {
  return LANGUAGE_OPTIONS.some((o) => o.id === value);
}

function applyDocumentLocale(language: AppLanguage): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.lang = language;
  root.dir = getLanguageDirection(language);
}

function readStoredLanguage(): AppLanguage {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  try {
    const value = (window.localStorage.getItem(LANGUAGE_STORAGE_KEY) || "")
      .trim()
      .toLowerCase();
    return isAppLanguage(value) ? value : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

function writeStoredLanguage(language: AppLanguage): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // ignore storage failures
  }
}

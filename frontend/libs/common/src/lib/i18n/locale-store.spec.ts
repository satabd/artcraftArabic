import {
  LANGUAGE_STORAGE_KEY,
  getLanguageDirection,
  initDocumentLocale,
  isAppLanguage,
  useLocaleStore,
} from "./locale-store";

describe("useLocaleStore", () => {
  beforeEach(() => {
    window.localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    useLocaleStore.getState().setLanguage("en");
  });

  it("defaults to English left-to-right", () => {
    const state = useLocaleStore.getState();
    expect(state.language).toBe("en");
    expect(state.direction).toBe("ltr");
    expect(document.documentElement.dir).toBe("ltr");
    expect(document.documentElement.lang).toBe("en");
  });

  it("switching to Arabic flips direction, html attributes and storage", () => {
    useLocaleStore.getState().setLanguage("ar");
    const state = useLocaleStore.getState();
    expect(state.language).toBe("ar");
    expect(state.direction).toBe("rtl");
    expect(document.documentElement.dir).toBe("rtl");
    expect(document.documentElement.lang).toBe("ar");
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("ar");
  });

  it("initDocumentLocale mirrors the current language onto <html>", () => {
    useLocaleStore.getState().setLanguage("ar");
    document.documentElement.dir = "ltr";
    document.documentElement.lang = "en";
    initDocumentLocale();
    expect(document.documentElement.dir).toBe("rtl");
    expect(document.documentElement.lang).toBe("ar");
  });
});

describe("language helpers", () => {
  it("maps languages to directions", () => {
    expect(getLanguageDirection("en")).toBe("ltr");
    expect(getLanguageDirection("ar")).toBe("rtl");
  });

  it("validates stored values", () => {
    expect(isAppLanguage("ar")).toBe(true);
    expect(isAppLanguage("en")).toBe(true);
    expect(isAppLanguage("fr")).toBe(false);
    expect(isAppLanguage(undefined)).toBe(false);
  });
});

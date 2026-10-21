import {
  getAllNewsPosts,
  getDocumentDirection,
  getNewsPostBySlug,
  getNewsPosts,
  resolveDocumentLocale,
  selectLocalizedItems,
} from "./content";

const ARABIC = "مرحباً بالعالم";

describe("bundled news localization", () => {
  it("bundles the Arabic welcome post next to the English one", () => {
    const welcome = getAllNewsPosts().filter((p) => p.slug === "welcome");
    expect(welcome.map((p) => p.lang).sort()).toEqual(["ar", "en"]);
  });

  it("returns one post per slug in the requested language", () => {
    const english = getNewsPosts({ language: "en" });
    const arabic = getNewsPosts({ language: "ar" });
    expect(english.filter((p) => p.slug === "welcome")).toHaveLength(1);
    expect(arabic.filter((p) => p.slug === "welcome")).toHaveLength(1);
    expect(getNewsPostBySlug("welcome", { language: "en" })?.direction).toBe("ltr");
    expect(getNewsPostBySlug("welcome", { language: "ar" })?.direction).toBe("rtl");
    expect(getNewsPostBySlug("welcome", { language: "ar" })?.lang).toBe("ar");
  });

  it("falls back to English for untranslated posts", () => {
    const arabic = getNewsPosts({ language: "ar" });
    const untranslated = arabic.find((p) => p.slug === "world-models-for-film");
    expect(untranslated?.lang).toBe("en");
    expect(untranslated?.direction).toBe("ltr");
  });
});

describe("resolveDocumentLocale", () => {
  it("honours an explicit dir in frontmatter", () => {
    expect(
      resolveDocumentLocale({
        frontmatter: { dir: "rtl" },
        title: "Hello",
        body: "Hello",
      }),
    ).toEqual({ lang: "en", direction: "rtl" });
  });

  it("derives direction from the language", () => {
    expect(
      resolveDocumentLocale({ frontmatter: { lang: "ar" }, title: "x", body: "" })
        .direction,
    ).toBe("rtl");
    expect(
      resolveDocumentLocale({ frontmatter: {}, filenameLang: "he", title: "x", body: "" })
        .direction,
    ).toBe("rtl");
    expect(
      resolveDocumentLocale({ frontmatter: { lang: "fr" }, title: "x", body: "" })
        .direction,
    ).toBe("ltr");
  });

  it("detects direction from the text when no language is given", () => {
    expect(
      resolveDocumentLocale({ frontmatter: {}, title: ARABIC, body: "" }).direction,
    ).toBe("rtl");
    expect(
      resolveDocumentLocale({ frontmatter: {}, title: "Hello", body: ARABIC }).direction,
    ).toBe("ltr");
  });
});

describe("getDocumentDirection", () => {
  it("uses the stored direction, then language, then the text", () => {
    expect(getDocumentDirection({ direction: "rtl" })).toBe("rtl");
    expect(getDocumentDirection({ lang: "ar" })).toBe("rtl");
    expect(getDocumentDirection({ title: ARABIC })).toBe("rtl");
    expect(getDocumentDirection({ title: "Hello", body: ARABIC })).toBe("ltr");
  });
});

describe("selectLocalizedItems", () => {
  it("prefers the requested language, then English, then anything", () => {
    const items = [
      { slug: "a", lang: "en" },
      { slug: "a", lang: "ar" },
      { slug: "b", lang: "en" },
      { slug: "c", lang: "fr" },
    ];
    expect(selectLocalizedItems(items, "ar")).toEqual([
      { slug: "a", lang: "ar" },
      { slug: "b", lang: "en" },
      { slug: "c", lang: "fr" },
    ]);
    expect(selectLocalizedItems(items, "en")).toEqual([
      { slug: "a", lang: "en" },
      { slug: "b", lang: "en" },
      { slug: "c", lang: "fr" },
    ]);
  });
});

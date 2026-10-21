import { translate } from "./translations";

describe("translate", () => {
  it("returns English by default", () => {
    expect(translate("settings.title", "en")).toBe("Settings");
  });

  it("returns Arabic when selected", () => {
    expect(translate("settings.title", "ar")).toBe("الإعدادات");
    expect(translate("settings.section.language", "ar")).toBe("اللغة");
  });

  it("every English key has a non-empty Arabic entry", () => {
    const keys = [
      "settings.title",
      "settings.section.general",
      "settings.section.language",
      "settings.language.title",
      "settings.language.description",
      "settings.language.rtlNote",
    ] as const;
    for (const key of keys) {
      expect(translate(key, "ar").length).toBeGreaterThan(0);
      expect(translate(key, "ar")).not.toBe(translate(key, "en"));
    }
  });
});

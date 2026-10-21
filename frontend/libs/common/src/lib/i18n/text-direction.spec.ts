import {
  containsArabicScript,
  containsRtlScript,
  detectTextDirection,
} from "./text-direction";

const ARABIC = "مرحبا بالعالم";
const HEBREW = "שלום עולם";
const PERSIAN = "سلام دنیا";

describe("detectTextDirection", () => {
  it("returns rtl for Arabic text", () => {
    expect(detectTextDirection(ARABIC)).toBe("rtl");
  });

  it("returns rtl for Hebrew and Persian text", () => {
    expect(detectTextDirection(HEBREW)).toBe("rtl");
    expect(detectTextDirection(PERSIAN)).toBe("rtl");
  });

  it("returns ltr for Latin text", () => {
    expect(detectTextDirection("Hello world")).toBe("ltr");
  });

  it("uses the first strong character for mixed text", () => {
    expect(detectTextDirection(`${ARABIC} 2024 Hello`)).toBe("rtl");
    expect(detectTextDirection(`Hello ${ARABIC}`)).toBe("ltr");
  });

  it("skips leading digits, punctuation and whitespace", () => {
    expect(detectTextDirection(`  123 - "${ARABIC}"`)).toBe("rtl");
    expect(detectTextDirection("  123 - Hello")).toBe("ltr");
  });

  it("falls back for empty or neutral strings", () => {
    expect(detectTextDirection("")).toBe("ltr");
    expect(detectTextDirection("123 !?")).toBe("ltr");
    expect(detectTextDirection("123 !?", "rtl")).toBe("rtl");
  });
});

describe("containsRtlScript", () => {
  it("detects rtl characters anywhere in the string", () => {
    expect(containsRtlScript(`Hello ${ARABIC}`)).toBe(true);
    expect(containsRtlScript(HEBREW)).toBe(true);
    expect(containsRtlScript("Hello")).toBe(false);
  });
});

describe("containsArabicScript", () => {
  it("matches Arabic-script letters only", () => {
    expect(containsArabicScript(ARABIC)).toBe(true);
    expect(containsArabicScript(PERSIAN)).toBe(true);
    expect(containsArabicScript(HEBREW)).toBe(false);
    expect(containsArabicScript("Hello")).toBe(false);
  });
});

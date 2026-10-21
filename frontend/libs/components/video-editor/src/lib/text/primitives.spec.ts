import { describe, expect, it } from "vitest";
import { resolveTextLayout, type TextLayoutParams } from "./primitives";

const CANVAS_HEIGHT = 1080;
const ARABIC = "مرحبا بالعالم";

describe("resolveTextLayout direction", () => {
  it("defaults to ltr for Latin text and keeps letter spacing", () => {
    const layout = resolveTextLayout({
      text: buildParams({ content: "Hello world", letterSpacing: 4 }),
      canvasHeight: CANVAS_HEIGHT,
    });
    expect(layout.direction).toBe("ltr");
    expect(layout.letterSpacing).toBe(4);
  });

  it("resolves rtl for Arabic text and drops letter spacing", () => {
    const layout = resolveTextLayout({
      text: buildParams({ content: ARABIC, letterSpacing: 4 }),
      canvasHeight: CANVAS_HEIGHT,
    });
    expect(layout.direction).toBe("rtl");
    expect(layout.letterSpacing).toBe(0);
  });

  it("keeps the base direction from the first strong character in mixed text", () => {
    const layout = resolveTextLayout({
      text: buildParams({ content: `2024 ${ARABIC} Hello` }),
      canvasHeight: CANVAS_HEIGHT,
    });
    expect(layout.direction).toBe("rtl");
  });

  it("falls back to ltr for empty content", () => {
    const layout = resolveTextLayout({
      text: buildParams({ content: "" }),
      canvasHeight: CANVAS_HEIGHT,
    });
    expect(layout.direction).toBe("ltr");
  });
});

function buildParams(overrides: Partial<TextLayoutParams>): TextLayoutParams {
  return {
    content: "Default text",
    fontSize: 15,
    fontFamily: "Arial",
    fontWeight: "normal",
    fontStyle: "normal",
    textAlign: "center",
    ...overrides,
  };
}

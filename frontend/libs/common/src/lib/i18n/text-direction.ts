// Direction helpers for user-entered text (prompts, canvas text, notes).
//
// Arabic, Hebrew, Persian, Urdu, etc. are written right-to-left. The browser
// shapes the glyphs for us, but the *base direction* of a string decides how
// mixed content (Arabic + digits + Latin) is ordered and which side the text
// hangs from. We follow the HTML `dir="auto"` rule: the first strong
// directional character wins.

export type TextDirection = "ltr" | "rtl";

// Strong RTL ranges: Hebrew, Arabic, Syriac, Thaana, NKo, Arabic Supplement /
// Extended-A, Arabic Presentation Forms A + B.
const RTL_CHAR_REGEX =
  /[֐-׿؀-ۿ܀-ݏݐ-ݿހ-޿߀-߿ࢠ-ࣿיִ-﷿ﹰ-﻿]/;

// Strong LTR: Latin, Greek, Cyrillic, Armenian, Georgian, CJK, Hangul, etc.
// Digits, punctuation and whitespace are "weak"/neutral and skipped.
const LTR_CHAR_REGEX =
  /[A-Za-zÀ-ɏͰ-ϿЀ-ӿ԰-֏Ⴀ-ჿḀ-῿぀-ヿ㐀-䶿一-鿿가-힯]/;

// Arabic-script letters that connect to their neighbours. Tracking (letter
// spacing) between these breaks the joins, so renderers must drop it.
const ARABIC_SCRIPT_REGEX =
  /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;

/**
 * Base direction of `text`, decided by its first strong character.
 * Falls back to `fallback` (default "ltr") for empty or neutral strings.
 */
export function detectTextDirection(
  text: string,
  fallback: TextDirection = "ltr",
): TextDirection {
  for (const char of text) {
    if (RTL_CHAR_REGEX.test(char)) return "rtl";
    if (LTR_CHAR_REGEX.test(char)) return "ltr";
  }
  return fallback;
}

/** True when `text` contains any right-to-left script character. */
export function containsRtlScript(text: string): boolean {
  return RTL_CHAR_REGEX.test(text);
}

/** True when `text` contains Arabic-script letters (Arabic, Persian, Urdu…). */
export function containsArabicScript(text: string): boolean {
  return ARABIC_SCRIPT_REGEX.test(text);
}

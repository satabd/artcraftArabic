// Base-direction detection for canvas text. Kept local so the video editor
// stays free of workspace dependencies; mirrors `@storyteller/common`'s
// `detectTextDirection` / `containsArabicScript` (keep the two in sync).

export type TextDirection = "ltr" | "rtl";

// Strong RTL ranges: Hebrew, Arabic, Syriac, Thaana, NKo, Arabic Supplement /
// Extended-A, Arabic Presentation Forms A + B.
const RTL_CHAR_REGEX =
  /[֐-׿؀-ۿ܀-ݏݐ-ݿހ-޿߀-߿ࢠ-ࣿיִ-﷿ﹰ-﻿]/;

// Strong LTR: Latin, Greek, Cyrillic, Armenian, Georgian, CJK, Hangul, etc.
const LTR_CHAR_REGEX =
  /[A-Za-zÀ-ɏͰ-ϿЀ-ӿ԰-֏Ⴀ-ჿḀ-῿぀-ヿ㐀-䶿一-鿿가-힯]/;

// Arabic-script letters join to their neighbours; tracking breaks the joins.
const ARABIC_SCRIPT_REGEX =
  /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;

/** Base direction of `text` from its first strong character (like dir="auto"). */
export function detectTextDirection({
  text,
  fallback = "ltr",
}: {
  text: string;
  fallback?: TextDirection;
}): TextDirection {
  for (const char of text) {
    if (RTL_CHAR_REGEX.test(char)) return "rtl";
    if (LTR_CHAR_REGEX.test(char)) return "ltr";
  }
  return fallback;
}

/** True when `text` contains Arabic-script letters (Arabic, Persian, Urdu…). */
export function containsArabicScript({ text }: { text: string }): boolean {
  return ARABIC_SCRIPT_REGEX.test(text);
}

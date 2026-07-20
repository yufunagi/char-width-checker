/**
 * Classify characters as fullwidth, halfwidth, or problematic (other).
 */

const FULLWIDTH_ASCII_START = 0xff01;
const FULLWIDTH_ASCII_END = 0xff5e;
const HALFWIDTH_KATA_START = 0xff61;
const HALFWIDTH_KATA_END = 0xff9f;
const CJK_START = 0x3000;
const CJK_END = 0x9fff;
const CJK_EXT_A_END = 0x9fff;
const HIRAGANA_START = 0x3040;
const HIRAGANA_END = 0x309f;
const KATAKANA_START = 0x30a0;
const KATAKANA_END = 0x30ff;
const FULLWIDTH_SPACE = 0x3000;

/** @typedef {'fullwidth' | 'halfwidth' | 'other'} CharCategory */

/**
 * @param {string} char
 * @returns {CharCategory}
 */
export function classifyChar(char) {
  if (char.length === 0) return 'other';

  const code = char.codePointAt(0);
  if (code === undefined) return 'other';

  if (isControlOrFormat(code, char)) return 'other';

  if (isHalfwidth(code)) return 'halfwidth';
  if (isFullwidth(code)) return 'fullwidth';

  if (code > 0xffff) return 'other';

  if (isCjkOrJapanese(code)) return 'fullwidth';

  return 'halfwidth';
}

/**
 * @param {number} code
 * @param {string} char
 */
function isControlOrFormat(code, char) {
  if (char === '\n' || char === '\r' || char === '\t') return false;
  const category = /\p{Extended_Pictographic}/u.test(char);
  if (category) return true;
  if (code < 0x20) return true;
  if (code >= 0x7f && code <= 0x9f) return true;
  return false;
}

/**
 * @param {number} code
 */
function isHalfwidth(code) {
  if (code >= 0x20 && code <= 0x7e) return true;
  if (code >= HALFWIDTH_KATA_START && code <= HALFWIDTH_KATA_END) return true;
  if (code === 0xffe0 || code === 0xffe1) return true;
  return false;
}

/**
 * @param {number} code
 */
function isFullwidth(code) {
  if (code === FULLWIDTH_SPACE) return true;
  if (code >= FULLWIDTH_ASCII_START && code <= FULLWIDTH_ASCII_END) return true;
  if (code >= 0xffe0 && code <= 0xffee) return true;
  return false;
}

/**
 * @param {number} code
 */
function isCjkOrJapanese(code) {
  if (code >= HIRAGANA_START && code <= HIRAGANA_END) return true;
  if (code >= KATAKANA_START && code <= KATAKANA_END) return true;
  if (code >= CJK_START && code <= CJK_EXT_A_END) return true;
  if (code >= 0x3400 && code <= 0x4dbf) return true;
  if (code >= 0x20000 && code <= 0x2a6df) return true;
  if (code >= 0xf900 && code <= 0xfaff) return true;
  if (code >= 0x3040 && code <= 0x30ff) return true;
  return false;
}

/**
 * Split text into grapheme-like units for display/counting.
 * @param {string} text
 * @returns {string[]}
 */
export function splitGraphemes(text) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('ja', { granularity: 'grapheme' });
    return [...segmenter.segment(text)].map((s) => s.segment);
  }
  return [...text];
}

/**
 * @param {string} text
 * @returns {{ chars: string[], categories: CharCategory[] }}
 */
export function analyzeText(text) {
  const chars = splitGraphemes(text);
  const categories = chars.map(classifyChar);
  return { chars, categories };
}

/**
 * Detect characters that cannot be encoded in Shift_JIS.
 * @param {string} text
 * @returns {{ char: string, index: number, codePoint: number }[]}
 */
export function findSjisProblemChars(text) {
  if (typeof Encoding === 'undefined') return [];

  const problems = [];
  const chars = splitGraphemes(text);

  chars.forEach((char, index) => {
    if (char === '\n' || char === '\r' || char === '\t') return;

    try {
      const converted = Encoding.convert(char, { to: 'SJIS', from: 'UNICODE', type: 'array' });
      if (!converted || converted.length === 0) {
        problems.push({ char, index, codePoint: char.codePointAt(0) ?? 0 });
        return;
      }
      const back = Encoding.convert(converted, { to: 'UNICODE', from: 'SJIS', type: 'string' });
      if (back !== char) {
        problems.push({ char, index, codePoint: char.codePointAt(0) ?? 0 });
      }
    } catch {
      problems.push({ char, index, codePoint: char.codePointAt(0) ?? 0 });
    }
  });

  const seen = new Set();
  return problems.filter((p) => {
    const key = `${p.codePoint}:${p.char}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Mark chars as warn if SJIS-incompatible or emoji/other category.
 * @param {string[]} chars
 * @param {CharCategory[]} categories
 * @param {string} text
 * @returns {('fw' | 'hw' | 'warn')[]}
 */
export function getHighlightClasses(chars, categories, text) {
  const sjisProblems = new Set(
    findSjisProblemChars(text).map((p) => p.index)
  );

  return chars.map((char, i) => {
    if (sjisProblems.has(i) || categories[i] === 'other') {
      if (char === '\n' || char === '\r' || char === '\t') {
        return categories[i] === 'halfwidth' ? 'hw' : 'fw';
      }
      return 'warn';
    }
    return categories[i] === 'fullwidth' ? 'fw' : 'hw';
  });
}

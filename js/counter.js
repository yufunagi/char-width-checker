import { analyzeText, classifyChar, splitGraphemes } from './char-classifier.js';

/**
 * @typedef {'chars' | 'sjis' | 'width'} CountMode
 */

/**
 * @typedef {Object} CountResult
 * @property {number} chars
 * @property {number} sjis
 * @property {number} width
 * @property {number} fullwidth
 * @property {number} halfwidth
 * @property {number} newlines
 * @property {number} spaces
 * @property {number} charsNoWhitespace
 * @property {number} sjisNoWhitespace
 * @property {number} widthNoWhitespace
 */

/**
 * Count Shift_JIS byte length for text.
 * @param {string} text
 * @returns {number}
 */
function countSjisBytes(text) {
  if (typeof Encoding === 'undefined' || !text) return 0;

  try {
    const arr = Encoding.convert(text, { to: 'SJIS', from: 'UNICODE', type: 'array' });
    return arr ? arr.length : 0;
  } catch {
    let total = 0;
    for (const char of splitGraphemes(text)) {
      try {
        const arr = Encoding.convert(char, { to: 'SJIS', from: 'UNICODE', type: 'array' });
        total += arr ? arr.length : 2;
      } catch {
        total += 2;
      }
    }
    return total;
  }
}

/**
 * @param {string} char
 * @returns {number}
 */
function displayWidthOfChar(char) {
  if (char === '\n' || char === '\r' || char === '\t') return 1;
  const cat = classifyChar(char);
  if (cat === 'fullwidth' || cat === 'other') return 2;
  return 1;
}

/**
 * @param {string} text
 * @returns {CountResult}
 */
export function countText(text) {
  const chars = splitGraphemes(text);
  const { categories } = analyzeText(text);

  let fullwidth = 0;
  let halfwidth = 0;
  let newlines = 0;
  let spaces = 0;
  let width = 0;

  chars.forEach((char, i) => {
    if (char === '\n' || char === '\r') newlines++;
    if (char === ' ' || char === '\t' || char === '\u3000') spaces++;

    if (categories[i] === 'fullwidth') fullwidth++;
    else if (categories[i] === 'halfwidth') halfwidth++;

    width += displayWidthOfChar(char);
  });

  const charCount = chars.length;
  const sjisCount = countSjisBytes(text);

  const textNoWs = text.replace(/[\s\r\n\t\u3000]/g, '');
  const charsNoWhitespace = splitGraphemes(textNoWs).length;
  const sjisNoWhitespace = countSjisBytes(textNoWs);
  let widthNoWhitespace = 0;
  for (const char of splitGraphemes(textNoWs)) {
    widthNoWhitespace += displayWidthOfChar(char);
  }

  return {
    chars: charCount,
    sjis: sjisCount,
    width,
    fullwidth,
    halfwidth,
    newlines,
    spaces,
    charsNoWhitespace,
    sjisNoWhitespace,
    widthNoWhitespace,
  };
}

/**
 * @param {CountResult} result
 * @param {CountMode} mode
 * @param {boolean} excludeWhitespace
 * @returns {number}
 */
export function getValueForMode(result, mode, excludeWhitespace) {
  if (excludeWhitespace) {
    if (mode === 'chars') return result.charsNoWhitespace;
    if (mode === 'sjis') return result.sjisNoWhitespace;
    return result.widthNoWhitespace;
  }
  if (mode === 'chars') return result.chars;
  if (mode === 'sjis') return result.sjis;
  return result.width;
}

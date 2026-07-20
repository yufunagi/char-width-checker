/**
 * Halfwidth katakana to fullwidth katakana mapping.
 */
const HW_KATA_TO_FW = {
  '\uFF61': '\u3002',
  '\uFF62': '\u300C',
  '\uFF63': '\u300D',
  '\uFF64': '\u3001',
  '\uFF65': '\u30FB',
  '\uFF66': '\u30F2',
  '\uFF67': '\u30A1',
  '\uFF68': '\u30A3',
  '\uFF69': '\u30A5',
  '\uFF6A': '\u30A7',
  '\uFF6B': '\u30A9',
  '\uFF6C': '\u30E3',
  '\uFF6D': '\u30E5',
  '\uFF6E': '\u30E7',
  '\uFF6F': '\u30C3',
  '\uFF70': '\u30FC',
  '\uFF71': '\u30A2',
  '\uFF72': '\u30A4',
  '\uFF73': '\u30A6',
  '\uFF74': '\u30A8',
  '\uFF75': '\u30AA',
  '\uFF76': '\u30AB',
  '\uFF77': '\u30AD',
  '\uFF78': '\u30AF',
  '\uFF79': '\u30B1',
  '\uFF7A': '\u30B3',
  '\uFF7B': '\u30B5',
  '\uFF7C': '\u30B7',
  '\uFF7D': '\u30B9',
  '\uFF7E': '\u30BB',
  '\uFF7F': '\u30BD',
  '\uFF80': '\u30BF',
  '\uFF81': '\u30C1',
  '\uFF82': '\u30C4',
  '\uFF83': '\u30C6',
  '\uFF84': '\u30C8',
  '\uFF85': '\u30CA',
  '\uFF86': '\u30CB',
  '\uFF87': '\u30CC',
  '\uFF88': '\u30CD',
  '\uFF89': '\u30CE',
  '\uFF8A': '\u30CF',
  '\uFF8B': '\u30D2',
  '\uFF8C': '\u30D5',
  '\uFF8D': '\u30D8',
  '\uFF8E': '\u30DB',
  '\uFF8F': '\u30DE',
  '\uFF90': '\u30DF',
  '\uFF91': '\u30E0',
  '\uFF92': '\u30E1',
  '\uFF93': '\u30E2',
  '\uFF94': '\u30E4',
  '\uFF95': '\u30E6',
  '\uFF96': '\u30E8',
  '\uFF97': '\u30E9',
  '\uFF98': '\u30EA',
  '\uFF99': '\u30EB',
  '\uFF9A': '\u30EC',
  '\uFF9B': '\u30ED',
  '\uFF9C': '\u30EF',
  '\uFF9D': '\u30F3',
  '\uFF9E': '\u309B',
  '\uFF9F': '\u309C',
};

const FW_KATA_TO_HW = Object.fromEntries(
  Object.entries(HW_KATA_TO_FW).map(([hw, fw]) => [fw, hw])
);

const HW_DAKUTEN_MAP = {
  '\uFF76': '\u30AC', '\uFF77': '\u30AE', '\uFF78': '\u30B0', '\uFF79': '\u30B2',
  '\uFF7A': '\u30B4', '\uFF7B': '\u30B6', '\uFF7C': '\u30B8', '\uFF7D': '\u30BA',
  '\uFF7E': '\u30BC', '\uFF7F': '\u30BE', '\uFF80': '\u30C0', '\uFF81': '\u30C2',
  '\uFF82': '\u30C5', '\uFF83': '\u30C7', '\uFF84': '\u30C9', '\uFF8A': '\u30D0',
  '\uFF8B': '\u30D3', '\uFF8C': '\u30D6', '\uFF8D': '\u30D9', '\uFF8E': '\u30DC',
  '\uFF73': '\u30F4',
};

const HW_HANDAKUTEN_MAP = {
  '\uFF8A': '\u30D1', '\uFF8B': '\u30D4', '\uFF8C': '\u30D7', '\uFF8D': '\u30DA',
  '\uFF8E': '\u30DD',
};

/**
 * @param {string} text
 * @returns {string}
 */
export function toFullWidth(text) {
  let result = '';
  const chars = [...text];

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];

    if (ch in HW_KATA_TO_FW) {
      if (chars[i + 1] === '\uFF9E' && ch in HW_DAKUTEN_MAP) {
        result += HW_DAKUTEN_MAP[ch];
        i++;
        continue;
      }
      if (chars[i + 1] === '\uFF9F' && ch in HW_HANDAKUTEN_MAP) {
        result += HW_HANDAKUTEN_MAP[ch];
        i++;
        continue;
      }
      result += HW_KATA_TO_FW[ch];
      continue;
    }

    if (ch >= '!' && ch <= '~') {
      result += String.fromCharCode(ch.charCodeAt(0) + 0xfee0);
      continue;
    }

    if (ch === ' ') {
      result += '\u3000';
      continue;
    }

    result += ch;
  }

  return result;
}

/**
 * @param {string} text
 * @returns {string}
 */
export function toHalfWidth(text) {
  let result = '';
  const chars = [...text];

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];

    if (ch in FW_KATA_TO_HW) {
      result += FW_KATA_TO_HW[ch];
      continue;
    }

    const decomposed = ch.normalize('NFD');
    if (decomposed.length === 2) {
      const base = decomposed[0];
      const mark = decomposed[1];
      if (base in FW_KATA_TO_HW) {
        if (mark === '\u3099') {
          result += FW_KATA_TO_HW[base] + '\uFF9E';
          continue;
        }
        if (mark === '\u309A') {
          result += FW_KATA_TO_HW[base] + '\uFF9F';
          continue;
        }
      }
    }

    const code = ch.charCodeAt(0);
    if (code >= 0xff01 && code <= 0xff5e) {
      result += String.fromCharCode(code - 0xfee0);
      continue;
    }

    if (ch === '\u3000') {
      result += ' ';
      continue;
    }

    result += ch;
  }

  return result;
}

/**
 * @param {string} text
 * @param {'full' | 'half'} mode
 * @returns {string}
 */
export function convert(text, mode) {
  return mode === 'full' ? toFullWidth(text) : toHalfWidth(text);
}

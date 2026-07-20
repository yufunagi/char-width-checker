import { analyzeText, getHighlightClasses } from './char-classifier.js';

/**
 * Escape HTML special characters.
 * @param {string} text
 */
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Build highlighted HTML for the preview overlay.
 * @param {string} text
 * @returns {string}
 */
export function buildHighlightHtml(text) {
  if (!text) return '';

  const { chars, categories } = analyzeText(text);
  const classes = getHighlightClasses(chars, categories, text);

  let html = '';
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const cls = classes[i];
    const escaped = escapeHtml(char);
    if (char === '\n') {
      html += `<span class="char--${cls}">\n</span>`;
    } else {
      html += `<span class="char--${cls}">${escaped}</span>`;
    }
  }
  return html;
}

/**
 * Sync preview overlay with textarea content and scroll position.
 * @param {HTMLTextAreaElement} textarea
 * @param {HTMLElement} preview
 * @param {string} text
 */
export function updateHighlight(textarea, preview, text) {
  preview.innerHTML = buildHighlightHtml(text);
  syncScroll(textarea, preview);
}

/**
 * @param {HTMLTextAreaElement} textarea
 * @param {HTMLElement} preview
 */
export function syncScroll(textarea, preview) {
  preview.scrollTop = textarea.scrollTop;
  preview.scrollLeft = textarea.scrollLeft;
}

/**
 * Attach scroll/resize listeners for overlay sync.
 * @param {HTMLTextAreaElement} textarea
 * @param {HTMLElement} preview
 */
export function bindScrollSync(textarea, preview) {
  textarea.addEventListener('scroll', () => syncScroll(textarea, preview));
}

/**
 * Keep preview layer metrics aligned with textarea (font, padding).
 * @param {HTMLTextAreaElement} textarea
 * @param {HTMLElement} preview
 */
export function syncEditorMetrics(textarea, preview) {
  const style = getComputedStyle(textarea);
  const props = [
    'fontFamily',
    'fontSize',
    'fontWeight',
    'lineHeight',
    'letterSpacing',
    'padding',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'border',
    'boxSizing',
    'wordWrap',
    'overflowWrap',
    'wordBreak',
    'lineBreak',
    'whiteSpace',
  ];

  props.forEach((prop) => {
    preview.style[prop] = style[prop];
  });

  preview.style.width = `${textarea.clientWidth}px`;
  preview.style.minHeight = `${textarea.clientHeight}px`;
}

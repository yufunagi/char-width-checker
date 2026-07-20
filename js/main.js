import { countText, getValueForMode } from './counter.js';
import { findSjisProblemChars, splitGraphemes } from './char-classifier.js';
import { updateHighlight, bindScrollSync, syncEditorMetrics } from './highlighter.js';
import { toFullWidth, toHalfWidth } from './converter.js';
import {
  applyLocale,
  bindLangSwitch,
  detectInitialLocale,
  getLocale,
  t,
} from './i18n.js';

const STORAGE_KEY = 'char-width-checker-settings';

/** @type {HTMLTextAreaElement} */
const editor = document.getElementById('editor');

/** @type {HTMLElement} */
const editorPreview = document.getElementById('editorPreview');

const statChars = document.getElementById('statChars');
const statSjis = document.getElementById('statSjis');
const statWidth = document.getElementById('statWidth');
const statCharsWrap = document.getElementById('statCharsWrap');
const statSjisWrap = document.getElementById('statSjisWrap');
const statWidthWrap = document.getElementById('statWidthWrap');
const statsDetail = document.getElementById('statsDetail');
const emptyHint = document.getElementById('emptyHint');

const limitInput = document.getElementById('limitInput');
const limitMode = document.getElementById('limitMode');
const excludeWhitespace = document.getElementById('excludeWhitespace');
const progressWrap = document.getElementById('progressWrap');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

const problemPanel = document.getElementById('problemPanel');
const problemList = document.getElementById('problemList');

const btnFullWidth = document.getElementById('btnFullWidth');
const btnHalfWidth = document.getElementById('btnHalfWidth');
const btnCopy = document.getElementById('btnCopy');
const btnClear = document.getElementById('btnClear');

const helpBtn = document.getElementById('helpBtn');
const helpDialog = document.getElementById('helpDialog');
const helpClose = document.getElementById('helpClose');
const toast = document.getElementById('toast');

const presetBtns = document.querySelectorAll('.preset-btn');

/** @type {ReturnType<typeof setTimeout> | null} */
let toastTimer = null;

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const settings = JSON.parse(raw);
    if (settings.limit != null && settings.limit > 0) {
      limitInput.value = String(settings.limit);
    }
    if (settings.limitMode) limitMode.value = settings.limitMode;
    if (settings.excludeWhitespace) excludeWhitespace.checked = true;
    if (settings.text) editor.value = settings.text;
  } catch {
    /* ignore */
  }
}

function saveSettings() {
  const limit = parseInt(limitInput.value, 10);
  const settings = {
    limit: Number.isFinite(limit) && limit > 0 ? limit : null,
    limitMode: limitMode.value,
    excludeWhitespace: excludeWhitespace.checked,
    text: editor.value,
    lang: getLocale(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* ignore */
  }
}

/**
 * @param {'ja' | 'en'} lang
 */
function setLocale(lang) {
  applyLocale(lang);
  refresh();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('toast--visible');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('toast--visible');
  }, 2000);
}

function updatePresetActiveState() {
  const raw = limitInput.value.trim();
  const val = parseInt(raw, 10);
  const isNone = raw === '' || !Number.isFinite(val) || val <= 0;

  presetBtns.forEach((btn) => {
    const limitAttr = btn.dataset.limit ?? '';
    if (limitAttr === '') {
      btn.classList.toggle('preset-btn--active', isNone);
      return;
    }
    const limit = parseInt(limitAttr, 10);
    btn.classList.toggle('preset-btn--active', !isNone && limit === val);
  });
}

function updateActiveModeIndication() {
  const mode = limitMode.value;
  statCharsWrap.classList.toggle('stat--active', mode === 'chars');
  statSjisWrap.classList.toggle('stat--active', mode === 'sjis');
  statWidthWrap.classList.toggle('stat--active', mode === 'width');
}

/**
 * Convert grapheme index to UTF-16 string offset.
 * @param {string} text
 * @param {number} graphemeIndex
 */
function graphemeIndexToOffset(text, graphemeIndex) {
  const chars = splitGraphemes(text);
  let offset = 0;
  const max = Math.min(graphemeIndex, chars.length);
  for (let i = 0; i < max; i++) {
    offset += chars[i].length;
  }
  return offset;
}

/**
 * @param {number} graphemeIndex
 */
function jumpToGrapheme(graphemeIndex) {
  const text = editor.value;
  const chars = splitGraphemes(text);
  const start = graphemeIndexToOffset(text, graphemeIndex);
  const len = chars[graphemeIndex]?.length ?? 0;
  const end = start + Math.max(len, 1);

  editor.focus();
  editor.setSelectionRange(start, end);

  const lineHeight = parseFloat(getComputedStyle(editor).lineHeight) || 28;
  const before = text.slice(0, start);
  const lineIndex = (before.match(/\n/g) || []).length;
  const targetTop = lineIndex * lineHeight - editor.clientHeight / 3;
  editor.scrollTop = Math.max(0, targetTop);
  editorPreview.scrollTop = editor.scrollTop;
}

function updateProblemPanel(text) {
  const problems = findSjisProblemChars(text);

  if (problems.length === 0) {
    problemPanel.hidden = true;
    problemList.innerHTML = '';
    return;
  }

  problemPanel.hidden = false;
  problemList.innerHTML = problems
    .map((p) => {
      const display = p.char === ' ' ? t('problem.space') : p.char;
      const code = `U+${p.codePoint.toString(16).toUpperCase().padStart(4, '0')}`;
      return `<li>
        <button type="button" class="problem-jump" data-index="${p.index}">
          <code>${escapeHtml(display)}</code> — ${code}${escapeHtml(t('problem.hint'))}
        </button>
      </li>`;
    })
    .join('');
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function updateEmptyHint(text) {
  emptyHint.hidden = text.length > 0;
}

function modeLabel(mode) {
  if (mode === 'sjis') return t('limit.modeSjis');
  if (mode === 'width') return t('limit.modeWidth');
  return t('limit.modeChars');
}

function updateProgress(result) {
  const limit = parseInt(limitInput.value, 10);
  const mode = /** @type {'chars' | 'sjis' | 'width'} */ (limitMode.value);
  const exclude = excludeWhitespace.checked;
  const label = modeLabel(mode);

  if (!Number.isFinite(limit) || limit <= 0) {
    progressWrap.hidden = true;
    statChars.classList.remove('stat__value--over');
    statSjis.classList.remove('stat__value--over');
    statWidth.classList.remove('stat__value--over');
    const progressBar = progressFill.parentElement;
    if (progressBar) {
      progressBar.removeAttribute('aria-valuenow');
      progressBar.removeAttribute('aria-valuemax');
      progressBar.removeAttribute('aria-valuetext');
    }
    return;
  }

  progressWrap.hidden = false;
  const current = getValueForMode(result, mode, exclude);
  const ratio = Math.min(current / limit, 1);
  const isOver = current > limit;
  const remaining = limit - current;
  const over = current - limit;

  progressFill.style.width = `${ratio * 100}%`;
  progressFill.classList.toggle('progress-bar__fill--over', isOver);
  progressText.textContent = isOver
    ? t('progress.over', { current, limit, over })
    : t('progress.ok', { current, limit });
  progressText.classList.toggle('progress-text--over', isOver);

  const progressBar = progressFill.parentElement;
  if (progressBar) {
    progressBar.setAttribute('aria-valuenow', String(current));
    progressBar.setAttribute('aria-valuemax', String(limit));
    const valueText = isOver
      ? t('progress.ariaOver', { mode: label, current, limit, over })
      : t('progress.ariaOk', { mode: label, current, limit, remaining });
    progressBar.setAttribute('aria-valuetext', valueText);
  }

  statChars.classList.toggle('stat__value--over', mode === 'chars' && isOver);
  statSjis.classList.toggle('stat__value--over', mode === 'sjis' && isOver);
  statWidth.classList.toggle('stat__value--over', mode === 'width' && isOver);
}

function refresh() {
  const text = editor.value;
  const exclude = excludeWhitespace.checked;
  const result = countText(text);

  statChars.textContent = String(exclude ? result.charsNoWhitespace : result.chars);
  statSjis.textContent = String(exclude ? result.sjisNoWhitespace : result.sjis);
  statWidth.textContent = String(exclude ? result.widthNoWhitespace : result.width);
  statsDetail.textContent = t('editor.statsDetail', {
    fullwidth: result.fullwidth,
    halfwidth: result.halfwidth,
    newlines: result.newlines,
    spaces: result.spaces,
  });

  updateEmptyHint(text);
  updateHighlight(editor, editorPreview, text);
  updateProblemPanel(text);
  updateProgress(result);
  updatePresetActiveState();
  updateActiveModeIndication();
  saveSettings();
}

function init() {
  loadSettings();
  applyLocale(detectInitialLocale());
  bindLangSwitch(setLocale);
  bindScrollSync(editor, editorPreview);

  editor.addEventListener('input', refresh);
  editor.addEventListener('scroll', () => {
    editorPreview.scrollTop = editor.scrollTop;
    editorPreview.scrollLeft = editor.scrollLeft;
  });

  limitInput.addEventListener('input', refresh);
  limitMode.addEventListener('change', refresh);
  excludeWhitespace.addEventListener('change', refresh);

  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      limitInput.value = btn.dataset.limit ?? '';
      refresh();
    });
  });

  problemList.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const btn = target.closest('.problem-jump');
    if (!(btn instanceof HTMLButtonElement)) return;
    const index = parseInt(btn.dataset.index ?? '', 10);
    if (!Number.isFinite(index) || index < 0) return;
    jumpToGrapheme(index);
  });

  btnFullWidth.addEventListener('click', () => {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    editor.value = toFullWidth(editor.value);
    const max = editor.value.length;
    editor.selectionStart = Math.min(start, max);
    editor.selectionEnd = Math.min(end, max);
    editor.focus();
    refresh();
    showToast(t('toast.fullWidth'));
  });

  btnHalfWidth.addEventListener('click', () => {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    editor.value = toHalfWidth(editor.value);
    const max = editor.value.length;
    editor.selectionStart = Math.min(start, max);
    editor.selectionEnd = Math.min(end, max);
    editor.focus();
    refresh();
    showToast(t('toast.halfWidth'));
  });

  btnCopy.addEventListener('click', async () => {
    const text = editor.value;
    if (!text) {
      showToast(t('toast.copyEmpty'));
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      showToast(t('toast.copyOk'));
    } catch {
      showToast(t('toast.copyFail'));
    }
  });

  btnClear.addEventListener('click', () => {
    if (editor.value && !confirm(t('confirm.clear'))) return;
    editor.value = '';
    editor.focus();
    refresh();
  });

  helpBtn.addEventListener('click', () => helpDialog.showModal());
  helpClose.addEventListener('click', () => helpDialog.close());
  helpDialog.addEventListener('click', (e) => {
    if (e.target === helpDialog) helpDialog.close();
  });

  window.addEventListener('resize', () => {
    syncEditorMetrics(editor, editorPreview);
    refresh();
  });

  syncEditorMetrics(editor, editorPreview);
  refresh();
}

init();

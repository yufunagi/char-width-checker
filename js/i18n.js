/** @typedef {'ja' | 'en'} Locale */

/** @type {Record<Locale, Record<string, string>>} */
const DICTS = {
  ja: {
    'meta.title': '字数チェック — 全角・半角文字チェッカー',
    'meta.description':
      '応募フォーム向けの字数チェックツール。文字数・SJISバイト・表示幅をカウントし、全角・半角を可視化・一括変換できます。入力はブラウザ内のみで処理され、サーバーには送信されません。',

    'header.title': '字数チェック',
    'header.subtitle': '応募フォームの文字数・全角半角を確認',
    'intro.summary':
      '字数チェックは、応募フォーム向けに文字数・SJISバイト・表示幅をカウントし、全角・半角を可視化・一括変換できる無料のブラウザツールです。学生・イベント参加者などフォーム提出前の確認に使え、入力はサーバーに送られずブラウザ内のみで処理されます。',
    'header.helpAria': '使い方',
    'header.langAria': '言語',
    'header.langJa': '日本語',
    'header.langEn': 'EN',

    'editor.sectionAria': '原稿入力',
    'editor.statsAria': '文字数統計',
    'editor.statChars': '文字数',
    'editor.statSjis': 'SJISバイト',
    'editor.statWidth': '表示幅',
    'editor.statsDetail': '全角 {fullwidth} · 半角 {halfwidth} · 改行 {newlines} · 空白 {spaces}',
    'editor.emptyHint':
      '色分けで全角・半角を確認し、上限や一括変換も使えます。折り返しは画面上の見え方のみで、コピーされる文字には改行は入りません。',
    'editor.label': '原稿エリア',
    'editor.placeholder': 'ここに文章を入力または貼り付け…',
    'editor.legendAria': '凡例',
    'editor.legendFw': '全角',
    'editor.legendHw': '半角',
    'editor.legendWarn': '問題文字',

    'limit.sectionAria': '文字数上限',
    'limit.label': '上限',
    'limit.presetsAria': '上限プリセット',
    'limit.none': 'なし',
    'limit.inputAria': '文字数上限',
    'limit.excludeWs': '空白・改行を除く',
    'limit.modeLabel': '基準',
    'limit.modeAria': '上限のカウント方式',
    'limit.modeChars': '文字数',
    'limit.modeSjis': 'SJISバイト',
    'limit.modeWidth': '表示幅',

    'progress.over': '{current} / {limit}（{over}超過）',
    'progress.ok': '{current} / {limit}',
    'progress.ariaOver': '{mode} {current}、上限 {limit}、{over}超過',
    'progress.ariaOk': '{mode} {current}、上限 {limit}、残り {remaining}',

    'problem.title': '問題文字（クリックで該当位置へ）',
    'problem.space': '(スペース)',
    'problem.hint': '（フォームで使えない可能性）',

    'actions.sectionAria': '操作',
    'actions.fullWidth': '全角に統一',
    'actions.halfWidth': '半角に統一',
    'actions.copy': 'コピー',
    'actions.clear': 'クリア',

    'footer.privacy':
      '入力はブラウザ内のみで処理され、サーバーには送信されません。設定・原稿は端末の localStorage に保存されます。',

    'help.title': '使い方',
    'help.intro':
      '応募フォームでは全角のみ・半角のみなど、文字種の指定があることがあります。このツールで可視化・変換できます。',
    'help.li1Term': '文字数',
    'help.li1Desc': '— 1文字 = 1 としてカウント',
    'help.li2Term': 'SJISバイト',
    'help.li2Desc': '— Shift_JIS 換算のバイト数（全角2・半角1が多い）',
    'help.li3Term': '表示幅',
    'help.li3Desc': '— 全角 = 2、半角 = 1 で換算',
    'help.li4': '色分けで全角・半角・問題文字（絵文字など）を確認できます',
    'help.li5':
      '折り返しは日本語の禁則に沿った画面上の見え方のみです。コピーされる文字には改行は入りません',
    'help.li6':
      '「全角に統一」「半角に統一」で一括変換。Ctrl+Z で元に戻せます',
    'help.close': '閉じる',

    'toast.fullWidth': '全角に統一しました',
    'toast.halfWidth': '半角に統一しました',
    'toast.copyEmpty': 'コピーするテキストがありません',
    'toast.copyOk': 'クリップボードにコピーしました',
    'toast.copyFail': 'コピーに失敗しました',
    'confirm.clear': '原稿をクリアしますか？',
  },
  en: {
    'meta.title': 'Character Width — Fullwidth / Halfwidth Checker',
    'meta.description':
      'Check character counts for Japanese application forms. Count characters, SJIS bytes, and display width — and visualize or convert fullwidth (全角) and halfwidth (半角) text. Processing stays in your browser; nothing is sent to a server.',

    'header.title': 'Character Width',
    'header.subtitle': 'Spot fullwidth vs halfwidth — a quirk of Japanese forms',
    'intro.summary':
      'Character Width is a free browser tool for Japanese application forms: count characters, SJIS bytes, and display width, and visualize or convert fullwidth and halfwidth text. Useful before submitting student or event forms — your input stays in the browser and is never sent to a server.',
    'header.helpAria': 'How to use',
    'header.langAria': 'Language',
    'header.langJa': '日本語',
    'header.langEn': 'EN',

    'editor.sectionAria': 'Text input',
    'editor.statsAria': 'Character statistics',
    'editor.statChars': 'Characters',
    'editor.statSjis': 'SJIS bytes',
    'editor.statWidth': 'Display width',
    'editor.statsDetail':
      'Fullwidth {fullwidth} · Halfwidth {halfwidth} · Newlines {newlines} · Spaces {spaces}',
    'editor.emptyHint':
      'In Japanese apps, 「全角」(fullwidth) and「半角」(halfwidth) often matter for character limits. Color highlights show which is which; wrapping is visual only — copied text has no added line breaks.',
    'editor.label': 'Draft',
    'editor.placeholder': 'Type or paste your text here…',
    'editor.legendAria': 'Legend',
    'editor.legendFw': 'Fullwidth',
    'editor.legendHw': 'Halfwidth',
    'editor.legendWarn': 'Problem chars',

    'limit.sectionAria': 'Character limit',
    'limit.label': 'Limit',
    'limit.presetsAria': 'Limit presets',
    'limit.none': 'None',
    'limit.inputAria': 'Character limit',
    'limit.excludeWs': 'Exclude spaces & newlines',
    'limit.modeLabel': 'Measure by',
    'limit.modeAria': 'Limit counting method',
    'limit.modeChars': 'Characters',
    'limit.modeSjis': 'SJIS bytes',
    'limit.modeWidth': 'Display width',

    'progress.over': '{current} / {limit} ({over} over)',
    'progress.ok': '{current} / {limit}',
    'progress.ariaOver': '{mode} {current}, limit {limit}, {over} over',
    'progress.ariaOk': '{mode} {current}, limit {limit}, {remaining} left',

    'problem.title': 'Problem characters (click to jump)',
    'problem.space': '(space)',
    'problem.hint': '(may not work in forms)',

    'actions.sectionAria': 'Actions',
    'actions.fullWidth': 'Make fullwidth',
    'actions.halfWidth': 'Make halfwidth',
    'actions.copy': 'Copy',
    'actions.clear': 'Clear',

    'footer.privacy':
      'Your text stays in this browser and is not sent to a server. Settings and drafts are saved in localStorage on this device.',

    'help.title': 'How to use',
    'help.intro':
      'Japanese forms may require fullwidth-only (全角) or halfwidth-only (半角) text. This tool visualizes and converts them.',
    'help.li1Term': 'Characters',
    'help.li1Desc': '— count 1 per character',
    'help.li2Term': 'SJIS bytes',
    'help.li2Desc':
      '— Shift_JIS byte length (often 2 for fullwidth, 1 for halfwidth)',
    'help.li3Term': 'Display width',
    'help.li3Desc': '— fullwidth = 2, halfwidth = 1',
    'help.li4':
      'Highlights show fullwidth, halfwidth, and problem characters (emoji, etc.)',
    'help.li5':
      'Line wrapping follows Japanese rules for on-screen display only. Copied text has no added line breaks',
    'help.li6':
      'Use “Make fullwidth” / “Make halfwidth” to convert in bulk. Ctrl+Z undoes',
    'help.close': 'Close',

    'toast.fullWidth': 'Converted to fullwidth',
    'toast.halfWidth': 'Converted to halfwidth',
    'toast.copyEmpty': 'Nothing to copy',
    'toast.copyOk': 'Copied to clipboard',
    'toast.copyFail': 'Copy failed',
    'confirm.clear': 'Clear the draft?',
  },
};

/** @type {Locale} */
let currentLocale = 'ja';

/**
 * @param {string} key
 * @param {Record<string, string | number>} [vars]
 * @returns {string}
 */
export function t(key, vars) {
  const dict = DICTS[currentLocale] ?? DICTS.ja;
  let text = dict[key] ?? DICTS.ja[key] ?? key;
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}

/** @returns {Locale} */
export function getLocale() {
  return currentLocale;
}

/**
 * @returns {Locale}
 */
export function detectInitialLocale() {
  try {
    const raw = localStorage.getItem('char-width-checker-settings');
    if (raw) {
      const settings = JSON.parse(raw);
      if (settings.lang === 'ja' || settings.lang === 'en') {
        return settings.lang;
      }
    }
  } catch {
    /* ignore */
  }
  const nav = (navigator.language || '').toLowerCase();
  return nav.startsWith('en') ? 'en' : 'ja';
}

/**
 * @param {Locale} lang
 */
export function applyLocale(lang) {
  currentLocale = lang === 'en' ? 'en' : 'ja';

  document.documentElement.lang = currentLocale;
  document.title = t('meta.title');

  const description = t('meta.description');
  const title = t('meta.title');

  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', description);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title);
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', description);
  const ogLocale = document.querySelector('meta[property="og:locale"]');
  if (ogLocale) ogLocale.setAttribute('content', currentLocale === 'en' ? 'en_US' : 'ja_JP');

  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute('content', title);
  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.setAttribute('content', description);

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    el.textContent = t(key);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (!key || !('placeholder' in el)) return;
    /** @type {HTMLInputElement | HTMLTextAreaElement} */ (el).placeholder = t(key);
  });

  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria');
    if (!key) return;
    el.setAttribute('aria-label', t(key));
  });

  syncLangSwitch(currentLocale);
}

/**
 * @param {Locale} lang
 */
function syncLangSwitch(lang) {
  const group = document.getElementById('langSwitch');
  if (!group) return;
  group.setAttribute('aria-label', t('header.langAria'));
  group.querySelectorAll('[data-lang]').forEach((btn) => {
    const isActive = btn.getAttribute('data-lang') === lang;
    btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
    btn.classList.toggle('lang-switch__btn--active', isActive);
    btn.tabIndex = isActive ? 0 : -1;
  });
}

/**
 * Wire radiogroup keyboard + click handlers.
 * @param {(lang: Locale) => void} onChange
 */
export function bindLangSwitch(onChange) {
  const group = document.getElementById('langSwitch');
  if (!group) return;

  const buttons = /** @type {HTMLButtonElement[]} */ (
    Array.from(group.querySelectorAll('[data-lang]'))
  );

  group.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const btn = target.closest('[data-lang]');
    if (!(btn instanceof HTMLButtonElement)) return;
    const lang = /** @type {Locale} */ (btn.dataset.lang);
    if (lang !== 'ja' && lang !== 'en') return;
    onChange(lang);
  });

  group.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const activeIdx = buttons.findIndex(
      (b) => b.getAttribute('aria-checked') === 'true',
    );
    if (activeIdx < 0) return;
    const next =
      e.key === 'ArrowRight'
        ? (activeIdx + 1) % buttons.length
        : (activeIdx - 1 + buttons.length) % buttons.length;
    const lang = /** @type {Locale} */ (buttons[next].dataset.lang);
    if (lang !== 'ja' && lang !== 'en') return;
    onChange(lang);
    buttons[next].focus();
  });
}

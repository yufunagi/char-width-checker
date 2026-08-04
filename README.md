# 字数チェック — 全角・半角文字チェッカー

応募フォーム（ES・イベント等）向けの字数チェックツールです。文字数・Shift_JIS バイト数・表示幅をリアルタイムでカウントし、全角・半角を色分け表示、一括変換できます。

## 機能

- **3 方式のカウント** — 文字数 / SJIS バイト / 表示幅（全角2・半角1）
- **全角・半角の可視化** — 原稿エリア内で色分けハイライト
- **一括変換** — 全角に統一 / 半角に統一
- **問題文字の検出** — SJIS 非対応文字・絵文字を警告
- **文字数上限** — プリセット（200/400/800/1000）とプログレスバー
- **空白・改行除外カウント** — トグルで切替
- **設定の保存** — localStorage に上限・原稿・表示言語を保持
- **日英切替** — ヘッダーの言語セグメントで日本語 / English を切替（英語 UI では全角・半角の概念も説明）

## 使い方

1. ブラウザで `index.html` を開く、または GitHub Pages の URL にアクセス
2. 原稿エリアに文章を入力または貼り付け
3. 上部の統計で文字数を確認
4. 必要に応じて「全角に統一」「半角に統一」を使用
5. 「コピー」で変換後のテキストをクリップボードへ

## プライバシー

- 原稿テキストはブラウザ内でのみ処理され、アプリのサーバーには送信されません
- 上限・原稿・表示言語は端末の **localStorage** に保存されます（共有 PC ではクリアにご注意ください）
- 表示用に **Google Fonts** と **jsDelivr**（encoding-japanese）へ接続します（原稿本文は送りません）

## ローカル開発

静的サイトのため、ビルド不要です。ローカルサーバーで開いてください（ES Modules 利用のため `file://` では動作しない場合があります）。`package.json` は不要です。

```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve .
```

ブラウザで http://localhost:8080 を開きます。

## GitHub Pages への公開

1. このリポジトリを GitHub に push
2. リポジトリの **Settings → Pages → Build and deployment → Source** で **GitHub Actions** を選択
3. `main` ブランチへ push すると `.github/workflows/deploy.yml` が自動デプロイ（`index.html` / `css/` / `js/` / `assets/` に加え `robots.txt`・`sitemap.xml`・`llms.txt` も公開）

本番 URL: https://yufunagi.github.io/char-width-checker/

## 技術構成

- HTML / CSS / Vanilla JavaScript（ES Modules）
- [encoding-japanese](https://github.com/polygonplanet/encoding.js) — Shift_JIS バイト計算（CDN + SRI）
- Google Fonts — Shippori Mincho, IBM Plex Sans JP

## ライセンス

MIT

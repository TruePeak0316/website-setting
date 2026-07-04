# 誠峰會計師事務所 Next.js 重構版

此專案已由原本的靜態 HTML/CSS/JavaScript 網站重構為 Next.js、React、TypeScript 與 Tailwind CSS 架構。頁面仍維持多頁式架構，每個主要頁面與 Library 文章頁皆有對應的 `.tsx` route。

## 技術棧

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Phosphor Icons
- Cheerio（僅於 SSG 階段解析既有 Library HTML 文章內容）

## 開發指令

WSL 內建 Node 版本偏舊，本次開發使用暫存在 `~/.cache/codex-node/node-v24.15.0-linux-x64` 的 Node runtime。執行指令前請先設定 PATH：

```bash
export PATH=/home/hsuan/.cache/codex-node/node-v24.15.0-linux-x64/bin:$PATH
```

常用指令：

```bash
npm install
npm run dev
npm run lint
npm run build
```

## 路由對應

- `/`：原 `index.html`
- `/about`：原 `about.html`
- `/services`：原 `services.html`
- `/contact`：原 `contact.html`
- `/testimonials`：原 `testimonials.html`
- `/truepeakinsights`：原 `truepeakinsights.html`
- `/caculators`：原 `caculators.html`
- `/Library/001` 至 `/Library/014`：原 `Library/001.html` 至 `Library/014.html`

舊 `.html` URL 已在 `next.config.ts` 設定 redirect 至新的 route。

## 專案結構

- `pages/`：Next Pages Router 多頁路由
- `components/`：共用版面、文章、服務、聯絡與計算器元件
- `lib/`：站點設定、內容資料、文章解析與 SSG helper
- `styles/globals.css`：Tailwind v4 theme token 與全域樣式
- `public/`：Next 靜態資源，包含原 `images/`、`Library/` 圖片、`CNAME`、`robots.txt`、`sitemap.xml`

## 文章資料

`truepeakinsights` 列表資料集中於 `lib/content.ts` 的 `ARTICLE_INDEX`。文章詳情頁於 build time 透過 `lib/articles.ts` 讀取原 `Library/*.html`，解析標題、作者、圖片、影片與正文，並以新的 React 文章模板輸出 SSG 靜態頁。

## 驗證

已通過：

```bash
npm run lint
npm run build
```

瀏覽器截圖與 console 驗證請參考 `PROJECT_STATUS.md`。

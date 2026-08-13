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

本機與 WSL 開發環境目前全域使用 Node.js `v22.23.2`；GitHub Actions
workflow 使用 Node.js 24。兩者都符合目前 Next.js 16 的 runtime 需求。

常用指令：

```bash
npm install
npm run dev
npm run lint
npm run build
```

## GitHub Pages 部署

目前正式網站部署在 GitHub Pages。Next.js 原始碼不可直接作為 Pages 發布內容，必須先產生靜態輸出，再部署 `out/` 資料夾。

### 1. 確認 Next.js 使用靜態輸出

GitHub Pages 只能服務靜態檔案。`next.config.ts` 已啟用 static export 與 trailing slash，讓 `npm run build` 產生可直接服務的 `out/`：

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

舊 `.html` URL 的相容性由 `scripts/add-legacy-redirects.mjs` 在 build 後產生靜態 HTML redirect 檔，不能依賴 GitHub Pages 不支援的 Next.js server-side `redirects()`。

### 2. 本機產生部署檔

```bash
npm install
npm run lint
npm run build
touch out/.nojekyll
```

建置成功後，部署內容會在 `out/`。`npm run build` 會另外產生舊 `.html` URL 的靜態 redirect 檔；`public/CNAME`、`robots.txt`、`sitemap.xml`、圖片與 Library 靜態資源會一起複製到 `out/`；`.nojekyll` 用來避免 GitHub Pages 對 `_next/` 這類底線目錄套用 Jekyll 處理。

### 3. 部署方式

專案已提供 `.github/workflows/deploy-pages.yml`，在 `main` 有 push 時使用 GitHub Actions 部署 `out/` artifact。Repository 的 GitHub Pages 設定需選擇 GitHub Actions 作為來源：

```yaml
name: Deploy GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:
    inputs:
      deployment_id:
        required: true
        type: string
      release_id:
        required: true
        type: string
      site_key:
        required: true
        type: string
      attempt_number:
        required: true
        type: string
      content_api_url:
        required: true
        type: string

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: touch out/.nojekyll
      - uses: actions/upload-pages-artifact@v5
        with:
          path: out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

### 4. CMS publish trigger

CMS 以 `workflow_dispatch` 傳入 `deployment_id`、`release_id`、
`site_key`、`attempt_number` 與 HTTPS `content_api_url`。Repository
Actions secrets 必須提供：

- `CMS_BUILD_TOKEN`：讀取 immutable `PublishedContentV1` snapshot。
- `CMS_DEPLOYMENT_STATUS_TOKEN`：回報 `in_progress` 與
  `succeeded`／`failed`／`cancelled`。

Workflow 會驗證 inputs／secrets、取得並核對 snapshot
`schemaVersion: "1.0"` 與 `releaseId`、執行 lint/build、部署 Pages，
最後以 run ID、workflow URL、commit SHA 與終態 callback 回報 CMS。
`github-pages` environment 目前只允許 `main`，因此 production CMS
dispatcher 的 `GITHUB_PUBLISH_REF` 必須設為 `main`。

目前 workflow 已取得並驗證 snapshot，但網站 source 尚未將 snapshot 轉成
頁面內容；消費 published content 仍是後續獨立整合工作。

若不使用 GitHub Actions，也可以手動把 `out/` 的內容推到目前 GitHub Pages 指定的發布分支或資料夾。重點是遠端 Pages 來源必須收到 `out/` 內的靜態檔，而不是 Next.js 專案原始碼本身。

## 路由對應

- `/`：原 `index.html`
- `/about`：原 `about.html`
- `/services`：原 `services.html`
- `/contact`：原 `contact.html`
- `/testimonials`：原 `testimonials.html`
- `/truepeakinsights`：原 `truepeakinsights.html`
- `/caculators`：原 `caculators.html`
- `/Library/001` 至 `/Library/014`：原 `Library/001.html` 至 `Library/014.html`

舊 `.html` URL 由 build 後產生的靜態 HTML redirect 檔導向新的 route。

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

- CMS real-target acceptance：預期的 token failure callback、retry、snapshot
  驗證、完整 static build、main Pages deployment 與 succeeded callback 均通過。
- GitHub Actions run `31313846310` 成功部署 commit
  `e3679ef270e7c19e0a461fa1e02e8aa606edea58`；deployment
  `5818769587` 的 environment URL 為
  `https://www.tpcpa.com.tw/`，即時 HTTPS 驗證回應 `200`。
- 驗收使用的 TryCloudflare tunnel、allowlist gateway、temporary SQLite、
  API process 與兩個 temporary Actions secrets 均已清除。

瀏覽器截圖與 console 驗證請參考 `PROJECT_STATUS.md`。

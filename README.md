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
npm test
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

建置成功後，部署內容會在 `out/`。`npm run build` 會另外產生舊 `.html`
URL 的靜態 redirect 檔；legacy mode 直接複製 `public/robots.txt` 與
`public/sitemap.xml`，CMS mode 則依 snapshot SEO／Blog 覆寫兩個 artifacts。
`public/CNAME`、圖片與 Library 靜態資源也會一起複製到 `out/`；`.nojekyll`
用來避免 GitHub Pages 對 `_next/` 這類底線目錄套用 Jekyll 處理。

### 3. CMS 發布與部署

網站使用 [deploy-pages.yml](.github/workflows/deploy-pages.yml)。一般 main push
只執行建置，不部署；CMS 的 workflow dispatch 帶入 deployment、release、site、
attempt、完整內容 commit 與發布模式。workflow 從指定 commit 讀取快照與受管理
圖片，不連線本機 CMS，也不需要 CMS callback secrets。快照、站台、模式或圖片不符
時會失敗，不回退到其他內容。
快照的圖片必須使用網站公開網址的 origin，且檔案必須存在該 commit 的 `public/`；
不接受可變的第三方圖片網址。請讓 CMS Media 公開網址與網站公開網址一致。

`dev / preview` 只建置；`main / production` 才部署 Pages。正式部署前再次
核對 main 上的快照與發布序號，拒絕已被較新版本取代的部署。GitHub Actions
可能取消同一 concurrency group 中尚未開始的工作；CMS 需同步顯示其結果。
同一網站應共用同一 CMS 發布序號；獨立資料庫產生相同序號時會被拒絕，需先協調。

CMS 與網站 PR 必須協調上線：先部署新版 workflow，待既有部署完成，再升級 CMS。
workflow 暫時保留舊版 callback 流程；新版快照進入 main 後會拒絕舊版正式部署，
避免較舊內容覆蓋新版。先在隔離環境驗證兩者；回退程式時保留快照、媒體及 Pages，
不自動重新派送。回退到舊版 CMS 前需要重新確認網站 workflow 相容性。

目前 workflow 不建立獨立的 `cms-recovery-production` 來源證明；不能僅憑
Actions 成功啟用自動資料恢復，需另行完成並驗證正式 recovery provenance。

## 路由對應

- `/`：原 `index.html`
- `/about`：原 `about.html`
- `/services`：原 `services.html`
- `/contact`：原 `contact.html`
- `/testimonials`：原 `testimonials.html`
- `/truepeakinsights`：原 `truepeakinsights.html`
- `/caculators`：原 `caculators.html`
- `/Library/[slug]`：CMS mode 依 snapshot Blog slugs 產生；legacy mode 產生
  `/Library/001` 至 `/Library/014`

舊 `.html` URL 由 build 後產生的靜態 HTML redirect 檔導向新的 route；CMS
mode 的 Library redirects 依 snapshot slugs 產生。

## 專案結構

- `pages/`：Next Pages Router 多頁路由
- `components/`：共用版面、CMS pages、文章、服務、聯絡與計算器元件
- `lib/cms/`：V1 types/schema、build-only loader、site context 與 whole-page fallback
- `lib/`：legacy 站點設定、內容資料、文章解析與 SSG helper
- `tests/`：V1 fixture 與 consumer contract tests
- `scripts/cms-artifacts.mjs`：依 snapshot 產生 robots/sitemap
- `styles/globals.css`：Tailwind v4 theme token 與全域樣式
- `public/`：Next 靜態資源，包含原 `images/`、`Library/` 圖片、`CNAME`、`robots.txt`、`sitemap.xml`

## 文章資料

CMS mode 的 `truepeakinsights` 列表與 `/Library/[slug]` 詳情均來自 snapshot
`blog.articles`／`blog.details`，並依發布順序產生 previous/next links。Legacy
mode 才使用 `lib/content.ts` 的 `ARTICLE_INDEX`，並由 `lib/articles.ts` 在 build
time 解析原 `Library/*.html`。

## 驗證

已通過：

```bash
npm test
npm run lint
npm run build
```

- Stage 5 consumer tests：38/38 通過，涵蓋 required/legacy modes、invalid JSON、
  schema/release mismatch、semantic validation、精確 emptyPages whole-page
  fallback、Settings/footer、Navigation icons、CMS default/page SEO precedence、
  Blog order、`noIndex` sitemap exclusion 與安全 HTTP(S) URL boundary。
- Required fixture build：13 pages，包含任意 CMS slug
  `/Library/cms-fixture-article`，且 snapshot canary 可在 output 找到；
  `javascript:`／`data:`／`ftp:`／userinfo URL fixtures 均 fail closed。
- Null-image/`noIndex` build 與精確 `emptyPages()` hybrid build 均通過。
- Legacy build：26 pages，保留既有 routes/content。
- Artifact/security scan：static output 與 client chunks 沒有 CMS endpoint、
  `CMS_BUILD_TOKEN` 或 token canary；`git diff --check` 通過，`npm audit` 為 0
  vulnerabilities。

- 2026-08-09 的 CMS real-target acceptance 已驗證 token failure callback、retry、
  snapshot fetch、static build、main Pages deployment 與 succeeded callback，但
  當時網站尚未消費 snapshot；它不是目前 Stage 5 consumer 的 production
  acceptance。
- GitHub Actions run `31313846310` 成功部署 commit
  `e3679ef270e7c19e0a461fa1e02e8aa606edea58`；deployment
  `5818769587` 的 environment URL 為
  `https://www.tpcpa.com.tw/`，即時 HTTPS 驗證回應 `200`。
- 驗收使用的 TryCloudflare tunnel、allowlist gateway、temporary SQLite、
  API process 與兩個 temporary Actions secrets 均已清除。
- Stage 5 consumer 仍待 promotion 到 `main`，以及正式 credentialed publish、
  Pages callback 與 production URL/content 驗證。

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

### 3. 部署方式

專案已提供 `.github/workflows/deploy-pages.yml`。`main` push 只執行
lint／static build，不部署 Pages；只有 CMS `workflow_dispatch` 會取得指定
release snapshot、建置並部署 `out/` artifact，避免一般 push 以 legacy output
覆蓋已發布的 CMS release。Repository 的 GitHub Pages 設定需選擇 GitHub
Actions 作為來源：

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
    if: github.event_name == 'workflow_dispatch'
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
`site_key`、`attempt_number` 與 HTTPS `content_api_url`。其中
`content_api_url` 是 public API v1 base；workflow 分別附加
`/build/content` 與 `/deployments/:id/status`。Repository
Actions secrets 必須提供：

- `CMS_BUILD_TOKEN`：讀取 immutable `PublishedContentV1` snapshot。
- `CMS_DEPLOYMENT_STATUS_TOKEN`：回報 `in_progress` 與
  `succeeded`／`failed`／`cancelled`。

Workflow 會驗證 inputs／secrets、取得並核對 snapshot
`schemaVersion: "1.0"` 與 `releaseId`、執行 lint/build、部署 Pages，
最後以 run ID、workflow URL、commit SHA 與終態 callback 回報 CMS。
`github-pages` environment 目前只允許 `main`，因此 production CMS
dispatcher 的 `GITHUB_PUBLISH_REF` 必須設為 `main`。

Stage 5 網站 source 會在 static build 中消費 snapshot。Workflow 將已驗證的
檔案路徑（而非 token）傳給 Next build，並設定
`CMS_CONTENT_REQUIRED=1` 與 `CMS_EXPECTED_RELEASE_ID`；缺檔、格式錯誤、
schema 不相容、release 不符、未知 visible navigation route、Blog summary/detail
slug 不一致或必要內容 malformed 都會讓 build 失敗。

未提供 `CMS_PUBLISHED_CONTENT_PATH` 的本機開發／build 仍使用 repository 內的
既有內容。CMS snapshot 一旦存在，Settings（含 header/footer branding、contact、
footer copyright）、visible/sorted Navigation（含 icons）、Blog 與 CMS
default/page SEO 即為 authoritative；footer services 在 CMS services page 非空時
來自 snapshot，精確空值時整頁沿用 legacy services。Page SEO override 優先於
CMS default，CMS default 優先於頁面內建 metadata；標記 `noIndex` 的 Blog
不會寫入 sitemap。CMS 外部 action/media/SEO/Settings URL 僅接受不含 userinfo
的安全 HTTP(S) 值，`javascript:`、`data:`、`ftp:`、控制字元與含帳密 URL 會讓
required build fail closed。CMS 目前固定輸出的精確 `emptyPages()` 會讓該 managed page
整頁回退到既有內容，非空 page 則整頁使用 snapshot，避免局部混搭。
`mapEmbedUrl`、團隊詳情、計算器、服務時間、LINE QR 與環境照片不在 V1
contract 內，繼續由本 repository 管理。公開頁面不會在 browser runtime 呼叫
CMS；`CMS_BUILD_TOKEN` 只存在 workflow fetch step，也不會傳給 Next build 或
寫入 static artifact。

Build-only 環境變數：

| 變數 | 用途 |
| --- | --- |
| `CMS_PUBLISHED_CONTENT_PATH` | 已下載的 `PublishedContentV1` JSON 檔案路徑；不是 API URL。 |
| `CMS_CONTENT_REQUIRED=1` | CMS workflow 的 fail-closed mode；缺少 path 時立即失敗。 |
| `CMS_EXPECTED_RELEASE_ID` | 驗證 snapshot `releaseId` 與 dispatch release 一致。 |

CMS fixture build 可用：

```bash
CMS_CONTENT_REQUIRED=1 \
CMS_PUBLISHED_CONTENT_PATH="$PWD/tests/fixtures/published-content-v1.json" \
CMS_EXPECTED_RELEASE_ID="11111111-1111-4111-8111-111111111111" \
npm run build
```

若不使用 GitHub Actions，也可以手動把 `out/` 的內容推到目前 GitHub Pages 指定的發布分支或資料夾。重點是遠端 Pages 來源必須收到 `out/` 內的靜態檔，而不是 Next.js 專案原始碼本身。

目前 consumer implementation 與 local validation 位於 `dev`；尚未 promotion
到 production `main`，也尚未以正式 credentials 重跑 CMS publish → Pages →
callback → production URL/content 驗收。

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

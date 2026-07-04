# PROJECT_STATUS

## 目前狀態

- 已建立 Next.js、React、TypeScript、Tailwind CSS v4 架構。
- 已保留原多頁資訊架構，並轉換 7 個根頁面與 14 個 Library 文章頁。
- 已將共用導覽列、頁腳、Hero、文章卡、服務 Tabs、聯絡 LINE 複製、發票計算器、租金扣繳計算器元件化。
- 首頁已依 `card-ref/` 將核心服務改為橫向滑動卡片，並保留清楚的服務詳情互動。
- `/truepeakinsights` 誠峰觀點頁已依 `card-ref/` 將文章列表改為橫向滑動卡片，並保留搜尋與分類篩選。
- `/truepeakinsights` 所有文章分類篩選狀態皆使用與首頁核心服務相同方向、相同速度的滑動卡片動畫。
- 首頁 Hero 標題已依 `title-ref/` 加入品牌棕系漸變動效，仍維持左側排版。
- 導覽列左側品牌區已改為直接顯示橫式 `LOGO.PNG`，不再額外顯示文字版名稱或正方形外框。
- `favicon.ico` 已放置於 `public/favicon.ico`，由 `/favicon.ico` 提供瀏覽器圖示。
- 已將原 `images/` 與 `Library/` 圖片複製至 `public/`，供 Next 靜態資源與 `next/image` 使用。
- 已用 SSG 方式解析既有 `Library/*.html` 文章內容並套用新的文章模板。
- 已建立舊 `.html` route redirect 至新 route。

## 路由範圍

- `/`
- `/about`
- `/services`
- `/contact`
- `/testimonials`
- `/truepeakinsights`
- `/caculators`
- `/Library/001` 到 `/Library/014`

## 已完成驗證

- `npm run lint`：通過。
- `npm run build`：通過，23 個頁面完成 static/SSG 產出。
- `npm audit --omit=dev`：通過，0 個 vulnerabilities。
- 瀏覽器桌面版逐頁截圖：通過，21 個頁面皆無 console error、破圖或水平溢出。
- 瀏覽器手機版抽查：通過，首頁、服務、計算器與文章詳情頁皆無 console error 或水平溢出。
- 首頁服務滑動卡與 `/truepeakinsights` 文章滑動卡已完成桌面與手機版瀏覽器驗證，無 console error、破圖或水平溢出。
- `/truepeakinsights` 四個分類篩選狀態已驗證皆與首頁核心服務使用相同滑動方向、速度與 timing function；`/favicon.ico` 回應正常。
- 截圖存放位置：`C:\Users\User\AppData\Local\Temp\website-setting-screenshots\`。

## 目前無已知待處理項目

- 若未來更新 `ref/` 設計稿，需重新比對視覺與互動細節。
- 若新增舊 HTML 頁面，需同步新增對應的 Next `.tsx` 頁面。

## 注意事項

- WSL 預設 Node 為 v12，無法支援 Next.js 16。本次使用 `~/.cache/codex-node/node-v24.15.0-linux-x64`。
- `ref/`、`ref2/`、`card-ref/`、`title-ref/` 皆視為參考資料或既有未追蹤資料，不納入 TypeScript 編譯。
- 已使用 npm override 固定 `postcss@8.5.16`，消除 Next 依賴鏈中的 audit 警示。

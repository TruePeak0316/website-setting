# PROJECT_STATUS

## 目前狀態

- 已建立 Next.js、React、TypeScript、Tailwind CSS v4 架構。
- 已保留原多頁資訊架構，並轉換 7 個根頁面與 14 個 Library 文章頁。
- 已將共用導覽列、頁腳、Hero、文章卡、服務 Tabs、聯絡 LINE 複製、發票計算器、租金扣繳計算器元件化。
- 首頁已依 `card-ref/` 將核心服務改為橫向滑動卡片，並保留清楚的服務詳情互動。
- `/truepeakinsights` 誠峰觀點頁已依 `card-ref/` 將文章列表改為橫向滑動卡片，並保留搜尋與分類篩選。
- `/truepeakinsights` 所有文章分類篩選狀態皆使用與首頁核心服務相同方向、相同速度的滑動卡片動畫。
- 首頁 Hero 標題已依 `title-ref/` 加入品牌棕系漸變動效，並補上較明顯的幾何背景、循環逐字描述動畫與 CTA 微互動，仍維持左側排版。
- `/about` 關於我們頁已拆分為品牌承諾、歷史沿革與專業團隊等 section，並加入滾動進入時的漸淡位移效果。
- 導覽列左側品牌區已改為直接顯示橫式 `LOGO.PNG`，不再額外顯示文字版名稱或正方形外框。
- 手機版導覽列主選單按鈕已改為圓形，並補上 hover、active 與 focus-visible 狀態。
- `/truepeakinsights` 文章分類篩選已改為連貫式 segmented control，選取狀態會以品牌棕色背景滑動切換，並保留 hover 狀態。
- `/caculators` 發票營業稅金額試算已保留手開發票示意，三聯式與二聯式皆會依目前輸入即時更新預覽內容。
- `/services` 手機版已改為預設全收合的垂直 accordion，點選服務後以滑動動畫就地展開內容，再次點選同一項可收合；桌面版維持 tab/detail，並補上 tab hover/active、內容切換淡入位移、圖片 hover 微動與細節卡陰影回饋。
- `/contact` 辦公環境照片已改為橫向自動滑動照片帶，使用與文章滑動相近的節奏並支援 hover/focus 暫停。
- `/contact` PC 版地圖 iframe 高度已調整為較自然比例，避免地圖下方出現明顯留白。
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
- 手機版主選單圓形按鈕與 `/truepeakinsights` 分類滑動切換已通過 TypeScript 檢查，並以 578px 與 360px viewport 驗證無 console error 或水平溢出。
- `/caculators` 手開發票示意已通過 TypeScript 檢查，並以桌面與手機 viewport 驗證三聯式、二聯式顯示正常，無 console error 或頁面水平溢出。
- `/services` 手機版預設全收合 accordion、首頁 Hero 動態背景與循環逐字描述、CTA 微互動，以及 `/contact` 辦公環境照片滑動帶已通過 TypeScript 檢查，並以 534px 與 360px viewport 驗證無 console error 或水平溢出；`/services` 桌面 tab/detail 亦完成抽查。
- `/about` section 漸淡位移、`/contact` PC 地圖比例與 `/services` PC 互動動效已通過 TypeScript 檢查，並完成桌面瀏覽器抽查。
- 截圖存放位置：`C:\Users\User\AppData\Local\Temp\website-setting-screenshots\`。

## 目前無已知待處理項目

- 若未來更新 `ref/` 設計稿，需重新比對視覺與互動細節。
- 若新增舊 HTML 頁面，需同步新增對應的 Next `.tsx` 頁面。

## 注意事項

- WSL 預設 Node 為 v12，無法支援 Next.js 16。本次使用 `~/.cache/codex-node/node-v24.15.0-linux-x64`。
- `ref/`、`ref2/`、`card-ref/`、`title-ref/` 皆視為參考資料或既有未追蹤資料，不納入 TypeScript 編譯。
- 已使用 npm override 固定 `postcss@8.5.16`，消除 Next 依賴鏈中的 audit 警示。

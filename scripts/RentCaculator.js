
// === 檔頭：防重複執行（避免同頁載入兩次造成常數重複宣告中斷） ===
if (window.__TruePeakRentCalcInitialized__) {
  console.warn('RentCaculator.js 已載入過，跳過第二次初始化。');
} else {
  window.__TruePeakRentCalcInitialized__ = true;
  (function () {
    // app.js
    // 租金扣繳／二代健保／發票 5% 試算邏輯

    // ===== 常數（可視需要更新） =====
    const NHI_RATE = 0.0211; // 二代健保補充保費率
    const VAT_RATE = 0.05;   // 發票營業稅率（公司房東）
    const WH_RESIDENT = 0.10;      // 本國居民（自然人）扣繳率
    const WH_NONRESIDENT = 0.20;   // 非居民（自然人）扣繳率
    const WH_EXEMPT_TAX = 2000;    // 單次應扣稅額 ≤ 2000 免扣繳
    const NHI_THRESHOLD = 20000;   // 單次給付達 20,000（含）適用二代健保

    // ===== 工具函式／容錯 =====
    const getEl = (id) => {
      const el = document.getElementById(id);
      if (!el) console.warn(`[RentCaculator] 找不到元素 #${id}，請確認 HTML 是否存在該 ID。`);
      return el;
    };

    function fmt(n) {
      if (n === null || n === undefined || isNaN(n)) return '—';
      return new Intl.NumberFormat('zh-Hant-TW').format(Math.round(n));
    }

    // 解析金額：移除逗點、空白（含全形），保留數字與小數點
    function parseAmt(input) {
      const s = String(input ?? '')
        .replace(/[,\u3000\s]/g, '') // 逗點、全形空白、一般空白
        .trim();
      const n = Number(s);
      return Number.isFinite(n) ? n : NaN;
    }

    // 模式覆寫（從網址來的初始模式，先用這個算；使用者手動切換後清空）
    window.__RentCalcModeOverride = null;

    // 模式讀取（優先使用覆寫；否則讀 radio）
    function currentMode() {
      if (window.__RentCalcModeOverride) return window.__RentCalcModeOverride; // 'tax-included' | 'tax-excluded'
      const modeGroup = getEl('modeGroup');
      if (!modeGroup) return 'tax-included';
      const checked = [...modeGroup.querySelectorAll('input[name="mode"]')].find(i => i.checked);
      return checked ? checked.value : 'tax-included';
    }

    // 模式別名轉換（net/gross ↔ tax-excluded/tax-included）
    function normalizeMode(m) {
      if (!m) return null;
      const v = String(m).toLowerCase();
      if (v === 'net' || v === 'tax_excluded') return 'tax-excluded';
      if (v === 'gross' || v === 'tax_included') return 'tax-included';
      if (v === 'tax-excluded' || v === 'tax-included') return v;
      return null;
    }
    function aliasMode(m) {
      const v = normalizeMode(m);
      return (v === 'tax-excluded') ? 'net' : 'gross';
    }

    // ===== 產生可分享的網址（Query 帶模式；Hash 只帶錨點） =====
    function buildShareUrl() {
      const landlordType = getEl('landlordType');
      const tenantType = getEl('tenantType');
      const residentStatus = getEl('residentStatus');
      const amountInput = getEl('amount');
      const params = new URLSearchParams();
      const lt = landlordType ? landlordType.value : '';
      const tt = tenantType ? tenantType.value : '';
      const rs = residentStatus ? residentStatus.value : '';
      const amt = amountInput ? amountInput.value : '';
      const mode = currentMode(); // 'tax-included' | 'tax-excluded'
      if (lt) params.set('lt', lt);
      if (tt) params.set('tt', tt);
      if (lt === 'person' && rs) params.set('rs', rs);
      if (amt) params.set('amt', amt);
      // Query 的 mode 使用 net/gross（既有連結習慣）
      params.set('mode', aliasMode(mode));
      const url = new URL(window.location.href);
      url.search = params.toString();
      // Hash 只放錨點（不要加 ?mode=），才會正確捲到區塊
      url.hash = '#rent-caculator';
      return url.toString();
    }

    // ===== 複製網址（含備援） =====
    async function copyShareUrl() {
      const url = buildShareUrl();
      try {
        await navigator.clipboard.writeText(url);
        alert('已複製網址：\n' + url);
      } catch (err) {
        window.prompt('複製以下網址', url);
      }
    }

    // ===== 從 Query 讀取模式，設為覆寫（預設含稅） =====
    function initModeOverrideFromUrl() {
      const sp = new URLSearchParams(window.location.search);
      const parsed = normalizeMode(sp.get('mode'));
      window.__RentCalcModeOverride = parsed || 'tax-included';
      return window.__RentCalcModeOverride;
    }

    // 勾選 UI 的金額模式 radio（容忍 value 差異與中文標籤）
    function ensureModeRadioChecked(modeFinal) {
      const modeGroup = getEl('modeGroup');
      if (!modeGroup) return false;
      // 1) 直接用標準值找
      const selectors = [
        `input[name="mode"][value="${modeFinal}"]`,
        // 2) 別名：net / gross
        modeFinal === 'tax-excluded' ? `input[name="mode"][value="net"]` : `input[name="mode"][value="gross"]`,
        // 3) 下劃線版：tax_excluded / tax_included
        modeFinal === 'tax-excluded' ? `input[name="mode"][value="tax_excluded"]` : `input[name="mode"][value="tax_included"]`,
      ];
      let target = null;
      for (const sel of selectors) {
        const found = modeGroup.querySelector(sel);
        if (found) { target = found; break; }
      }
      // 4) 找不到就用中文標籤比對（未稅／含稅）
      if (!target) {
        const desiredText = modeFinal === 'tax-excluded' ? '未稅' : '含稅';
        const inputs = [...modeGroup.querySelectorAll('input[name="mode"]')];
        target = inputs.find(i => {
          const lbl = i.closest('label') || (i.id ? modeGroup.querySelector(`label[for="${i.id}"]`) : null);
          return lbl && (lbl.textContent || '').trim().includes(desiredText);
        });
      }
      if (target) {
        // 勾選並觸發 change（讓 UI 同步，也會清空覆寫）
        target.checked = true;
        target.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
      return false;
    }

    // ===== 主要變數（帶安全檢查） =====
    const landlordType   = getEl('landlordType');
    const tenantType     = getEl('tenantType');
    const residentBox    = getEl('residentBox');
    const residentStatus = getEl('residentStatus');
    const amountInput    = getEl('amount');
    const modeGroupEl    = getEl('modeGroup');

    const personResult   = getEl('personResult');
    const companyResult  = getEl('companyResult');

    const grossPerson        = getEl('grossPerson');
    const withholdPerson     = getEl('withholdingPerson');
    const nhiPerson          = getEl('nhiPerson');
    const sumPerson          = getEl('sumPerson');
    const netPerson          = getEl('netPerson');
    const whRateTag          = getEl('whRateTag');

    const sales              = getEl('sales');
    const vat                = getEl('vat');
    const total              = getEl('total');

    // ===== 主計算函式（所有 DOM 操作均檢查元素存在） =====
    function calc() {
      const rawAmt = amountInput ? amountInput.value : '';
      const amt = parseAmt(rawAmt); // ← 以 parseAmt 解析
      const hasValidAmount = Number.isFinite(amt) && amt > 0;
      const isPerson = landlordType && landlordType.value === 'person';
      const isTenantCompany = tenantType && tenantType.value === 'company';
      const resident = residentStatus && residentStatus.value === 'resident';

      if (residentBox) residentBox.style.display = isPerson ? 'block' : 'none';
      if (personResult && companyResult) {
        if (isPerson) {
          personResult.style.display = 'block';
          companyResult.style.display = 'none';
        } else {
          companyResult.style.display = 'block';
          personResult.style.display = 'none';
        }
      }

      if (isPerson) {
        const whRate = resident ? WH_RESIDENT : WH_NONRESIDENT;
        if (!hasValidAmount) {
          if (whRateTag) whRateTag.textContent = resident ? '10%' : '20%';
          if (grossPerson)        grossPerson.textContent = '—';
          if (withholdPerson)     withholdPerson.textContent = '—';
          if (nhiPerson)          nhiPerson.textContent = '—';
          if (sumPerson)          sumPerson.textContent = '—';
          if (netPerson)          netPerson.textContent = '—';
          return;
        }

        let gross;
        let whAmt = 0;
        let nhiAmt = 0;
        let net;

        // 修正重點：含稅模式也要判斷可否扣繳/健保
        if (currentMode() === 'tax-included') {
          gross = amt;
          const canWithhold = isTenantCompany;            // 只有房客為公司才可扣繳
          const canNHI = (isTenantCompany && resident);   // 只有房客為公司且房東為本國居民才算二代健保

          const rawWH = canWithhold ? (gross * whRate) : 0;
          const rawNHI = (canNHI && gross >= NHI_THRESHOLD) ? (gross * NHI_RATE) : 0;
          // 免扣條件只在「可扣繳 + 本國居民」時適用
          const appliedRawWH = (canWithhold && resident && rawWH <= WH_EXEMPT_TAX) ? 0 : rawWH;

          whAmt = Math.round(appliedRawWH);
          nhiAmt = Math.round(rawNHI);
          net = gross - whAmt - nhiAmt;
        } else {
          // 未稅模式保持原有迭代解（但也依 canWithhold/canNHI 判斷）
          const canWithhold = isTenantCompany;
          const canNHI = (isTenantCompany && resident);
          net = amt;
          let whExempt = false;

          if (!canWithhold) {
            whExempt = true; // 完全不可扣繳
          } else if (resident) {
            // 先猜 gross 以判斷免扣
            const grossGuess = net / (1 - whRate - (canNHI ? NHI_RATE : 0));
            const whGuessRaw = grossGuess * whRate;
            whExempt = (whGuessRaw <= WH_EXEMPT_TAX);
          } else {
            whExempt = false; // 非居民沒有 2000 免扣判斷（但仍依規定扣繳）
          }

          const MAX_ITERS = 6;
          if (whExempt) {
            whAmt = 0;
            nhiAmt = 0;
            for (let i = 0; i < MAX_ITERS; i++) {
              const candidateGross = net + nhiAmt;
              const rawNhi = (canNHI && candidateGross >= NHI_THRESHOLD) ? (candidateGross * NHI_RATE) : 0;
              const newNhi = Math.round(rawNhi);
              if (newNhi === Math.round(nhiAmt)) { gross = candidateGross; break; }
              nhiAmt = newNhi;
              gross = candidateGross;
            }
          } else {
            for (let i = 0; i < MAX_ITERS; i++) {
              const candidateGross = net + whAmt + nhiAmt;
              const rawWh = canWithhold ? (candidateGross * whRate) : 0;
              const rawNhi = (canNHI && candidateGross >= NHI_THRESHOLD) ? (candidateGross * NHI_RATE) : 0;
              const newWh = Math.round(rawWh);
              const newNhi = Math.round(rawNhi);
              const changed = (newWh !== Math.round(whAmt)) || (newNhi !== Math.round(nhiAmt));
              whAmt = newWh;
              nhiAmt = newNhi;
              gross = candidateGross;
              if (!changed) break;
            }
          }
        }

        if (whRateTag)       whRateTag.textContent = resident ? '10%' : '20%';
        if (grossPerson)     grossPerson.textContent = fmt(gross);
        if (withholdPerson)  withholdPerson.textContent = fmt(whAmt);
        if (nhiPerson)       nhiPerson.textContent = fmt(nhiAmt);
        if (sumPerson)       sumPerson.textContent = fmt(whAmt + nhiAmt);
        if (netPerson)       netPerson.textContent = fmt(net);

      } else {
        // 公司房東 — 發票 5%
        if (!hasValidAmount) {
          if (sales) sales.textContent = '—';
          if (vat)   vat.textContent = '—';
          if (total) total.textContent = '—';
          return;
        }
        let sale, tax, tot;
        if (currentMode() === 'tax-included') {
          tot = amt;
          sale = tot / (1 + VAT_RATE);
          tax = sale * VAT_RATE;
        } else {
          sale = amt;
          tax = sale * VAT_RATE;
          tot = sale + tax;
        }
        if (sales) sales.textContent = fmt(sale);
        if (vat)   vat.textContent = fmt(tax);
        if (total) total.textContent = fmt(tot);
      }
    }

    // ===== 重新填寫 =====
    function resetForm() {
      const landlordType   = getEl('landlordType');
      const tenantType     = getEl('tenantType');
      const residentStatus = getEl('residentStatus');
      const amountInput    = getEl('amount');
      const modeGroup      = getEl('modeGroup');
      const personResult   = getEl('personResult');
      const companyResult  = getEl('companyResult');
      const whRateTag      = getEl('whRateTag');
      const grossPerson    = getEl('grossPerson');
      const withholdPerson = getEl('withholdingPerson');
      const nhiPerson      = getEl('nhiPerson');
      const sumPerson      = getEl('sumPerson');
      const netPerson      = getEl('netPerson');

      if (!landlordType || !tenantType || !residentStatus || !amountInput || !modeGroup) return;
      landlordType.value = 'person';
      tenantType.value = 'company';
      residentStatus.value = 'resident';
      amountInput.value = '';
      const radio = modeGroup.querySelector('input[value="tax-included"]');
      if (radio) radio.checked = true;
      if (personResult && companyResult) {
        personResult.style.display = 'block';
        companyResult.style.display = 'none';
      }
      if (whRateTag)      whRateTag.textContent = '10%';
      if (grossPerson)    grossPerson.textContent = '—';
      if (withholdPerson) withholdPerson.textContent = '—';
      if (nhiPerson)      nhiPerson.textContent = '—';
      if (sumPerson)      sumPerson.textContent = '—';
      if (netPerson)      netPerson.textContent = '—';
      // 清除覆寫，回到預設含稅
      window.__RentCalcModeOverride = 'tax-included';
      calc();
    }

    // ===== 事件綁定（表單） =====
    const bindTargets = [landlordType, tenantType, residentStatus, amountInput];
    bindTargets.forEach(el => el && el.addEventListener('input', calc));

    // 模式切換：使用者手動切換後，清空覆寫，改用 radio 的值
    if (modeGroupEl) {
      [...modeGroupEl.querySelectorAll('input[name="mode"]')].forEach(el => {
        el.addEventListener('change', () => {
          window.__RentCalcModeOverride = null; // 讓 currentMode() 改用使用者選的
          calc();
        });
      });
    }

    // ===== 初始載入：套用查詢參數 + 勾選對應 radio + 綁定 .copy-link 按鈕 =====
    document.addEventListener('DOMContentLoaded', () => {
      const sp = new URLSearchParams(window.location.search);
      const lt = sp.get('lt'); // person | company
      const tt = sp.get('tt'); // person | company
      const rs = sp.get('rs'); // resident | nonresident
      const amtQ = sp.get('amt'); // 字串（可能含逗點）

      if (landlordType && (lt === 'person' || lt === 'company')) landlordType.value = lt;
      if (tenantType && (tt === 'person' || tt === 'company')) tenantType.value = tt;
      if (landlordType && landlordType.value === 'person' && residentStatus && (rs === 'resident' || rs === 'nonresident')) {
        residentStatus.value = rs;
      }
      // 套用 amt（去逗點／空白）
      if (amountInput && (amtQ !== null && amtQ !== undefined)) {
        const sanitized = String(amtQ).replace(/[,\u3000\s]/g, '').trim();
        amountInput.value = sanitized;
      }

      // 從網址取模式，設為覆寫，保證一開就用網址的模式算
      const modeFinal = initModeOverrideFromUrl();
      // 勾選對應的 radio（成功時會觸發 change 並清空覆寫；失敗則保留覆寫）
      ensureModeRadioChecked(modeFinal);
      // 套用完畢後，執行一次 calc()
      calc();

      const copyLinkButtons = document.querySelectorAll('.copy-link');
      copyLinkButtons.forEach(btn => btn.addEventListener('click', copyShareUrl));
    });

    // 可選：把 resetForm 暴露到全域使用（例如按鈕 onclick="resetForm()")
    window.resetForm = resetForm;
  })(); 
}

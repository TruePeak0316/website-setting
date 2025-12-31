
/* ===== 發票小幫手：三/二聯式 ===== */
(function () {
  // ====== DOM ======
  const form = document.getElementById('invoiceForm');
  const typeRadiosOld = form ? form.querySelectorAll('input[name="type"]') : [];
  const typeRadiosNew = form ? form.querySelectorAll('input[name="invoiceType"]') : [];
  const issueDateEl = document.getElementById('issueDate');
  const taxIdEl = document.getElementById('buyerTaxId');
  const taxIdStatusEl = document.getElementById('taxIdStatus');
  const buyerNameEl = document.getElementById('buyerName');
  // 金額欄位：未稅 & 含稅（三聯式原有）
  const netAmountEl = document.getElementById('netAmount');
  const grossInputEl = document.getElementById('grossInput');
  // 稅率：支援 select #taxRate 或 radio name="taxRateRadio"
  const taxRateSelect = document.getElementById('taxRate');
  const taxRateRadios = form ? form.querySelectorAll('input[name="taxRateRadio"]') : [];
  // 結果面板
  const taxAmountEl = document.getElementById('taxAmount');
  const grossAmountEl = document.getElementById('grossAmount');
  const amountUpperEl = document.getElementById('amountUpper');
  // 三聯式/二聯式預覽
  const previewTypeEl = document.getElementById('previewType');
  const previewDateEl = document.getElementById('previewDate');
  const previewDateThree = document.getElementById('previewDateThree');
  const previewDateInline = document.getElementById('previewDateInline');
  const previewBuyerEl = document.getElementById('previewBuyer');
  const previewTaxIdEl = document.getElementById('previewTaxId');
  const previewNetEl = document.getElementById('previewNet');
  const previewRateEl = document.getElementById('previewRate');
  const previewTaxEl = document.getElementById('previewTax');
  const previewGrossEl = document.getElementById('previewGross');
  const previewUpperEl = document.getElementById('previewUpper');
  const previewUpperTP = document.getElementById('previewUpperTP');
  // 預覽容器
  const invThree = document.getElementById('invThree');
  const invTwo = document.getElementById('invTwo');
  const previewDateTwo = document.getElementById('previewDateTwo');
  const twoTotalEl = document.getElementById('twoTotal');
  const previewUpperYS = document.getElementById('previewUpperYS');
  // 第二行期別文字
  const periodLineThree = document.getElementById('periodLineThree');
  const periodLineTwo = document.getElementById('periodLineTwo');
  // 操作鍵
  const resetBtn = document.getElementById('resetBtn');
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  // ====== 欄位容器（互斥顯示）與二聯式三欄位 ======
  const fieldsThree = document.getElementById('fieldsThree');
  const fieldsTwo = document.getElementById('fieldsTwo');
  const twoIssueDateEl = document.getElementById('twoIssueDate');
  const twoTaxRateSelect = document.getElementById('twoTaxRate');
  const twoGrossEl = document.getElementById('twoGross');
  // ====== 三聯式核心欄位白名單（預設顯示這六格） ======
  const THREE_CORE_IDS = ['issueDate', 'buyerTaxId', 'buyerName', 'taxRate', 'netAmount', 'grossInput'];
  /**
   * 顯示三聯式核心欄位；將 #fieldsThree 內非核心的 .calc-col-* 整格隱藏
   * @param {'show'|'hide'} mode - 'show'：顯示核心、隱藏非核心；'hide'：全部隱藏
   */
  function setThreeCoreVisibility(mode) {
    const container = document.getElementById('fieldsThree');
    if (!container) return;
    const rows = container.querySelectorAll('.calc-col-12, .calc-col-6, .calc-col-4, .calc-col-3');
    rows.forEach(row => {
      const hasCore = THREE_CORE_IDS.some(id => row.querySelector('#' + id));
      if (mode === 'show') {
        row.classList.toggle('hidden', !hasCore);
      } else {
        row.classList.add('hidden');
      }
    });
  }
  // ====== Utilities ======
  const fmtCurrency = (n) =>
    isFinite(n) ? n.toLocaleString('zh-TW', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) : '—';
  // 取稅率數值（0.05 / 0 / 0）
  function getRateValue() {
    if (taxRateSelect) {
      const v = taxRateSelect.value;
      if (v === '5') return 0.05;
      if (v === '0') return 0;
      if (v === 'exempt') return 0;
      return 0.05;
    } else {
      const v = Array.from(taxRateRadios).find(r => r.checked)?.value ?? '5';
      if (v === '5') return 0.05;
      if (v === '0') return 0;
      if (v === 'exempt') return 0;
      return 0.05;
    }
  }
  // 取得稅率代碼（'5' / '0' / 'exempt'），依版本切換來源
  function getRateCodeForCurrentType(type) {
    if (type === 'duplicate' && twoTaxRateSelect) {
      const v = twoTaxRateSelect.value;
      return (v === '5' || v === '0' || v === 'exempt') ? v : '5';
    }
    const v = (taxRateSelect?.value ?? Array.from(taxRateRadios).find(r => r.checked)?.value ?? '5');
    return (v === '5' || v === '0' || v === 'exempt') ? v : '5';
  }
  // 版本（triplicate / duplicate）
  function getInvoiceType() {
    const valOld = Array.from(typeRadiosOld).find(el => el.checked)?.value;
    const valNew = Array.from(typeRadiosNew).find(el => el.checked)?.value;
    const val = valNew ?? valOld ?? 'triplicate';
    if (val === 'three') return 'triplicate';
    if (val === 'two') return 'duplicate';
    return (val === 'duplicate' ? 'duplicate' : 'triplicate');
  }
  function applyTypeVisibility() {
    const t = getInvoiceType(); // 'triplicate' or 'duplicate'
    // === 預覽容器切換（維持原本）
    if (t === 'duplicate') {
      invThree?.classList.add('hidden');
      invTwo ?.classList.remove('hidden');
    } else {
      invTwo ?.classList.add('hidden');
      invThree?.classList.remove('hidden');
    }
    if (previewTypeEl) previewTypeEl.textContent = (t === 'triplicate' ? '三聯式' : '二聯式');
    // === 欄位容器互斥顯示（保險版）
    const fieldsTwoEl = document.getElementById('fieldsTwo'); // 可能嵌在 #fieldsThree 裡
    const fieldsThreeEl = document.getElementById('fieldsThree');
    if (t === 'duplicate') {
      // 顯示二聯式欄位
      if (fieldsTwoEl) {
        fieldsTwoEl.classList.remove('hidden');
        fieldsTwoEl.setAttribute('aria-hidden', 'false');
        if (fieldsTwoEl.classList.contains('hidden')) fieldsTwoEl.classList.remove('hidden');
      }
      // 隱藏三聯式容器（讓畫面乾淨）
      if (fieldsThreeEl) {
        fieldsThreeEl.classList.add('hidden');
        fieldsThreeEl.setAttribute('aria-hidden', 'true');
      }
      if (typeof setThreeCoreVisibility === 'function') setThreeCoreVisibility('hide');
    } else {
      // 三聯式：顯示三聯式容器
      if (fieldsThreeEl) {
        fieldsThreeEl.classList.remove('hidden');
        fieldsThreeEl.setAttribute('aria-hidden', 'false');
      }
      // 三聯式：**強制隱藏二聯式欄位**
      if (fieldsTwoEl) {
        fieldsTwoEl.classList.add('hidden');
        fieldsTwoEl.setAttribute('aria-hidden', 'true');
      }
      // 三聯式：只顯示核心六格（若有）
      if (typeof setThreeCoreVisibility === 'function') setThreeCoreVisibility('show');
    }
  }
  // 統編檢核
  function validateTaxId(value) {
    const s = String(value ?? '').replace(/\D/g, '');
    if (s.length !== 8) return { ok:false, reason:'統編需為 8 位數字' };
    const weights = [1,2,1,2,1,2,4,1];
    let sum = 0;
    for (let i=0;i<8;i++){
      const p = Number(s[i]) * weights[i];
      sum += Math.floor(p/10) + (p % 10);
    }
    const seventhIs7 = s[6] === '7';
    const ok = (sum % 5 === 0) || (seventhIs7 && (sum + 1) % 5 === 0);
    return ok ? { ok:true } : { ok:false, reason:'統編檢核未通過' };
  }
  // 中文大寫（保留）
  function ntdUpper(n){
    if (!isFinite(n)) return '—';
    const units=['元','拾','佰','仟','萬','拾','佰','仟','億','拾','佰','仟','兆'];
    const numerals=['零','壹','貳','參','肆','伍','陸','柒','捌','玖'];
    const integer = Math.floor(n);
    if (integer === 0) return '新台幣零元整';
    const intStr = String(integer);
    let result = '';
    for (let i = 0; i < intStr.length; i++) {
      const num = Number(intStr[intStr.length - 1 - i]);
      const unit = units[i] || '';
      if (num === 0) result = '零' + unit + result;
      else result = numerals[num] + unit + result;
    }
    return result + '整';
  }
  // ROC 日期（保留）
  function formatROCDate(dateStr){
    if (!dateStr) return '—';
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d)) return '—';
    const y = d.getFullYear() - 1911;
    const m = String(d.getMonth()+1).padStart(2,'0');
    const day = String(d.getDate()).padStart(2,'0');
    return `${y}年 ${m}月 ${day}日`;
  }
  // ====== 含稅回推 ======
  // 規則：未稅 = 四捨五入(gross / (1+rate))；稅額 = 含稅 − 未稅
  function backCalcNetFromGross(gross, rate){
    if (!isFinite(gross)) return NaN;
    if (rate === 0) return Math.round(gross); // 0%/免稅：未稅＝含稅（整數元）
    const divisor = 1 + rate;
    const net = Math.round(gross / divisor);  // 四捨五入到「元」
    return net;
  }
  // 追蹤「最後輸入者」：'net' 或 'gross'
  let lastSource = 'net';
  // 統編分格（保留）
  function fillTaxIdBoxes(taxIdRaw){
    const digits = String(taxIdRaw ?? '').replace(/\D/g, '').slice(0, 8).split('');
    for (let i = 1; i <= 8; i++){
      const el = document.getElementById('taxBox' + i);
      if (!el) continue;
      el.textContent = digits[i-1] ?? '';
    }
  }
  // 阿拉伯數字逐位轉中文（民國年用）
  function toChineseDigits(num) {
    const map = { '0':'零','1':'一','2':'二','3':'三','4':'四','5':'五','6':'六','7':'七','8':'八','9':'九' };
    return String(num).split('').map(d => map[d] ?? d).join('');
  }
  // 依月份回傳雙月期別中文
  function getBimonthPeriodLabel(month) {
    const pairs = [
      ['一','二'], ['三','四'], ['五','六'],
      ['七','八'], ['九','十'], ['十一','十二']
    ];
    const idx = Math.floor((month - 1) / 2);
    const [m1, m2] = pairs[idx] ?? ['一','二'];
    return `${m1}、${m2}月份`;
  }
  function updatePeriodLineByDate(dateStr) {
    if (!dateStr) return;
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d)) return;
    const rocYear = d.getFullYear() - 1911;
    const rocYearDigits = toChineseDigits(rocYear);
    const month = d.getMonth() + 1;
    const periodLabel = getBimonthPeriodLabel(month);
    const text = `${rocYearDigits}年${periodLabel}`;
    if (periodLineThree) periodLineThree.textContent = text;
    if (periodLineTwo) periodLineTwo.textContent = text;
  }
  // ===== 新增：是否數值已填 =====
  function isFilledNumber(inputEl) {
    if (!inputEl || inputEl.value === '') return false;
    const v = parseFloat(inputEl.value);
    return isFinite(v);
  }
  // ===== 新增：完成必填就隱藏上方紅色提示膠囊 =====
  function toggleTopNoteVisibility() {
    const topNote = document.querySelector('span.check.note');
    if (!topNote) return;
    const type = getInvoiceType();
    let allOk = false;
    if (type === 'duplicate') {
      const ds = twoIssueDateEl?.value;
      const okDate = (ds && !isNaN(new Date(ds + 'T00:00:00')));
      const rateOk = ['5','0','exempt'].includes(twoTaxRateSelect?.value ?? '5');
      const grossOk = isFilledNumber(twoGrossEl);
      allOk = okDate && rateOk && grossOk;
    } else {
      const ds = issueDateEl?.value;
      const okDate = (ds && !isNaN(new Date(ds + 'T00:00:00')));
      const buyerFilled = Boolean(buyerNameEl?.value?.trim());
      const taxIdVal = taxIdEl?.value?.trim() ?? '';
      const vTax = validateTaxId(taxIdVal);
      const taxIdOk = (taxIdVal.length === 8 && vTax.ok);
      const netOk = isFilledNumber(netAmountEl);
      const grossOk = isFilledNumber(grossInputEl);
      const rateValue = (taxRateSelect?.value ?? Array.from(taxRateRadios).find(r => r.checked)?.value ?? '5');
      const rateOk = ['5','0','exempt'].includes(rateValue);
      allOk = okDate && buyerFilled && taxIdOk && (netOk || grossOk) && rateOk;
    }
    topNote.classList.toggle('hidden', allOk);
  }
  // ====== 主計算與渲染 ======
  function computeAndRender(){
    const type = getInvoiceType();
    // 日期來源
    const dateStr = (type === 'duplicate' ? twoIssueDateEl?.value : issueDateEl?.value);
    // 稅率來源
    function getRateValueFor(typeNow) {
      if (typeNow === 'duplicate' && twoTaxRateSelect) {
        const v = twoTaxRateSelect.value;
        if (v === '5') return 0.05;
        if (v === '0') return 0;
        if (v === 'exempt') return 0;
        return 0.05;
      }
      return getRateValue();
    }
    const rate = getRateValueFor(type);
    // 金額計算
    let net = NaN, gross = NaN, tax = NaN;
    if (type === 'duplicate') {
      // 二聯式：只用含稅總額（實收）
      const g = parseFloat(twoGrossEl?.value ?? '');
      if (isFinite(g)) {
        if (rate === 0) {
          net   = Math.round(g);
          tax   = 0;
          gross = Math.round(g);
        } else {
          net   = backCalcNetFromGross(g, rate);   // 未稅 = round(g/(1+rate))
          gross = Math.round(g);                    // 顯示含稅為整數元（可改為 g 以保留小數）
          tax   = isFinite(net) ? (gross - net) : NaN; // 稅額 = 含稅 - 未稅
        }
        // 同步到三聯式欄位（保留同步，但不強制覆蓋使用者輸入語意）
        if (grossInputEl) grossInputEl.value = isFinite(gross) ? String(gross) : '';
        if (netAmountEl)  netAmountEl.value  = isFinite(net)   ? String(net)   : '';
        lastSource = 'gross';
      }
    } else {
      // 三聯式：沿用原本邏輯，但稅額用差額
      if (lastSource === 'gross' && grossInputEl && grossInputEl.value !== ''){
        const g = parseFloat(grossInputEl.value);
        if (isFinite(g)){
          net   = backCalcNetFromGross(g, rate);
          gross = Math.round(g);
          tax   = isFinite(net) ? (gross - net) : NaN;
          if (isFinite(net) && netAmountEl) netAmountEl.value = String(net);
        }
      } else {
        net = parseFloat(netAmountEl?.value);
        if (isFinite(net)) {
          if (rate === 0) {
            tax = 0;
            gross = net;
          } else {
            gross = Math.round(net * (1 + rate)); // 讓含稅維持整數元
            tax   = gross - net;                  // 稅額用差額
          }
        } else {
          tax = NaN;
          gross = NaN;
        }
        if (grossInputEl) grossInputEl.value = isFinite(gross) ? String(gross) : '';
      }
    }
    // 版本與欄位容器顯示
    applyTypeVisibility();
    // 統編檢核（維持原本）
    const taxId = taxIdEl?.value?.trim() ?? '';
    const v = validateTaxId(taxId);
    if (!taxId){
      if (taxIdStatusEl){ taxIdStatusEl.textContent=''; taxIdStatusEl.className='calc-help'; }
    } else if (v.ok){
      if (taxIdStatusEl){ taxIdStatusEl.textContent='統編檢核：通過'; taxIdStatusEl.className='calc-help status-ok'; }
    } else {
      if (taxIdStatusEl){ taxIdStatusEl.textContent=`統編檢核：未通過（${v.reason}）`; taxIdStatusEl.className='calc-help status-bad'; }
    }
    // 試算摘要
    if (taxAmountEl)   taxAmountEl.textContent   = fmtCurrency(tax);
    if (grossAmountEl) grossAmountEl.textContent = fmtCurrency(gross);
    if (amountUpperEl) amountUpperEl.textContent = isFinite(gross) ? ntdUpper(gross) : '—';
    // 三聯式/二聯式預覽填字
    const buyer = buyerNameEl?.value?.trim() ?? '';
    if (previewBuyerEl) previewBuyerEl.textContent = (type === 'duplicate' ? '可省略　中華民國 —' : (buyer || '必填'));
    if (previewDateEl)     previewDateEl.textContent     = formatROCDate(dateStr);
    if (previewDateThree)  previewDateThree.textContent  = formatROCDate(dateStr);
    if (previewDateInline) previewDateInline.textContent = formatROCDate(dateStr);
    const taxIdClean = (taxId || '');
    const previewTaxIdTextEl = document.getElementById('previewTaxIdText');
    if (previewTaxIdTextEl) previewTaxIdTextEl.textContent = taxIdClean || '—';
    fillTaxIdBoxes(taxIdClean);
    if (previewTaxIdEl) previewTaxIdEl.textContent = taxId || (type === 'triplicate' ? '—' : '（二聯式免填）');
    if (previewNetEl)  previewNetEl.textContent  = fmtCurrency(net);
    if (previewTaxEl)  previewTaxEl.textContent  = fmtCurrency(tax);
    if (previewGrossEl)previewGrossEl.textContent= fmtCurrency(gross);
    if (previewUpperEl)previewUpperEl.textContent= isFinite(gross) ? ntdUpper(gross) : '—';
    if (previewUpperYS)previewUpperYS.textContent= isFinite(gross) ? ntdUpper(gross) : '—';
    // 稅率文字
    const vCode = getRateCodeForCurrentType(type); // '5' / '0' / 'exempt'
    const rateLabel = (vCode === '5' ? '5%' : (vCode === '0' ? '0%' : '免稅'));
    if (previewRateEl) previewRateEl.textContent = rateLabel;
    // 稅別打 V
    (function markTaxKind() {
      const tMark = document.getElementById('taxableMark');
      const zMark = document.getElementById('zeroRatedMark');
      const eMark = document.getElementById('exemptMark');
      if (tMark) tMark.textContent = '';
      if (zMark) zMark.textContent = '';
      if (eMark) eMark.textContent = '';
      if (vCode === '5' && tMark) tMark.textContent = 'V';
      else if (vCode === '0' && zMark) zMark.textContent = 'V';
      else if (vCode === 'exempt' && eMark) eMark.textContent = 'V';
    })();
    (function markTaxKindYS() {
      const tYS = document.getElementById('taxableMarkYS');
      const zYS = document.getElementById('zeroRatedMarkYS');
      const eYS = document.getElementById('exemptMarkYS');
      if (tYS) tYS.textContent = '';
      if (zYS) zYS.textContent = '';
      if (eYS) eYS.textContent = '';
      if (vCode === '5' && tYS) tYS.textContent = 'V';
      else if (vCode === '0' && zYS) zYS.textContent = 'V';
      else if (vCode === 'exempt' && eYS) eYS.textContent = 'V';
    })();
    // 二聯式預覽
    if (previewDateTwo) previewDateTwo.textContent = formatROCDate(dateStr);
    if (twoTotalEl) twoTotalEl.textContent = isFinite(gross) ? Math.round(gross).toLocaleString('zh-TW') : '0';
    // 第二行期別
    updatePeriodLineByDate(dateStr);
    // 完成必填就隱藏提示膠囊
    toggleTopNoteVisibility();
  }
  // ====== URL 參數（保留原本；如需可擴充 twoDate/twoRate/twoGross） ======
  function applyFromQuery(){
    const params = new URLSearchParams(location.search);
    const map = {
      type: (v)=>{ const t=(v==='duplicate' ? 'duplicate':'triplicate'); Array.from(typeRadiosOld).forEach(el=>{ el.checked=(el.value===t); }); },
      invoiceType: (v)=>{ const t=(v==='two' ? 'two':'three'); Array.from(typeRadiosNew).forEach(el=>{ el.checked=(el.value===t); }); },
      date: (v)=>{ if (issueDateEl) issueDateEl.value = v ?? ''; },
      taxId: (v)=>{ if (taxIdEl) taxIdEl.value=(v??'').slice(0,8); },
      buyer: (v)=>{ if (buyerNameEl) buyerNameEl.value=v??''; },
      net: (v)=>{ if (netAmountEl) netAmountEl.value=v??''; lastSource='net'; },
      gross:(v)=>{ if (grossInputEl) grossInputEl.value=v??''; lastSource='gross'; },
      rate: (v)=>{
        const ok = (['5','0','exempt'].includes(v));
        if (taxRateSelect) taxRateSelect.value = ok ? v : '5';
        Array.from(taxRateRadios).forEach(r=>{ r.checked = (r.value === (ok ? v : '5')); });
      }
    };
    for (const [k,fn] of Object.entries(map)) { if (params.has(k)) fn(params.get(k)); }
    computeAndRender();
  }
  function buildShareURL(){
    const typeValue = getInvoiceType(); // 'triplicate' / 'duplicate'
    const invoiceTypeValue = (typeValue === 'duplicate' ? 'two' : 'three'); // two/three
    const params = new URLSearchParams({
      type: typeValue,
      invoiceType: invoiceTypeValue,
      date: issueDateEl?.value ?? '',
      taxId: taxIdEl?.value ?? '',
      buyer: buyerNameEl?.value ?? '',
      net: (lastSource==='net' ? (netAmountEl?.value ?? '') : ''),
      gross:(lastSource==='gross' ? (grossInputEl?.value ?? ''): ''),
      rate: (taxRateSelect?.value ?? Array.from(taxRateRadios).find(r=>r.checked)?.value ?? '5')
    });
    const url = `${location.origin}${location.pathname}?${params.toString()}#invoice-caculator`;
    return url;
  }
  async function copyLink(){
    const url = buildShareURL();
    try { await navigator.clipboard.writeText(url); alert('已複製連結到剪貼簿！'); }
    catch (e){ prompt('複製失敗，請手動複製：', url); }
  }
  function resetAll(){
    form?.reset();
    if (taxIdStatusEl){ taxIdStatusEl.textContent=''; taxIdStatusEl.className='calc-help'; }
    lastSource = 'net';
    computeAndRender();
  }
  // ====== 事件 ======
  if (form){
    form.addEventListener('input', computeAndRender);
    form.addEventListener('change', computeAndRender);
  }
  // 明確追蹤「最後輸入者」
  netAmountEl?.addEventListener('input', ()=>{ lastSource='net'; });
  grossInputEl?.addEventListener('input', ()=>{ lastSource='gross'; });
  // 二聯式含稅總額也追蹤最後輸入者
  twoGrossEl?.addEventListener('input', ()=>{ lastSource='gross'; });
  // 稅率（radio）變更時也重算
  Array.from(taxRateRadios).forEach(r=> r.addEventListener('change', ()=>{ computeAndRender(); }));
  if (resetBtn)    resetBtn.addEventListener('click', resetAll);
  if (copyLinkBtn) copyLinkBtn.addEventListener('click', copyLink);
  // ====== 初始化 ======
  applyFromQuery(); // 先套 URL 帶入（可能切到二聯式）
  applyTypeVisibility(); // 依當前版本顯示容器（會同步套三聯式核心欄位顯示）
  if (getInvoiceType() === 'triplicate') setThreeCoreVisibility('show'); // 預設三聯式顯示核心六格
})();

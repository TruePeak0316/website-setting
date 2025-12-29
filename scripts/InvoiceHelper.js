
/* ===== 發票小幫手：三/二聯式＋含稅回推 ===== */
(function () {
  // ====== DOM ======
  const form = document.getElementById('invoiceForm');
  // 支援舊(name="type") 與 新(name="invoiceType")
  const typeRadiosOld = form ? form.querySelectorAll('input[name="type"]') : [];
  const typeRadiosNew = form ? form.querySelectorAll('input[name="invoiceType"]') : [];
  const issueDateEl   = document.getElementById('issueDate');
  const taxIdEl       = document.getElementById('buyerTaxId');
  const taxIdStatusEl = document.getElementById('taxIdStatus');
  const buyerNameEl   = document.getElementById('buyerName');
  // 金額欄位：未稅 & 含稅（新增）
  const netAmountEl   = document.getElementById('netAmount');
  const grossInputEl  = document.getElementById('grossInput');
  // 稅率：支援 select #taxRate 或 radio name="taxRateRadio"
  const taxRateSelect = document.getElementById('taxRate');
  const taxRateRadios = form ? form.querySelectorAll('input[name="taxRateRadio"]') : [];
  // 結果面板
  const taxAmountEl   = document.getElementById('taxAmount');
  const grossAmountEl = document.getElementById('grossAmount');
  const amountUpperEl = document.getElementById('amountUpper');
  // 三聯式預覽
  const previewTypeEl     = document.getElementById('previewType');
  const previewDateEl     = document.getElementById('previewDate');      
  const previewDateThree  = document.getElementById('previewDateThree'); 
  const previewDateInline = document.getElementById('previewDateInline'); 
  const previewBuyerEl    = document.getElementById('previewBuyer');
  const previewTaxIdEl    = document.getElementById('previewTaxId');
  const previewNetEl      = document.getElementById('previewNet');
  const previewRateEl     = document.getElementById('previewRate');
  const previewTaxEl      = document.getElementById('previewTax');
  const previewGrossEl    = document.getElementById('previewGross');
  const previewUpperEl    = document.getElementById('previewUpper');
  const previewUpperTP    = document.getElementById('previewUpperTP'); 
  // 版型容器（二聯式）
  const invThree       = document.getElementById('invThree');
  const invTwo         = document.getElementById('invTwo');
  const previewDateTwo = document.getElementById('previewDateTwo');
  const twoTotalEl     = document.getElementById('twoTotal');
  const previewUpperYS = document.getElementById('previewUpperYS');

  // ===== 只更新「第二行期別文字」的目標節點 =====
  const periodLineThree = document.getElementById('periodLineThree'); // 三聯式第二行期別
  const periodLineTwo   = document.getElementById('periodLineTwo');   // 二聯式第二行期別

  // 操作鍵
  const resetBtn     = document.getElementById('resetBtn');
  const copyLinkBtn  = document.getElementById('copyLinkBtn');

  // ====== Utilities ======
  const fmtCurrency = (n) =>
    isFinite(n) ? n.toLocaleString('zh-TW', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) : '—';

  // 取得稅率數值（0.05 / 0 / 0）
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

  // 版型（triplicate / duplicate）
  function getInvoiceType() {
    const valOld = Array.from(typeRadiosOld).find(el => el.checked)?.value;
    const valNew = Array.from(typeRadiosNew).find(el => el.checked)?.value;
    const val = valNew ?? valOld ?? 'triplicate';
    if (val === 'three') return 'triplicate';
    if (val === 'two') return 'duplicate';
    return (val === 'duplicate' ? 'duplicate' : 'triplicate');
  }

  function applyTypeVisibility() {
    const t = getInvoiceType();
    if (t === 'duplicate') {
      invThree?.classList.add('hidden');
      invTwo?.classList.remove('hidden');
    } else {
      invTwo?.classList.add('hidden');
      invThree?.classList.remove('hidden');
    }
    if (previewTypeEl) previewTypeEl.textContent = (t === 'triplicate' ? '三聯式' : '二聯式');
  }

  // 統編檢核（沿用舊邏輯）
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
    const ok = (sum % 5 === 0)
      || (seventhIs7 && (sum + 1) % 5 === 0);
    return ok ? { ok:true } : { ok:false, reason:'統編檢核未通過' };
  }

  // 中文大寫
  function ntdUpper(n){
    if (!isFinite(n)) return '—';
    const units=['元','拾','佰','仟','萬','拾','佰','仟','億','拾','佰','仟','兆'];
    const numerals=['零','壹','貳','參','肆','伍','陸','柒','捌','玖'];
    const cents = Math.round((n*100)%100);
    const integer = Math.floor(n);
    
 // 整數部分：逐位拼接（每一位都保留單位；0 也保留「零＋單位」）
  if (integer === 0 && cents === 0) return '新台幣零元整';

  const intStr = String(integer);
  let result = '';

  for (let i = 0; i < intStr.length; i++) {
    const num = Number(intStr[intStr.length - 1 - i]); // 從個位開始
    const unit = units[i] || '';                       // 依位數取單位

    if (num === 0) {
      // 您要的逐位完整：零也帶出單位（例如「零佰」「零拾」「零元」）
      result = '零' + unit + result;
    } else {
      result = numerals[num] + unit + result;
    }
  }

  // 小數尾：有角分就寫角分，否則寫「整」
  let tail = '整';


    return result + tail;
  }

  // ROC 日期
  function formatROCDate(dateStr){
    if (!dateStr) return '—';
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d)) return '—';
    const y = d.getFullYear() - 1911;
    const m = String(d.getMonth()+1).padStart(2,'0');
    const day = String(d.getDate()).padStart(2,'0');
    return `${y}年 ${m}月 ${day}日`;
  }

  // ====== 含稅回推演算法 ======
  function backCalcNetFromGross(gross, rate){
    if (!isFinite(gross)) return NaN;
    if (rate === 0) return gross; // 零稅率或免稅：未稅＝含稅
    const guess = Math.round(gross / (1 + rate)); // 初步估計（整元）
    const tryList = [0,-1,1,-2,2,-3,3];
    const roundTax = (n) => Math.round(n * rate);
    for (const d of tryList){
      const n = guess + d;
      if (n < 0) continue;
      if (n + roundTax(n) === gross) return n;
    }
    return guess; // 若無剛好相等，回傳估計值（差 0～1 元屬常見）
  }

  // 追蹤「最後輸入者」：'net' 或 'gross'
  let lastSource = 'net';

  // 將統編分格顯示：把數字逐格填入 taxBox1~taxBox8，不足則空白
  function fillTaxIdBoxes(taxIdRaw){
    const digits = String(taxIdRaw ?? '').replace(/\D/g, '').slice(0, 8).split('');
    for (let i = 1; i <= 8; i++){
      const el = document.getElementById('taxBox' + i);
      if (!el) continue;
      el.textContent = digits[i-1] ?? '';
    }
  }

  // 阿拉伯數字逐位轉中文（民國年用：114 -> 「一一四」）
  function toChineseDigits(num) {
    const map = { '0':'零','1':'一','2':'二','3':'三','4':'四','5':'五','6':'六','7':'七','8':'八','9':'九' };
    return String(num).split('').map(d => map[d] ?? d).join('');
  }
  // 依月份回傳雙月期別中文（例：12 -> 「十一、十二月份」）
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
    if (!dateStr) return;              // 未填日期不更新
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d)) return;              // 非法日期不更新
    const rocYear = d.getFullYear() - 1911;
    const rocYearDigits = toChineseDigits(rocYear);  // 114 -> 「一一四」
    const month = d.getMonth() + 1;
    const periodLabel = getBimonthPeriodLabel(month); // 11/12 -> 「十一、十二月份」
    const text = `${rocYearDigits}年${periodLabel}`;
    if (periodLineThree) periodLineThree.textContent = text;
    if (periodLineTwo)   periodLineTwo.textContent   = text;
  }


  // ====== 主計算與渲染 ======
  function computeAndRender(){
    const type   = getInvoiceType();
    const dateStr= issueDateEl?.value;
    const taxId  = taxIdEl?.value?.trim() ?? '';
    const buyer  = buyerNameEl?.value?.trim() ?? '';
    const rate   = getRateValue();

    // 先決定未稅金額來源
    let net = NaN, gross = NaN, tax = NaN;

    if (lastSource === 'gross' && grossInputEl && grossInputEl.value !== ''){
      const g = parseFloat(grossInputEl.value);
      if (isFinite(g)){
        net  = backCalcNetFromGross(g, rate);
        tax  = isFinite(net) ? Math.round(net * rate) : NaN; // 四捨五入至元
        gross= isFinite(net) ? net + tax : NaN;
        // 同步填回未稅輸入框（不會觸發 input 事件）
        if (isFinite(net) && netAmountEl) netAmountEl.value = String(net);
      }
    } else {
      // 以未稅欄為主
      net  = parseFloat(netAmountEl?.value);
      tax  = isFinite(net) ? Math.round(net * rate) : NaN;
      gross= isFinite(net) ? net + tax : NaN;
      // 同步顯示到含稅欄（不會觸發 input 事件）
      if (grossInputEl) grossInputEl.value = isFinite(gross) ? String(Math.round(gross)) : '';
    }

    // 版型顯示
    applyTypeVisibility();

    // 統編檢核
    const v = validateTaxId(taxId);
    if (!taxId){
      if (taxIdStatusEl){ taxIdStatusEl.textContent=''; taxIdStatusEl.className='calc-help'; }
    }else if (v.ok){
      if (taxIdStatusEl){ taxIdStatusEl.textContent='統編檢核：通過'; taxIdStatusEl.className='calc-help status-ok'; }
    }else{
      if (taxIdStatusEl){ taxIdStatusEl.textContent=`統編檢核：未通過（${v.reason}）`; taxIdStatusEl.className='calc-help status-bad'; }
    }

    // 試算摘要
    if (taxAmountEl)   taxAmountEl.textContent   = fmtCurrency(tax);
    if (grossAmountEl) grossAmountEl.textContent = fmtCurrency(gross);
    if (amountUpperEl) amountUpperEl.textContent = isFinite(gross) ? ntdUpper(gross) : '—';

    // 三聯式/二聯式預覽
    if (previewBuyerEl) previewBuyerEl.textContent = (buyer || '必填');
    if (previewDateEl) previewDateEl.textContent = formatROCDate(dateStr);
    if (previewDateThree) previewDateThree.textContent = formatROCDate(dateStr);
    if (previewDateInline) previewDateInline.textContent = formatROCDate(dateStr);
    const taxIdClean = (taxId || '');
    const previewTaxIdTextEl = document.getElementById('previewTaxIdText');
    if (previewTaxIdTextEl) previewTaxIdTextEl.textContent = taxIdClean || '—';
    fillTaxIdBoxes(taxIdClean);
    if (previewTaxIdEl) previewTaxIdEl.textContent = taxId || (type === 'triplicate' ? '—' : '（二聯式免填）');

    if (previewNetEl)   previewNetEl.textContent   = fmtCurrency(net);
    if (previewRateEl)  previewRateEl.textContent  = (rate===0 ? (taxRateSelect?.value==='exempt' ? '免稅' : '0%') : '5%');
    if (previewTaxEl)   previewTaxEl.textContent   = fmtCurrency(tax);
    if (previewGrossEl) previewGrossEl.textContent = fmtCurrency(gross);
    if (previewUpperEl)  previewUpperEl.textContent  = isFinite(gross) ? ntdUpper(gross) : '—';
    if (previewUpperYS)  previewUpperYS.textContent  = isFinite(gross) ? ntdUpper(gross) : '—';

    // ===== 課稅別打「V」：依選稅率自動標示 =====
    (function markTaxKind() {
      const tMark = document.getElementById('taxableMark');
      const zMark = document.getElementById('zeroRatedMark');
      const eMark = document.getElementById('exemptMark');
      // 先清空
      if (tMark) tMark.textContent = '';
      if (zMark) zMark.textContent = '';
      if (eMark) eMark.textContent = '';
      // 依 select/radio 的值決定在哪一格放「V」
      const v = (taxRateSelect?.value ?? Array.from(taxRateRadios).find(r => r.checked)?.value ?? '5');
      if (v === '5' && tMark) tMark.textContent = 'V';
      else if (v === '0' && zMark) zMark.textContent = 'V';
      else if (v === 'exempt' && eMark) eMark.textContent = 'V';
    })();

    // ===== YS（二聯式）課稅別打 V =====
    (function markTaxKindYS() {
      const tYS = document.getElementById('taxableMarkYS');
      const zYS = document.getElementById('zeroRatedMarkYS');
      const eYS = document.getElementById('exemptMarkYS');
      if (tYS) tYS.textContent = '';
      if (zYS) zYS.textContent = '';
      if (eYS) eYS.textContent = '';
      const v = (taxRateSelect?.value ?? Array.from(taxRateRadios).find(r => r.checked)?.value ?? '5');
      if (v === '5' && tYS) tYS.textContent = 'V';
      else if (v === '0' && zYS) zYS.textContent = 'V';
      else if (v === 'exempt' && eYS) eYS.textContent = 'V';
    })();

    // 二聯式預覽
    if (previewDateTwo) previewDateTwo.textContent = formatROCDate(dateStr);
    if (twoTotalEl)     twoTotalEl.textContent     = isFinite(gross) ? Math.round(gross).toLocaleString('zh-TW') : '0';

    // ===== 只更新第二行期別 =====
    updatePeriodLineByDate(issueDateEl?.value);
  }

  // ====== URL 參數：支援 gross（含稅）可選 ======
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
    //  把舊值對應成新版 radio 的值，確保貼回網址時能勾選二聯式/三聯式
    const invoiceTypeValue = (typeValue === 'duplicate' ? 'two' : 'three'); // two/three

    const params = new URLSearchParams({
      type: typeValue,               
      invoiceType: invoiceTypeValue, 
      date: issueDateEl?.value ?? '',
      taxId: taxIdEl?.value ?? '',
      buyer: buyerNameEl?.value ?? '',
      // 依最後輸入者決定輸出 net 或 gross
      net: (lastSource==='net'   ? (netAmountEl?.value ?? '') : ''),
      gross:(lastSource==='gross' ? (grossInputEl?.value ?? ''): ''),
      // 稅率（優先 select，其次 radio）
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
  // 稅率（radio）變更時也重新計算
  Array.from(taxRateRadios).forEach(r=> r.addEventListener('change', ()=>{ computeAndRender(); }));
  if (resetBtn)     resetBtn.addEventListener('click', resetAll);
  if (copyLinkBtn)  copyLinkBtn.addEventListener('click', copyLink);

  // 初始化
  applyFromQuery();
})();

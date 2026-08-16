"use client";

import { CopySimple, LinkSimple } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import {
  chineseDigitDatePeriod,
  buildInvoiceQuery,
  computeInvoice,
  formatMoney,
  formatRocDate,
  initialInvoiceState,
  ntdUpper,
  parseInvoiceQuery,
  rateLabel,
  validateTaxId,
  type InvoiceSource,
  type InvoiceState,
  type TaxRateCode,
} from "@/lib/invoice";

async function copyValue(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    if (!copied) window.prompt("請手動複製以下內容：", value);
    return copied;
  }
}

export function InvoiceCalculator() {
  const [state, setState] = useState<InvoiceState>(initialInvoiceState);
  const [source, setSource] = useState<InvoiceSource>("net");
  const [copyFeedback, setCopyFeedback] = useState("");
  const result = useMemo(() => computeInvoice(state, source), [state, source]);
  const taxIdCheck = state.buyerTaxId ? validateTaxId(state.buyerTaxId) : null;
  const activeDate = state.invoiceType === "two" ? state.twoIssueDate : state.issueDate;
  const activeRate = state.invoiceType === "two" ? state.twoTaxRate : state.taxRate;
  const twoBuyerDisplay = state.twoBuyerName.trim() || "(無統編之買受人)";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const parsed = parseInvoiceQuery(params);
    if (!parsed) return;
    setState(parsed.state);
    setSource(parsed.source);
  }, []);

  useEffect(() => {
    if (!copyFeedback) return;
    const timer = window.setTimeout(() => setCopyFeedback(""), 2500);
    return () => window.clearTimeout(timer);
  }, [copyFeedback]);

  function update<K extends keyof InvoiceState>(key: K, value: InvoiceState[K]) {
    setState((current) => ({ ...current, [key]: value }));
  }

  async function copyShareLink() {
    const params = buildInvoiceQuery(state, source);
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}#invoice-calculator-panel`;
    setCopyFeedback((await copyValue(url)) ? "已複製分享連結" : "請手動複製分享連結");
  }

  async function copyResultText() {
    if (!Number.isFinite(result.gross)) {
      setCopyFeedback("請先輸入試算金額");
      return;
    }

    const lines = [
      "發票營業稅試算",
      `發票類型：${state.invoiceType === "three" ? "三聯式（公司）" : "二聯式（個人）"}`,
      ...(activeDate ? [`日期：${formatRocDate(activeDate)}`] : []),
      ...(state.invoiceType === "three" && state.buyerName ? [`買受人：${state.buyerName}`] : []),
      ...(state.invoiceType === "two" ? [`買受人：${twoBuyerDisplay}`] : []),
      ...(state.invoiceType === "three" && state.buyerTaxId ? [`統一編號：${state.buyerTaxId}`] : []),
      `稅率：${rateLabel(activeRate)}`,
      `銷售額（未稅）：${formatMoney(result.net)} 元`,
      `營業稅額：${formatMoney(result.tax)} 元`,
      `總計金額（含稅）：${formatMoney(result.gross)} 元`,
      `新台幣中文大寫：${ntdUpper(result.gross)}`,
    ];
    setCopyFeedback((await copyValue(lines.join("\n"))) ? "已複製試算文字" : "請手動複製試算文字");
  }

  function resetInvoice() {
    setState(initialInvoiceState);
    setSource("net");
    setCopyFeedback("");
  }

  return (
    <section className="brand-card rounded-xs p-5 sm:p-7">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-brand-charcoal">發票營業稅金額試算</h2>
        <p className="mt-2 text-sm text-zinc-500">三聯式開立給公司；二聯式開立給個人。稅額四捨五入至元。</p>
      </div>

      <div className="mb-6 grid gap-2 sm:grid-cols-2">
        {[
          { id: "three" as const, label: "三聯式（公司）" },
          { id: "two" as const, label: "二聯式（個人）" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => update("invoiceType", item.id)}
            className={`rounded-xs border px-4 py-3 text-sm font-semibold transition ${
              state.invoiceType === item.id ? "border-brand-primary bg-brand-primary text-white" : "border-brand-light/40 bg-white text-zinc-600"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="grid content-evenly gap-4 sm:grid-cols-2">
          {state.invoiceType === "three" ? (
            <>
              <label className="space-y-2 text-sm font-semibold text-zinc-700">
                開立日期
                <input type="date" value={state.issueDate} onChange={(event) => update("issueDate", event.target.value)} className="w-full rounded-xs border border-brand-light/40 px-3 py-2.5 font-normal outline-none focus:border-brand-primary" />
              </label>
              <label className="space-y-2 text-sm font-semibold text-zinc-700">
                公司統編
                <input value={state.buyerTaxId} onChange={(event) => update("buyerTaxId", event.target.value.replace(/\D/g, "").slice(0, 8))} className="w-full rounded-xs border border-brand-light/40 px-3 py-2.5 font-normal outline-none focus:border-brand-primary" placeholder="8 位數字" />
                {taxIdCheck ? <span className={`block text-xs ${taxIdCheck.ok ? "text-green-700" : "text-red-600"}`}>{taxIdCheck.ok ? "統編檢核通過" : taxIdCheck.reason}</span> : null}
              </label>
              <label className="space-y-2 text-sm font-semibold text-zinc-700">
                公司名稱或買受人
                <input value={state.buyerName} onChange={(event) => update("buyerName", event.target.value)} className="w-full rounded-xs border border-brand-light/40 px-3 py-2.5 font-normal outline-none focus:border-brand-primary" placeholder="例如：誠峰股份有限公司" />
              </label>
              <label className="space-y-2 text-sm font-semibold text-zinc-700">
                稅率
                <select value={state.taxRate} onChange={(event) => update("taxRate", event.target.value as TaxRateCode)} className="w-full rounded-xs border border-brand-light/40 px-3 py-2.5 font-normal outline-none focus:border-brand-primary">
                  <option value="5">5%（一般稅率）</option>
                  <option value="0">0%（零稅率）</option>
                  <option value="exempt">免稅</option>
                </select>
              </label>
              <label className="space-y-2 text-sm font-semibold text-zinc-700">
                銷售額（未稅）
                <input type="number" value={state.netAmount} onChange={(event) => { setSource("net"); update("netAmount", event.target.value); }} className="w-full rounded-xs border border-brand-light/40 px-3 py-2.5 font-normal outline-none focus:border-brand-primary" placeholder="請輸入金額" />
              </label>
              <label className="space-y-2 text-sm font-semibold text-zinc-700">
                銷售額（含稅）回推
                <input type="number" value={state.grossAmount} onChange={(event) => { setSource("gross"); update("grossAmount", event.target.value); }} className="w-full rounded-xs border border-brand-light/40 px-3 py-2.5 font-normal outline-none focus:border-brand-primary" placeholder="請輸入含稅金額" />
              </label>
            </>
          ) : (
            <>
              <label className="space-y-2 text-sm font-semibold text-zinc-700">
                開立日期
                <input type="date" value={state.twoIssueDate} onChange={(event) => update("twoIssueDate", event.target.value)} className="w-full rounded-xs border border-brand-light/40 px-3 py-2.5 font-normal outline-none focus:border-brand-primary" />
              </label>
              <label className="space-y-2 text-sm font-semibold text-zinc-700">
                稅率
                <select value={state.twoTaxRate} onChange={(event) => update("twoTaxRate", event.target.value as TaxRateCode)} className="w-full rounded-xs border border-brand-light/40 px-3 py-2.5 font-normal outline-none focus:border-brand-primary">
                  <option value="5">5%（一般稅率）</option>
                  <option value="0">0%（零稅率）</option>
                  <option value="exempt">免稅</option>
                </select>
              </label>
              <label className="space-y-2 text-sm font-semibold text-zinc-700 sm:col-span-2">
                買受人
                <input value={state.twoBuyerName} onChange={(event) => update("twoBuyerName", event.target.value)} className="w-full rounded-xs border border-brand-light/40 px-3 py-2.5 font-normal outline-none focus:border-brand-primary" placeholder="無統編之買受人" />
              </label>
              <label className="space-y-2 text-sm font-semibold text-zinc-700 sm:col-span-2">
                銷售額（含稅）實收
                <input type="number" value={state.twoGross} onChange={(event) => update("twoGross", event.target.value)} className="w-full rounded-xs border border-brand-light/40 px-3 py-2.5 font-normal outline-none focus:border-brand-primary" placeholder="請輸入含稅總額" />
              </label>
            </>
          )}
        </div>

        <div className="rounded-xs border border-brand-light/30 bg-brand-cream/45 p-5">
          <h3 className="mb-4 text-sm font-bold text-brand-primary">即時試算結果</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-brand-light/30 pb-3">
              <span className="text-zinc-500">銷售額（未稅）</span>
              <strong>{formatMoney(result.net)}</strong>
            </div>
            <div className="flex justify-between gap-4 border-b border-brand-light/30 pb-3">
              <span className="text-zinc-500">營業稅額</span>
              <strong>{formatMoney(result.tax)}</strong>
            </div>
            <div className="flex justify-between gap-4 border-b border-brand-light/30 pb-3">
              <span className="text-zinc-500">總計金額（含稅）</span>
              <strong>{formatMoney(result.gross)}</strong>
            </div>
            <div>
              <span className="block text-zinc-500">新台幣中文大寫</span>
              <strong className="mt-1 block leading-7">{ntdUpper(result.gross)}</strong>
            </div>
          </div>

          <div className="mt-6 rounded-xs border border-brand-light/40 bg-white p-4 text-xs leading-6 text-zinc-600">
            <p className="font-semibold text-brand-charcoal">{state.invoiceType === "three" ? "統一發票（三聯式）" : "統一發票（二聯式）"}</p>
            <p>日期：{formatRocDate(activeDate)}</p>
            <p>買受人：{state.invoiceType === "three" ? state.buyerName || "必填" : twoBuyerDisplay}</p>
            <p>稅率：{rateLabel(activeRate)}</p>
            <p>總計：{formatMoney(result.gross)}</p>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={copyShareLink} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xs border border-brand-primary px-4 py-2.5 text-sm font-semibold text-brand-primary transition hover:bg-brand-primary hover:text-white active:scale-[0.98]">
              <LinkSimple size={17} weight="bold" />
              分享試算連結
            </button>
            <button type="button" onClick={copyResultText} className="brand-button whitespace-nowrap">
              <CopySimple size={17} weight="bold" />
              複製試算文字
            </button>
            <button type="button" onClick={resetInvoice} className="rounded-xs border border-brand-light/50 px-4 py-2.5 text-sm font-semibold text-zinc-600 transition hover:border-brand-primary hover:text-brand-primary active:scale-[0.98] sm:col-span-2">
              清除資料
            </button>
          </div>
          <p className="mt-3 min-h-5 text-center text-xs font-semibold text-brand-primary" aria-live="polite">
            {copyFeedback}
          </p>
        </div>
      </div>

      <HandInvoicePreview state={state} result={result} activeDate={activeDate} activeRate={activeRate} />
    </section>
  );
}

interface HandInvoicePreviewProps {
  state: InvoiceState;
  result: ReturnType<typeof computeInvoice>;
  activeDate: string;
  activeRate: TaxRateCode;
}

function HandInvoicePreview({ state, result, activeDate, activeRate }: HandInvoicePreviewProps) {
  const isThreePart = state.invoiceType === "three";
  const mark = (rate: TaxRateCode) => (activeRate === rate ? "V" : "");

  return (
    <div className="mt-8 rounded-xs border border-brand-light/35 bg-brand-cream/35 p-4">
      {isThreePart ? (
        <ThreePartInvoicePreview state={state} result={result} activeDate={activeDate} mark={mark} />
      ) : (
        <TwoPartInvoicePreview state={state} result={result} activeDate={activeDate} mark={mark} />
      )}
    </div>
  );
}

function ThreePartInvoicePreview({
  state,
  result,
  activeDate,
  mark,
}: {
  state: InvoiceState;
  result: ReturnType<typeof computeInvoice>;
  activeDate: string;
  mark: (rate: TaxRateCode) => string;
}) {
  const taxIdDigits = state.buyerTaxId.padEnd(8, " ").slice(0, 8).split("");

  return (
    <div className="overflow-x-auto">
      <h4 className="mb-3 text-sm font-bold text-brand-primary">手開發票示意（三聯式）</h4>
      <table className="w-full min-w-[760px] border-collapse bg-white text-center text-[13px] leading-6 text-brand-charcoal">
        <tbody>
          <tr>
            <th colSpan={16} className="border border-brand-light/60 px-3 py-2">
              <span className="grid grid-cols-3 items-center text-xs">
                <span className="text-left">TP 12345678</span>
                <span className="text-base font-bold tracking-[0.12em]">統 一 發 票 （ 三 聯 式 ）</span>
                <span />
              </span>
              <span className="mt-1 block">{chineseDigitDatePeriod(activeDate)}</span>
            </th>
          </tr>
          <tr>
            <td colSpan={16} className="border border-brand-light/60 px-3 py-2 text-left">
              買受人：{state.buyerName || "必填"}
            </td>
          </tr>
          <tr>
            <td colSpan={16} className="border border-brand-light/60 px-3 py-2">
              <div className="flex flex-wrap items-center gap-3 text-left">
                <span className="text-zinc-500">統一編號：</span>
                <div className="flex gap-1">
                  {taxIdDigits.map((digit, index) => (
                    <span key={index} className="flex h-7 w-7 items-center justify-center border border-brand-light/70 bg-brand-cream/60 font-semibold">
                      {digit.trim()}
                    </span>
                  ))}
                </div>
                <span className="ml-auto">
                  <span className="text-zinc-500">中華民國 </span>
                  {formatRocDate(activeDate)}
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={16} className="border border-brand-light/60 px-3 py-2 text-left">
              地址：縣市...可省略
            </td>
          </tr>
          <tr>
            <td colSpan={5} className="border border-brand-light/60 px-2 py-2">品名</td>
            <td colSpan={2} className="border border-brand-light/60 px-2 py-2">數量</td>
            <td colSpan={2} className="border border-brand-light/60 px-2 py-2">單價</td>
            <td colSpan={3} className="border border-brand-light/60 px-2 py-2">金額</td>
            <td colSpan={4} className="border border-brand-light/60 px-2 py-2">備註</td>
          </tr>
          {Array.from({ length: 3 }).map((_, index) => (
            <tr key={index}>
              <td colSpan={5} className="h-9 border border-brand-light/60" />
              <td colSpan={2} className="border border-brand-light/60" />
              <td colSpan={2} className="border border-brand-light/60" />
              <td colSpan={3} className="border border-brand-light/60" />
              {index === 2 ? <td colSpan={4} className="border border-brand-light/60 text-xs">營業人蓋統一發票專用章</td> : <td colSpan={4} className="border border-brand-light/60" />}
            </tr>
          ))}
          <tr>
            <td colSpan={9} className="border border-brand-light/60 px-2 py-2">銷售額合計</td>
            <td colSpan={3} className="border border-brand-light/60 px-2 py-2">{formatMoney(result.net)}</td>
            <td colSpan={4} rowSpan={5} className="border border-brand-light/60 text-xs text-zinc-500">發票章</td>
          </tr>
          <tr>
            <td colSpan={3} rowSpan={2} className="border border-brand-light/60 px-2 py-2">營業稅</td>
            <td colSpan={2} className="border border-brand-light/60 px-2 py-2">應稅</td>
            <td colSpan={2} className="border border-brand-light/60 px-2 py-2">零稅率</td>
            <td colSpan={2} className="border border-brand-light/60 px-2 py-2">免稅</td>
            <td colSpan={3} rowSpan={2} className="border border-brand-light/60 px-2 py-2">{formatMoney(result.tax)}</td>
          </tr>
          <tr>
            <td colSpan={2} className="border border-brand-light/60 px-2 py-2 font-bold">{mark("5")}</td>
            <td colSpan={2} className="border border-brand-light/60 px-2 py-2 font-bold">{mark("0")}</td>
            <td colSpan={2} className="border border-brand-light/60 px-2 py-2 font-bold">{mark("exempt")}</td>
          </tr>
          <tr>
            <td colSpan={9} className="border border-brand-light/60 px-2 py-2">總計</td>
            <td colSpan={3} className="border border-brand-light/60 px-2 py-2">{formatMoney(result.gross)}</td>
          </tr>
          <tr>
            <td colSpan={12} className="border border-brand-light/60 px-2 py-2 text-left">總計新台幣（中文大寫）：{ntdUpper(result.gross)}</td>
          </tr>
          <tr>
            <td colSpan={12} className="border border-brand-light/60 px-2 py-2 text-left text-xs">＊應稅、零稅率、免稅之銷售額應分別開立統一發票、並應於各該欄打「V」</td>
            <td colSpan={4} className="border border-brand-light/60 px-2 py-2">第 一 聯 存根聯</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function TwoPartInvoicePreview({
  state,
  result,
  activeDate,
  mark,
}: {
  state: InvoiceState;
  result: ReturnType<typeof computeInvoice>;
  activeDate: string;
  mark: (rate: TaxRateCode) => string;
}) {
  return (
    <div className="overflow-x-auto">
      <h4 className="mb-3 text-sm font-bold text-brand-primary">手開發票示意（二聯式）</h4>
      <table className="w-full min-w-[680px] border-collapse bg-white text-center text-[13px] leading-6 text-brand-charcoal">
        <tbody>
          <tr>
            <th colSpan={12} className="border border-brand-light/60 px-3 py-2">
              <span className="grid grid-cols-3 items-center text-xs">
                <span className="text-left">YS 12345678</span>
                <span className="text-base font-bold tracking-[0.12em]">統 一 發 票 （ 二 聯 式 ）</span>
                <span />
              </span>
              <span className="mt-1 block">{chineseDigitDatePeriod(activeDate)}</span>
            </th>
          </tr>
          <tr>
            <td colSpan={12} className="border border-brand-light/60 px-3 py-2 text-left">買受人：{state.twoBuyerName.trim() || "(無統編之買受人)"}　中華民國 {formatRocDate(activeDate)}</td>
          </tr>
          <tr>
            <td colSpan={12} className="border border-brand-light/60 px-3 py-2 text-left">地址：縣市...可省略</td>
          </tr>
          <tr>
            <td colSpan={3} className="border border-brand-light/60 px-2 py-2">品名</td>
            <td colSpan={2} className="border border-brand-light/60 px-2 py-2">數量</td>
            <td colSpan={2} className="border border-brand-light/60 px-2 py-2">單價</td>
            <td colSpan={2} className="border border-brand-light/60 px-2 py-2">金額</td>
            <td colSpan={3} className="border border-brand-light/60 px-2 py-2">備註</td>
          </tr>
          {Array.from({ length: 4 }).map((_, index) => (
            <tr key={index}>
              <td colSpan={3} className="h-9 border border-brand-light/60" />
              <td colSpan={2} className="border border-brand-light/60" />
              <td colSpan={2} className="border border-brand-light/60" />
              <td colSpan={2} className="border border-brand-light/60" />
              {index === 2 ? <td colSpan={3} className="border border-brand-light/60 text-xs">營業人蓋統一發票專用章</td> : <td colSpan={3} className="border border-brand-light/60" />}
            </tr>
          ))}
          <tr>
            <td colSpan={7} className="border border-brand-light/60 px-2 py-2">總計</td>
            <td colSpan={2} className="border border-brand-light/60 px-2 py-2">{formatMoney(result.gross)}</td>
            <td colSpan={3} rowSpan={4} className="border border-brand-light/60 text-xs text-zinc-500">發票章</td>
          </tr>
          <tr>
            <td colSpan={9} className="border border-brand-light/60 px-2 py-2 text-left">總計新台幣（中文大寫）{ntdUpper(result.gross)}</td>
          </tr>
          <tr>
            <td colSpan={3} className="border border-brand-light/60 px-2 py-2">課稅別</td>
            <td className="border border-brand-light/60 px-2 py-2">應稅</td>
            <td className="border border-brand-light/60 px-2 py-2 font-bold">{mark("5")}</td>
            <td className="border border-brand-light/60 px-2 py-2">零稅率</td>
            <td className="border border-brand-light/60 px-2 py-2 font-bold">{mark("0")}</td>
            <td className="border border-brand-light/60 px-2 py-2">免稅</td>
            <td className="border border-brand-light/60 px-2 py-2 font-bold">{mark("exempt")}</td>
          </tr>
          <tr>
            <td colSpan={9} className="border border-brand-light/60 px-2 py-2 text-left text-xs">＊應稅、零稅率、免稅之銷售額應分別開立統一發票、並應於各該欄打「V」</td>
          </tr>
          <tr>
            <td colSpan={12} className="border border-brand-light/60 px-2 py-2 text-right">第 一 聯 存根聯</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

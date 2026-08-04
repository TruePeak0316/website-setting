"use client";

import { useMemo, useState } from "react";

type InvoiceType = "three" | "two";
type TaxRateCode = "5" | "0" | "exempt";
type Source = "net" | "gross";

interface InvoiceState {
  invoiceType: InvoiceType;
  issueDate: string;
  buyerTaxId: string;
  buyerName: string;
  taxRate: TaxRateCode;
  netAmount: string;
  grossAmount: string;
  twoIssueDate: string;
  twoTaxRate: TaxRateCode;
  twoGross: string;
}

const initialInvoiceState: InvoiceState = {
  invoiceType: "three",
  issueDate: "",
  buyerTaxId: "",
  buyerName: "",
  taxRate: "5",
  netAmount: "",
  grossAmount: "",
  twoIssueDate: "",
  twoTaxRate: "5",
  twoGross: "",
};

function rateValue(rate: TaxRateCode): number {
  return rate === "5" ? 0.05 : 0;
}

function formatMoney(value: number): string {
  return Number.isFinite(value) ? Math.round(value).toLocaleString("zh-TW") : "-";
}

function validateTaxId(value: string): { ok: boolean; reason?: string } {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 8) return { ok: false, reason: "統編需為 8 位數字" };
  const weights = [1, 2, 1, 2, 1, 2, 4, 1];
  const sum = digits.split("").reduce((total, digit, index) => {
    const product = Number(digit) * weights[index];
    return total + Math.floor(product / 10) + (product % 10);
  }, 0);
  const seventhIsSeven = digits[6] === "7";
  return sum % 5 === 0 || (seventhIsSeven && (sum + 1) % 5 === 0)
    ? { ok: true }
    : { ok: false, reason: "統編檢核未通過" };
}

function ntdUpper(value: number): string {
  if (!Number.isFinite(value)) return "-";
  const units = ["元", "拾", "佰", "仟", "萬", "拾", "佰", "仟", "億", "拾", "佰", "仟", "兆"];
  const numerals = ["零", "壹", "貳", "參", "肆", "伍", "陸", "柒", "捌", "玖"];
  const integer = Math.floor(value);
  if (integer === 0) return "新台幣零元整";
  return (
    String(integer)
      .split("")
      .reverse()
      .map((digit, index) => {
        const num = Number(digit);
        return num === 0 ? `零${units[index] ?? ""}` : `${numerals[num]}${units[index] ?? ""}`;
      })
      .reverse()
      .join("") + "整"
  );
}

function formatRocDate(dateValue: string): string {
  if (!dateValue) return "-";
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.getFullYear() - 1911}年 ${String(date.getMonth() + 1).padStart(2, "0")}月 ${String(date.getDate()).padStart(2, "0")}日`;
}

function chineseDigitDatePeriod(dateValue: string): string {
  const date = dateValue ? new Date(`${dateValue}T00:00:00`) : new Date();
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
  const numerals = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  const rocYear = String(safeDate.getFullYear() - 1911)
    .split("")
    .map((digit) => numerals[Number(digit)])
    .join("");
  const startMonth = Math.floor(safeDate.getMonth() / 2) * 2 + 1;
  const endMonth = startMonth + 1;
  return `${rocYear}年${numerals[startMonth]}、${numerals[endMonth]}月份`;
}

function computeInvoice(state: InvoiceState, source: Source) {
  const type = state.invoiceType;
  const activeRate = rateValue(type === "two" ? state.twoTaxRate : state.taxRate);
  let net = Number.NaN;
  let gross = Number.NaN;
  let tax = Number.NaN;

  if (type === "two") {
    const enteredGross = Number(state.twoGross);
    if (Number.isFinite(enteredGross)) {
      gross = Math.round(enteredGross);
      net = activeRate === 0 ? gross : Math.round(gross / (1 + activeRate));
      tax = gross - net;
    }
  } else if (source === "gross" && state.grossAmount) {
    const enteredGross = Number(state.grossAmount);
    if (Number.isFinite(enteredGross)) {
      gross = Math.round(enteredGross);
      net = activeRate === 0 ? gross : Math.round(gross / (1 + activeRate));
      tax = gross - net;
    }
  } else {
    const enteredNet = Number(state.netAmount);
    if (Number.isFinite(enteredNet)) {
      net = enteredNet;
      gross = activeRate === 0 ? net : Math.round(net * (1 + activeRate));
      tax = gross - net;
    }
  }

  return { net, gross, tax };
}

export function InvoiceCalculator() {
  const [state, setState] = useState<InvoiceState>(initialInvoiceState);
  const [source, setSource] = useState<Source>("net");
  const result = useMemo(() => computeInvoice(state, source), [state, source]);
  const taxIdCheck = state.buyerTaxId ? validateTaxId(state.buyerTaxId) : null;
  const activeDate = state.invoiceType === "two" ? state.twoIssueDate : state.issueDate;
  const activeRate = state.invoiceType === "two" ? state.twoTaxRate : state.taxRate;

  function update<K extends keyof InvoiceState>(key: K, value: InvoiceState[K]) {
    setState((current) => ({ ...current, [key]: value }));
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
        <div className="grid gap-4 sm:grid-cols-2">
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
            <p>買受人：{state.invoiceType === "three" ? state.buyerName || "必填" : "可省略"}</p>
            <p>稅率：{activeRate === "5" ? "5%" : activeRate === "0" ? "0%" : "免稅"}</p>
            <p>總計：{formatMoney(result.gross)}</p>
          </div>

          <button type="button" onClick={() => setState(initialInvoiceState)} className="mt-5 w-full rounded-xs border border-brand-primary px-4 py-2.5 text-sm font-semibold text-brand-primary transition hover:bg-brand-primary hover:text-white">
            清除資料
          </button>
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
        <TwoPartInvoicePreview result={result} activeDate={activeDate} mark={mark} />
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
  result,
  activeDate,
  mark,
}: {
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
            <td colSpan={12} className="border border-brand-light/60 px-3 py-2 text-left">買受人：可省略　中華民國 {formatRocDate(activeDate)}</td>
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
            <td colSpan={12} className="border border-brand-light/60 px-2 py-2">第 一 聯 存根聯</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

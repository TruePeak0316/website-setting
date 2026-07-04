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
    </section>
  );
}

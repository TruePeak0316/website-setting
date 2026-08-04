"use client";

import { useMemo, useState } from "react";

type LandlordType = "person" | "company";
type TenantType = "company" | "person";
type ResidentStatus = "resident" | "nonresident";
type AmountMode = "tax-included" | "tax-excluded";

const NHI_RATE = 0.0211;
const VAT_RATE = 0.05;
const WH_RESIDENT = 0.1;
const WH_NONRESIDENT = 0.2;
const WH_EXEMPT_TAX = 2000;
const NHI_THRESHOLD = 20000;

function format(value: number): string {
  return Number.isFinite(value) ? Math.round(value).toLocaleString("zh-Hant-TW") : "-";
}

function computePersonRent(amount: number, mode: AmountMode, tenantType: TenantType, residentStatus: ResidentStatus) {
  const resident = residentStatus === "resident";
  const canWithhold = tenantType === "company";
  const canNhi = tenantType === "company" && resident;
  const whRate = resident ? WH_RESIDENT : WH_NONRESIDENT;

  if (!Number.isFinite(amount) || amount <= 0) {
    return { gross: Number.NaN, withholding: Number.NaN, nhi: Number.NaN, net: Number.NaN, whRate };
  }

  if (mode === "tax-included") {
    const gross = amount;
    const rawWithholding = canWithhold ? gross * whRate : 0;
    const appliedWithholding = canWithhold && resident && rawWithholding <= WH_EXEMPT_TAX ? 0 : rawWithholding;
    const withholding = Math.round(appliedWithholding);
    const nhi = Math.round(canNhi && gross >= NHI_THRESHOLD ? gross * NHI_RATE : 0);
    return { gross, withholding, nhi, net: gross - withholding - nhi, whRate };
  }

  const net = amount;
  let gross = net;
  let withholding = 0;
  let nhi = 0;
  let exempt = !canWithhold;
  if (canWithhold && resident) {
    const guess = net / (1 - whRate - (canNhi ? NHI_RATE : 0));
    exempt = guess * whRate <= WH_EXEMPT_TAX;
  }

  for (let index = 0; index < 6; index += 1) {
    gross = net + withholding + nhi;
    const nextWithholding = exempt ? 0 : Math.round(canWithhold ? gross * whRate : 0);
    const nextNhi = Math.round(canNhi && gross >= NHI_THRESHOLD ? gross * NHI_RATE : 0);
    if (nextWithholding === withholding && nextNhi === nhi) break;
    withholding = nextWithholding;
    nhi = nextNhi;
  }

  return { gross, withholding, nhi, net, whRate };
}

function computeCompanyRent(amount: number, mode: AmountMode) {
  if (!Number.isFinite(amount) || amount <= 0) return { sales: Number.NaN, vat: Number.NaN, total: Number.NaN };
  if (mode === "tax-included") {
    const total = amount;
    const sales = total / (1 + VAT_RATE);
    return { sales, vat: sales * VAT_RATE, total };
  }
  const sales = amount;
  return { sales, vat: sales * VAT_RATE, total: sales * (1 + VAT_RATE) };
}

export function RentCalculator() {
  const [landlordType, setLandlordType] = useState<LandlordType>("person");
  const [tenantType, setTenantType] = useState<TenantType>("company");
  const [residentStatus, setResidentStatus] = useState<ResidentStatus>("resident");
  const [mode, setMode] = useState<AmountMode>("tax-included");
  const [amount, setAmount] = useState("");
  const numericAmount = Number(amount);
  const personResult = useMemo(() => computePersonRent(numericAmount, mode, tenantType, residentStatus), [numericAmount, mode, tenantType, residentStatus]);
  const companyResult = useMemo(() => computeCompanyRent(numericAmount, mode), [numericAmount, mode]);

  return (
    <section className="brand-card rounded-xs p-5 sm:p-7">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-brand-charcoal">租金扣繳試算</h2>
        <p className="mt-2 text-sm text-zinc-500">試算租金扣繳、二代健保補充保費與公司房東發票 5% 營業稅。</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-zinc-700">
            房東身份
            <select value={landlordType} onChange={(event) => setLandlordType(event.target.value as LandlordType)} className="w-full rounded-xs border border-brand-light/40 px-3 py-2.5 font-normal outline-none focus:border-brand-primary">
              <option value="person">個人</option>
              <option value="company">公司</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-semibold text-zinc-700">
            房客身份
            <select value={tenantType} onChange={(event) => setTenantType(event.target.value as TenantType)} className="w-full rounded-xs border border-brand-light/40 px-3 py-2.5 font-normal outline-none focus:border-brand-primary">
              <option value="company">公司／機關／團體</option>
              <option value="person">個人（自住）</option>
            </select>
          </label>
          {landlordType === "person" ? (
            <label className="space-y-2 text-sm font-semibold text-zinc-700">
              房東稅籍狀態
              <select value={residentStatus} onChange={(event) => setResidentStatus(event.target.value as ResidentStatus)} className="w-full rounded-xs border border-brand-light/40 px-3 py-2.5 font-normal outline-none focus:border-brand-primary">
                <option value="resident">本國居民</option>
                <option value="nonresident">非本國居民</option>
              </select>
            </label>
          ) : null}
          <label className="space-y-2 text-sm font-semibold text-zinc-700">
            每期租金金額
            <input type="number" min="0" step="1" value={amount} onChange={(event) => setAmount(event.target.value)} className="w-full rounded-xs border border-brand-light/40 px-3 py-2.5 font-normal outline-none focus:border-brand-primary" placeholder="例如 30000" />
          </label>
          <fieldset className="space-y-3 sm:col-span-2">
            <legend className="text-sm font-semibold text-zinc-700">金額模式</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                { id: "tax-included" as const, label: "租金含稅（合約總額）" },
                { id: "tax-excluded" as const, label: "租金未稅（房東實拿）" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMode(item.id)}
                  className={`rounded-xs border px-4 py-3 text-sm font-semibold transition ${
                    mode === item.id ? "border-brand-primary bg-brand-primary text-white" : "border-brand-light/40 bg-white text-zinc-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="rounded-xs border border-brand-light/30 bg-brand-cream/45 p-5">
          {landlordType === "person" ? (
            <>
              <h3 className="mb-4 text-sm font-bold text-brand-primary">試算結果（房東＝個人）</h3>
              <div className="space-y-3 text-sm">
                <ResultRow label="每期租金（給付總額）" value={format(personResult.gross)} />
                <ResultRow label={`扣繳所得稅（${Math.round(personResult.whRate * 100)}%）`} value={format(personResult.withholding)} />
                <ResultRow label="二代健保補充保費（2.11%）" value={format(personResult.nhi)} />
                <ResultRow label="扣繳與健保合計" value={format(personResult.withholding + personResult.nhi)} />
                <ResultRow label="房東實拿" value={format(personResult.net)} />
              </div>
            </>
          ) : (
            <>
              <h3 className="mb-4 text-sm font-bold text-brand-primary">試算結果（房東＝公司）</h3>
              <div className="space-y-3 text-sm">
                <ResultRow label="銷售額（未稅）" value={format(companyResult.sales)} />
                <ResultRow label="營業稅（5%）" value={format(companyResult.vat)} />
                <ResultRow label="發票總金額（含稅）" value={format(companyResult.total)} />
              </div>
            </>
          )}
          <p className="mt-5 text-xs leading-6 text-zinc-500">
            此工具為一般試算，實際仍以主管機關規定與個案契約內容為準。若承租人負擔扣繳或補充保費，該金額可能須併入給付總額。
          </p>
          <button type="button" onClick={() => setAmount("")} className="mt-5 w-full rounded-xs border border-brand-primary px-4 py-2.5 text-sm font-semibold text-brand-primary transition hover:bg-brand-primary hover:text-white">
            重新填寫
          </button>
        </div>
      </div>
    </section>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-brand-light/30 pb-3">
      <span className="text-zinc-500">{label}</span>
      <strong className="text-brand-charcoal">{value}</strong>
    </div>
  );
}

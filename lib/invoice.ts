export type InvoiceType = "three" | "two";
export type TaxRateCode = "5" | "0" | "exempt";
export type InvoiceSource = "net" | "gross";

export interface InvoiceState {
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

export const initialInvoiceState: InvoiceState = {
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

export function formatMoney(value: number): string {
  return Number.isFinite(value) ? Math.round(value).toLocaleString("zh-TW") : "-";
}

export function validateTaxId(value: string): { ok: boolean; reason?: string } {
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

export function ntdUpper(value: number): string {
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

export function formatRocDate(dateValue: string): string {
  if (!dateValue) return "-";
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.getFullYear() - 1911}年 ${String(date.getMonth() + 1).padStart(2, "0")}月 ${String(date.getDate()).padStart(2, "0")}日`;
}

export function chineseDigitDatePeriod(dateValue: string): string {
  const date = dateValue ? new Date(`${dateValue}T00:00:00`) : new Date();
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
  const numerals = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  const monthNames = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];
  const rocYear = String(safeDate.getFullYear() - 1911)
    .split("")
    .map((digit) => numerals[Number(digit)])
    .join("");
  const startMonth = Math.floor(safeDate.getMonth() / 2) * 2 + 1;
  const endMonth = startMonth + 1;
  return `${rocYear}年${monthNames[startMonth - 1]}、${monthNames[endMonth - 1]}月份`;
}

export function rateLabel(rate: TaxRateCode): string {
  return rate === "5" ? "5%" : rate === "0" ? "0%" : "免稅";
}

export function parseInvoiceQuery(params: URLSearchParams): { state: InvoiceState; source: InvoiceSource } | null {
  const keys = ["type", "invoiceType", "date", "twoDate", "taxId", "buyer", "net", "gross", "twoGross", "rate", "twoRate", "source"];
  if (!keys.some((key) => params.has(key))) return null;

  const invoiceType: InvoiceType = params.get("invoiceType") === "two" || params.get("type") === "duplicate" ? "two" : "three";
  const parsedRate = params.get("rate");
  const parsedTwoRate = params.get("twoRate") ?? parsedRate;
  const validRate: TaxRateCode = parsedRate === "0" || parsedRate === "exempt" ? parsedRate : "5";
  const validTwoRate: TaxRateCode = parsedTwoRate === "0" || parsedTwoRate === "exempt" ? parsedTwoRate : "5";
  const source: InvoiceSource = params.get("source") === "gross" || (!params.has("source") && params.has("gross")) ? "gross" : "net";

  return {
    state: {
      invoiceType,
      issueDate: invoiceType === "three" ? params.get("date") ?? "" : "",
      buyerTaxId: invoiceType === "three" ? (params.get("taxId") ?? "").replace(/\D/g, "").slice(0, 8) : "",
      buyerName: invoiceType === "three" ? params.get("buyer") ?? "" : "",
      taxRate: invoiceType === "three" ? validRate : "5",
      netAmount: invoiceType === "three" ? params.get("net") ?? "" : "",
      grossAmount: invoiceType === "three" ? params.get("gross") ?? "" : "",
      twoIssueDate: invoiceType === "two" ? params.get("twoDate") ?? params.get("date") ?? "" : "",
      twoTaxRate: invoiceType === "two" ? validTwoRate : "5",
      twoGross: invoiceType === "two" ? params.get("twoGross") ?? params.get("gross") ?? "" : "",
    },
    source,
  };
}

export function buildInvoiceQuery(state: InvoiceState, source: InvoiceSource): URLSearchParams {
  const params = new URLSearchParams({
    type: state.invoiceType === "two" ? "duplicate" : "triplicate",
    invoiceType: state.invoiceType,
    source: state.invoiceType === "two" ? "gross" : source,
  });

  if (state.invoiceType === "three") {
    if (state.issueDate) params.set("date", state.issueDate);
    if (state.buyerTaxId) params.set("taxId", state.buyerTaxId);
    if (state.buyerName) params.set("buyer", state.buyerName);
    params.set("rate", state.taxRate);
    const amount = source === "net" ? state.netAmount : state.grossAmount;
    if (amount) params.set(source, amount);
    return params;
  }

  if (state.twoIssueDate) {
    params.set("date", state.twoIssueDate);
    params.set("twoDate", state.twoIssueDate);
  }
  params.set("rate", state.twoTaxRate);
  params.set("twoRate", state.twoTaxRate);
  if (state.twoGross) {
    params.set("gross", state.twoGross);
    params.set("twoGross", state.twoGross);
  }
  return params;
}

export function computeInvoice(state: InvoiceState, source: InvoiceSource) {
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

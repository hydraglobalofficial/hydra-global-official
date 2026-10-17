export type MoneyFormat = {
  /** ISO-ish code for invoices / couriers — BDT, USD, EUR… */
  code: string;
  /** Display symbol — ৳, $, €, টাকা… */
  symbol: string;
  /** Where the symbol sits relative to the number */
  position: "before" | "after";
  /** Intl locale for grouping separators */
  locale: string;
  /** Fraction digits (BDT retail is usually 0) */
  decimals: number;
};

export type MoneyPresetId = "bdt" | "bdt-taka" | "usd" | "eur" | "custom";

export type CurrencyContent = MoneyFormat & {
  preset: MoneyPresetId;
};

export const MONEY_PRESETS: Record<
  Exclude<MoneyPresetId, "custom">,
  { label: string; format: MoneyFormat; example: number }
> = {
  bdt: {
    label: "Taka — ৳1,200",
    example: 1200,
    format: { code: "BDT", symbol: "৳", position: "before", locale: "en-BD", decimals: 0 },
  },
  "bdt-taka": {
    label: "Taka — 1,200 টাকা",
    example: 1200,
    format: { code: "BDT", symbol: "টাকা", position: "after", locale: "en-BD", decimals: 0 },
  },
  usd: {
    label: "US Dollar — $1,200",
    example: 1200,
    format: { code: "USD", symbol: "$", position: "before", locale: "en-US", decimals: 0 },
  },
  eur: {
    label: "Euro — €1,200",
    example: 1200,
    format: { code: "EUR", symbol: "€", position: "before", locale: "de-DE", decimals: 0 },
  },
};

export const defaultCurrencyContent: CurrencyContent = {
  preset: "bdt",
  ...MONEY_PRESETS.bdt.format,
};

let activeFormat: MoneyFormat = { ...defaultCurrencyContent };

/** Bind the active display format for this request / client tree. */
export function bindMoneyFormat(format: MoneyFormat) {
  activeFormat = format;
}

export function getActiveMoneyFormat(): MoneyFormat {
  return activeFormat;
}

export function formatMoney(amount: number, format: MoneyFormat = activeFormat) {
  const safe = Number.isFinite(amount) ? amount : 0;
  const number = new Intl.NumberFormat(format.locale || "en-US", {
    maximumFractionDigits: format.decimals,
    minimumFractionDigits: format.decimals,
  }).format(safe);

  const symbol = (format.symbol || "").trim() || format.code || "$";
  if (format.position === "after") {
    return `${number} ${symbol}`;
  }
  // Common currency symbols sit flush; word symbols get a space
  if (symbol.length > 2 || /[a-zঅ-হা]/i.test(symbol)) {
    return `${symbol} ${number}`;
  }
  return `${symbol}${number}`;
}

/** Short label for filter legends — "$" / "৳" / "BDT". */
export function moneySymbol(format: MoneyFormat = activeFormat) {
  return (format.symbol || format.code || "$").trim();
}

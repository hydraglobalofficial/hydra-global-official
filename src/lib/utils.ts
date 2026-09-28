type ClassValue = string | false | null | undefined;

export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}

const bdt = new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 });

export function formatPrice(amount: number) {
  return `৳${bdt.format(amount)}`;
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function discountPercent(price: number, compareAt?: number | null) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/\+/g, " plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** HYDXXXXXXXXX → HYD-XXXX-XXXXX for display and printing. */
export function formatCode(code: string) {
  return code.replace(/^(.{3})(.{4})(.+)$/, "$1-$2-$3");
}

export function absoluteUrl(path = "/") {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return new URL(path, base).toString();
}

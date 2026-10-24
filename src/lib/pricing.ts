import type { ShippingContent } from "@/content/site-sections";

/** Countries offered at checkout (Bangladesh first). */
export const countries = [
  "Bangladesh",
  "United States",
  "United Kingdom",
  "United Arab Emirates",
  "Singapore",
  "India",
  "Canada",
  "Australia",
  "Germany",
  "Japan",
  "Other",
] as const;

/** Cities offered at checkout. Delivery price comes from admin shipping settings. */
export const cities = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Khulna",
  "Rajshahi",
  "New York",
  "London",
  "Dubai",
  "Singapore",
  "Tokyo",
  "Sydney",
  "Toronto",
  "Berlin",
  "Other",
] as const;

/** Admin-set delivery fee. Free is 0; paid is the flat amount, added to the order total. */
export function shippingFee(subtotal: number, settings: Pick<ShippingContent, "mode" | "amount">) {
  if (subtotal <= 0) return 0;
  if (settings.mode === "free") return 0;
  return Math.max(0, Math.round(Number(settings.amount) || 0));
}

export const paymentMethods = [
  { value: "COD", label: "Pay on delivery", description: "Pay when your order arrives (where available)", enabled: true },
  { value: "BKASH", label: "Mobile wallet", description: "Coming soon", enabled: false },
  { value: "NAGAD", label: "Local wallet", description: "Coming soon", enabled: false },
  { value: "SSLCOMMERZ", label: "Card / online pay", description: "Coming soon", enabled: false },
] as const;

export type PaymentMethodValue = (typeof paymentMethods)[number]["value"];

export function isPaymentEnabled(method: string) {
  return paymentMethods.some((m) => m.value === method && m.enabled);
}

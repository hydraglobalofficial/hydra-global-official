import { siteConfig } from "@/config/site";

/** Major hubs get express shipping; everything else is standard. */
export const cities = [
  "New York",
  "London",
  "Dubai",
  "Singapore",
  "Tokyo",
  "Sydney",
  "Toronto",
  "Berlin",
  "Dhaka",
  "Other",
] as const;

const expressCities = new Set<string>(["New York", "London", "Dubai", "Singapore", "Tokyo", "Sydney", "Toronto", "Berlin", "Dhaka"]);

export function shippingFee(subtotal: number, city: string) {
  if (subtotal <= 0) return 0;
  if (subtotal >= siteConfig.freeShippingThreshold) return 0;
  return expressCities.has(city) ? siteConfig.shippingFee.express : siteConfig.shippingFee.standard;
}

export function shippingLabel(city: string) {
  return expressCities.has(city) ? "express" : "standard";
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

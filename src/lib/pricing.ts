import { siteConfig } from "@/config/site";

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

/** Major hubs get express shipping; everything else is standard. */
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

const expressCities = new Set<string>([
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "New York",
  "London",
  "Dubai",
  "Singapore",
  "Tokyo",
  "Sydney",
  "Toronto",
  "Berlin",
]);

const expressCountries = new Set<string>(["Bangladesh"]);

export function shippingFee(subtotal: number, city: string, country = "") {
  if (subtotal <= 0) return 0;
  if (subtotal >= siteConfig.freeShippingThreshold) return 0;
  if (expressCities.has(city) || expressCountries.has(country)) {
    return siteConfig.shippingFee.express;
  }
  return siteConfig.shippingFee.standard;
}

export function shippingLabel(city: string, country = "") {
  return expressCities.has(city) || expressCountries.has(country) ? "express" : "standard";
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

import { siteConfig } from "@/config/site";

export const cities = ["Dhaka", "Chattogram", "Sylhet", "Khulna", "Rajshahi", "Barishal", "Rangpur", "Mymensingh", "Other"] as const;

export function shippingFee(subtotal: number, city: string) {
  if (subtotal <= 0) return 0;
  if (subtotal >= siteConfig.freeShippingThreshold) return 0;
  return city === "Dhaka" ? siteConfig.shippingFee.insideDhaka : siteConfig.shippingFee.outsideDhaka;
}

export const paymentMethods = [
  { value: "COD", label: "Cash on Delivery", description: "Pay when your order arrives", enabled: true },
  { value: "BKASH", label: "bKash", description: "Coming soon", enabled: false },
  { value: "NAGAD", label: "Nagad", description: "Coming soon", enabled: false },
  { value: "SSLCOMMERZ", label: "Card / Mobile Banking", description: "Coming soon via SSLCommerz", enabled: false },
] as const;

export type PaymentMethodValue = (typeof paymentMethods)[number]["value"];

export function isPaymentEnabled(method: string) {
  return paymentMethods.some((m) => m.value === method && m.enabled);
}

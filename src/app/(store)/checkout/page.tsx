import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <div className="container-page py-12 md:py-16">
      <h1 className="mb-10 text-4xl font-semibold tracking-tight md:text-5xl">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}

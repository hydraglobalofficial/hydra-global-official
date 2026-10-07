import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <div className="container-page py-8 sm:py-12 md:py-16">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight sm:mb-10 sm:text-4xl md:text-5xl">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}

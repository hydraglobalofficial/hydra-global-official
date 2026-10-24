import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { LogoMark } from "@/components/layout/logo";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <div className="container-page py-8 sm:py-12 md:py-16">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight sm:mb-8 sm:text-4xl md:text-5xl">Checkout</h1>
      <div className="mb-8 flex items-center gap-4 rounded-2xl border border-line bg-surface px-4 py-3 sm:px-5">
        <LogoMark priority />
        <div className="min-w-0">
          <p className="text-sm font-semibold">{siteConfig.legalName}</p>
          <p className="text-sm text-muted">{siteConfig.address}</p>
        </div>
      </div>
      <CheckoutForm />
    </div>
  );
}

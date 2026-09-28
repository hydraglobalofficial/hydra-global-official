import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = { title: "Cart", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="container-page py-12 md:py-16">
      <h1 className="mb-10 text-4xl font-semibold tracking-tight md:text-5xl">Your cart</h1>
      <CartView />
    </div>
  );
}

"use client";

import { ArrowRight, Lock } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/primitives";
import { formatPrice } from "@/lib/utils";
import { CartLineItem } from "./cart-line-item";
import { FreeShippingMeter } from "./cart-drawer";
import { useCart } from "./cart-provider";

export function CartView() {
  const { lines, subtotal, hydrated } = useCart();

  if (!hydrated) return <div className="h-64 animate-pulse rounded-3xl bg-surface" />;
  if (lines.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Browse precision-cut protection for your exact device."
        action={<ButtonLink href="/shop">Start shopping</ButtonLink>}
      />
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_24rem]">
      <ul className="divide-y divide-line rounded-3xl border border-line bg-surface px-6">
        {lines.map((line) => (
          <CartLineItem key={`${line.productId}:${line.variantId}`} line={line} />
        ))}
      </ul>
      <aside className="glass h-fit space-y-6 rounded-3xl p-6 lg:sticky lg:top-28">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <FreeShippingMeter subtotal={subtotal} />
        <div className="flex justify-between text-sm">
          <span className="text-muted">Subtotal</span>
          <span className="font-mono tabular-nums">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Shipping</span>
          <span className="text-muted">Calculated at checkout</span>
        </div>
        <ButtonLink href="/checkout" size="lg" className="w-full">
          Checkout <ArrowRight size={18} />
        </ButtonLink>
        <p className="flex items-center justify-center gap-2 text-xs text-subtle">
          <Lock size={12} /> Secure checkout · Pay on delivery where available
        </p>
      </aside>
    </div>
  );
}

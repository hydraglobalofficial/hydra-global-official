"use client";

import { useEffect } from "react";
import { ShoppingBag, Truck, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn, formatPrice } from "@/lib/utils";
import { CartLineItem } from "./cart-line-item";
import { useCart } from "./cart-provider";

export function FreeShippingMeter({ subtotal }: { subtotal: number }) {
  const threshold = siteConfig.freeShippingThreshold;
  const remaining = Math.max(0, threshold - subtotal);
  const progress = Math.min(100, (subtotal / threshold) * 100);
  return (
    <div className="space-y-2">
      <p className="flex items-center gap-2 text-xs text-muted">
        <Truck size={14} className="text-accent" />
        {remaining > 0 ? (
          <>
            Add <span className="font-mono text-fg">{formatPrice(remaining)}</span> more for free delivery
          </>
        ) : (
          <span className="text-success">You&apos;ve unlocked free delivery</span>
        )}
      </p>
      <div className="h-1 overflow-hidden rounded-full bg-white/10 light:bg-black/10">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function CartDrawer() {
  const { lines, subtotal, count, isOpen, close } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <div className={cn("fixed inset-0 z-[70]", !isOpen && "pointer-events-none")} aria-hidden={!isOpen}>
      <div
        className={cn("absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 light:bg-black/40", isOpen ? "opacity-100" : "opacity-0")}
        onClick={close}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-line bg-bg pt-[max(0.75rem,env(safe-area-inset-top,0px))] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-center justify-between border-b border-line px-4 py-4 sm:px-6 sm:py-5">
          <h2 className="text-lg font-semibold">
            Your Cart <span className="font-mono text-sm text-muted">({count})</span>
          </h2>
          <button
            type="button"
            onClick={close}
            className="touch-target grid place-items-center rounded-full text-muted hover:bg-white/5 hover:text-fg light:hover:bg-black/5"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center sm:px-6">
            <div className="grid size-16 place-items-center rounded-2xl border border-line bg-surface-2">
              <ShoppingBag className="text-muted" />
            </div>
            <p className="font-medium">Your cart is empty</p>
            <p className="text-sm text-muted">Find armor built for your exact device.</p>
            <ButtonLink href="/shop" onClick={close} variant="outline" className="min-h-11">
              Browse products
            </ButtonLink>
          </div>
        ) : (
          <>
            <div className="border-b border-line px-4 py-4 sm:px-6">
              <FreeShippingMeter subtotal={subtotal} />
            </div>
            <ul className="flex-1 divide-y divide-line overflow-y-auto overscroll-contain px-4 sm:px-6">
              {lines.map((line) => (
                <CartLineItem key={`${line.productId}:${line.variantId}`} line={line} onNavigate={close} />
              ))}
            </ul>
            <footer className="space-y-4 border-t border-line px-4 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted">Subtotal</span>
                <span className="font-mono text-lg tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-subtle">Shipping calculated at checkout.</p>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <ButtonLink href="/cart" onClick={close} variant="secondary" className="min-h-11">
                  View cart
                </ButtonLink>
                <ButtonLink href="/checkout" onClick={close} className="min-h-11">
                  Checkout
                </ButtonLink>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

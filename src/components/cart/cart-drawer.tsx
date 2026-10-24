"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, ShoppingBag, Truck, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { shippingFee } from "@/lib/pricing";
import { useShipping } from "@/components/shipping/shipping-provider";
import { cn, formatPrice } from "@/lib/utils";
import { CartLineItem } from "./cart-line-item";
import { CartSuggestions } from "./cart-suggestions";
import { useCart } from "./cart-provider";

export function FreeShippingMeter({ subtotal }: { subtotal: number }) {
  const shipping = shippingFee(subtotal, useShipping());
  const free = shipping === 0;

  return (
    <div
      className={cn(
        "rounded-xl px-3.5 py-3",
        free ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-zinc-100 dark:bg-white/[0.06]",
      )}
    >
      <p
        className={cn(
          "flex items-center justify-between gap-2 text-[12px] leading-snug",
          free ? "font-medium text-emerald-700 dark:text-emerald-400" : "text-zinc-600 dark:text-zinc-400",
        )}
      >
        <span className="inline-flex items-center gap-2">
          <Truck size={14} className="shrink-0" />
          Shipping
        </span>
        <span className="font-mono font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{formatPrice(shipping)}</span>
      </p>
    </div>
  );
}

export function CartDrawer() {
  const { lines, subtotal, count, isOpen, close } = useCart();
  const shipping = shippingFee(subtotal, useShipping());
  const pathname = usePathname();
  const onCheckout = !!pathname && (pathname === "/checkout" || pathname.startsWith("/checkout/"));

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!isOpen || onCheckout) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onCheckout, close]);

  if (onCheckout) return null;

  return (
    <div
      className={cn("fixed inset-0 z-[70]", !isOpen && "pointer-events-none")}
      aria-hidden={!isOpen}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity duration-300 dark:bg-black/70",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={close}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={cn(
          "absolute inset-y-0 right-0 flex w-[min(100%,23rem)] flex-col overflow-hidden",
          "bg-white text-zinc-900 shadow-[-12px_0_40px_-20px_rgba(0,0,0,0.35)]",
          "dark:bg-[#0c0e14] dark:text-zinc-100 dark:shadow-[-12px_0_40px_-12px_rgba(0,0,0,0.85)]",
          "pt-[max(0.5rem,env(safe-area-inset-top,0px))] transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex shrink-0 items-center justify-between px-5 pb-3 pt-3">
          <h2 className="text-[15px] font-semibold tracking-tight text-zinc-950 dark:text-white">
            Cart
            <span className="ml-1.5 font-mono text-[13px] font-normal text-zinc-400">({count})</span>
          </h2>
          <button
            type="button"
            onClick={close}
            className="grid size-8 place-items-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center">
            <div className="grid size-14 place-items-center rounded-2xl bg-zinc-100 dark:bg-white/[0.06]">
              <ShoppingBag size={22} className="text-zinc-400" />
            </div>
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">Your cart is empty</p>
              <p className="mt-1 text-sm text-zinc-500">Find armor built for your device.</p>
            </div>
            <ButtonLink
              href="/shop"
              onClick={close}
              className="min-h-11 rounded-full bg-zinc-950 px-6 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
            >
              Browse products
            </ButtonLink>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="px-5 pb-1">
                <FreeShippingMeter subtotal={subtotal} />
              </div>

              <ul className="divide-y divide-zinc-100 px-5 dark:divide-white/8">
                {lines.map((line) => (
                  <CartLineItem key={`${line.productId}:${line.variantId}`} line={line} onNavigate={close} />
                ))}
              </ul>

              <CartSuggestions onNavigate={close} />
            </div>

            <footer className="shrink-0 border-t border-zinc-100 bg-white px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] dark:border-white/10 dark:bg-[#0c0e14]">
              <div className="mb-1 flex items-baseline justify-between gap-3">
                <span className="text-sm text-zinc-500">Subtotal</span>
                <span className="font-mono text-sm tabular-nums text-zinc-700 dark:text-zinc-200">{formatPrice(subtotal)}</span>
              </div>
              <div className="mb-1 flex items-baseline justify-between gap-3">
                <span className="text-sm text-zinc-500">Shipping</span>
                <span className="font-mono text-sm tabular-nums text-zinc-700 dark:text-zinc-200">{formatPrice(shipping)}</span>
              </div>
              <div className="mb-4 flex items-baseline justify-between gap-3 border-t border-zinc-100 pt-2 dark:border-white/10">
                <span className="text-sm font-medium text-zinc-950 dark:text-white">Total</span>
                <span className="font-mono text-xl font-semibold tabular-nums tracking-tight text-zinc-950 dark:text-white">
                  {formatPrice(subtotal + shipping)}
                </span>
              </div>

              <ButtonLink
                href="/checkout"
                onClick={close}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-zinc-950 text-[14px] font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Checkout
                <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink
                href="/cart"
                onClick={close}
                variant="ghost"
                className="mt-1.5 flex min-h-10 w-full items-center justify-center rounded-full text-[13px] font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
              >
                View cart
              </ButtonLink>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

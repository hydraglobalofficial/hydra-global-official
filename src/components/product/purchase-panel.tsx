"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShieldCheck, ShoppingBag, Zap } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { alertToast } from "@/lib/swal";
import { cn, discountPercent, formatPrice } from "@/lib/utils";

type Variant = { id: string; name: string; priceOverride: number | null; stock: number };

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    compareAtPrice: number | null;
    stock: number;
    image: string | null;
  };
  variants: Variant[];
};

export function PurchasePanel({ product, variants }: Props) {
  const router = useRouter();
  const { add } = useCart();
  const [variantId, setVariantId] = useState<string | null>(variants.find((v) => v.stock > 0)?.id ?? variants[0]?.id ?? null);
  const [quantity, setQuantity] = useState(1);

  const variant = variants.find((v) => v.id === variantId) ?? null;
  const price = variant?.priceOverride ?? product.price;
  const available = variant ? Math.min(variant.stock, product.stock) : product.stock;
  const off = discountPercent(price, product.compareAtPrice);
  const soldOut = available <= 0;

  function addToCart(openDrawer = true) {
    add(
      {
        productId: product.id,
        variantId,
        slug: product.slug,
        name: product.name,
        variantName: variant?.name ?? null,
        price,
        image: product.image,
        maxQuantity: available,
      },
      quantity,
      { openDrawer },
    );
    if (openDrawer) {
      void alertToast("Added to cart", "success");
    } else {
      void alertToast("Taking you to checkout…", "success");
      router.push("/checkout");
    }
  }

  return (
    <div className="space-y-7">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-4xl tabular-nums">{formatPrice(price)}</span>
        {off > 0 && (
          <>
            <span className="font-mono text-lg text-subtle line-through tabular-nums">{formatPrice(product.compareAtPrice!)}</span>
            <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">Save {off}%</span>
          </>
        )}
      </div>

      {variants.length > 0 && (
        <fieldset className="space-y-3">
          <legend className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
            Finish — <span className="text-fg">{variant?.name}</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  setVariantId(v.id);
                  setQuantity(1);
                }}
                disabled={v.stock <= 0}
                aria-pressed={v.id === variantId}
                className={cn(
                  "rounded-full border px-5 py-2.5 text-sm transition-all disabled:cursor-not-allowed disabled:line-through disabled:opacity-40",
                  v.id === variantId
                    ? "border-accent bg-accent/10 text-fg shadow-[0_0_20px_-6px_var(--color-accent)]"
                    : "border-line text-muted hover:border-line-strong hover:text-fg",
                )}
              >
                {v.name}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex items-center gap-2 text-sm">
        <span className={cn("size-2 rounded-full", soldOut ? "bg-danger" : available < 10 ? "bg-warning" : "bg-success")} />
        <span className="text-muted">
          {soldOut ? "Out of stock" : available < 10 ? `Only ${available} left — ships today` : "In stock — ships within 24h"}
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex h-13 items-center justify-between rounded-full border border-line px-2 sm:w-36">
          <button
            type="button"
            className="grid size-9 place-items-center rounded-full text-muted hover:bg-white/5 hover:text-fg"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="font-mono tabular-nums" aria-live="polite">{quantity}</span>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-full text-muted hover:bg-white/5 hover:text-fg disabled:opacity-30"
            onClick={() => setQuantity((q) => Math.min(available, q + 1))}
            disabled={quantity >= available}
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
        <Button size="lg" variant="secondary" className="flex-1" disabled={soldOut} onClick={() => addToCart(true)}>
          <ShoppingBag size={18} /> Add to cart
        </Button>
        <Button size="lg" className="flex-1" disabled={soldOut} onClick={() => addToCart(false)}>
          <Zap size={18} /> Buy now
        </Button>
      </div>

      <p className="flex items-center gap-2 text-xs text-muted">
        <ShieldCheck size={14} className="text-accent" />
        100% genuine HYDRA — backed by a 12-month warranty
      </p>
    </div>
  );
}

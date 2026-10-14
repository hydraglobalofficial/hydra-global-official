"use client";

import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { ProductImage } from "@/components/product/product-image";
import { formatPrice } from "@/lib/utils";
import { useCart, type CartLine } from "./cart-provider";

export function CartLineItem({ line, onNavigate }: { line: CartLine; onNavigate?: () => void }) {
  const { setQuantity, remove } = useCart();

  return (
    <li className="flex gap-3 py-4 sm:gap-4 sm:py-5">
      <Link
        href={`/product/${line.slug}`}
        onClick={onNavigate}
        className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-line bg-transparent sm:size-20"
      >
        {line.image && (
          <ProductImage src={line.image} alt={line.name} fill sizes="80px" className="object-contain p-2" />
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="min-w-0">
            <Link href={`/product/${line.slug}`} onClick={onNavigate} className="line-clamp-2 text-sm font-medium hover:text-accent">
              {line.name}
            </Link>
            {line.variantName && <p className="mt-0.5 text-xs text-muted">{line.variantName}</p>}
          </div>
          <button
            type="button"
            onClick={() => remove(line.productId, line.variantId)}
            className="touch-target -mr-1 -mt-1 grid shrink-0 place-items-center rounded-full text-subtle hover:bg-white/5 hover:text-fg"
            aria-label={`Remove ${line.name}`}
          >
            <X size={14} />
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex h-11 items-center rounded-full border border-line">
            <button
              type="button"
              className="grid size-11 place-items-center text-muted hover:text-fg"
              onClick={() => setQuantity(line.productId, line.variantId, line.quantity - 1)}
              aria-label="Decrease quantity"
            >
              <Minus size={12} />
            </button>
            <span className="w-6 text-center font-mono text-xs tabular-nums">{line.quantity}</span>
            <button
              type="button"
              className="grid size-11 place-items-center text-muted hover:text-fg disabled:opacity-30"
              onClick={() => setQuantity(line.productId, line.variantId, line.quantity + 1)}
              disabled={line.quantity >= line.maxQuantity}
              aria-label="Increase quantity"
            >
              <Plus size={12} />
            </button>
          </div>
          <span className="font-mono text-sm tabular-nums">{formatPrice(line.price * line.quantity)}</span>
        </div>
      </div>
    </li>
  );
}

"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { ProductImage } from "@/components/product/product-image";
import { formatPrice } from "@/lib/utils";
import { useCart, type CartLine } from "./cart-provider";

export function CartLineItem({ line, onNavigate }: { line: CartLine; onNavigate?: () => void }) {
  const { setQuantity, remove } = useCart();

  return (
    <li className="flex gap-3 py-4">
      <Link
        href={`/product/${line.slug}`}
        onClick={onNavigate}
        className="relative size-[4.5rem] shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900"
      >
        {line.image ? (
          <ProductImage src={line.image} alt={line.name} fill sizes="72px" className="object-contain p-1.5" />
        ) : null}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/product/${line.slug}`}
            onClick={onNavigate}
            className="min-w-0 text-[13px] font-medium leading-snug text-zinc-900 transition hover:opacity-70 dark:text-zinc-100"
          >
            <span className="line-clamp-2">{line.name}</span>
            {line.variantName ? (
              <span className="mt-0.5 block text-[11px] font-normal text-zinc-500">{line.variantName}</span>
            ) : null}
          </Link>
          <p className="shrink-0 font-mono text-[13px] font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
            {formatPrice(line.price * line.quantity)}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <div className="inline-flex h-8 items-center rounded-lg bg-zinc-100 dark:bg-white/8">
            <button
              type="button"
              className="grid size-8 place-items-center text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              onClick={() => setQuantity(line.productId, line.variantId, line.quantity - 1)}
              aria-label="Decrease quantity"
            >
              <Minus size={12} strokeWidth={2.25} />
            </button>
            <span className="min-w-6 text-center font-mono text-xs tabular-nums text-zinc-900 dark:text-zinc-100">
              {line.quantity}
            </span>
            <button
              type="button"
              className="grid size-8 place-items-center text-zinc-500 transition hover:text-zinc-900 disabled:opacity-30 dark:text-zinc-400 dark:hover:text-white"
              onClick={() => setQuantity(line.productId, line.variantId, line.quantity + 1)}
              disabled={line.quantity >= line.maxQuantity}
              aria-label="Increase quantity"
            >
              <Plus size={12} strokeWidth={2.25} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => remove(line.productId, line.variantId)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400 transition hover:text-red-600 dark:hover:text-red-400"
            aria-label={`Remove ${line.name}`}
          >
            <Trash2 size={12} />
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

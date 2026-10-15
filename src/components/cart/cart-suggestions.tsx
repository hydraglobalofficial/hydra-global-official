"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { ProductImage } from "@/components/product/product-image";
import { formatPrice } from "@/lib/utils";
import { useCart } from "./cart-provider";

type Suggestion = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  stock: number;
};

export function CartSuggestions({ onNavigate }: { onNavigate?: () => void }) {
  const { lines, cartDeviceSlugs, add } = useCart();
  const [items, setItems] = useState<Suggestion[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(() => new Set());
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!cartDeviceSlugs.length) {
      setItems([]);
      setLabel(null);
      return;
    }

    const exclude = lines.map((l) => l.productId).join(",");
    const devices = cartDeviceSlugs.join(",");
    const deviceLabel =
      lines.find((l) => l.deviceLabel)?.deviceLabel ||
      cartDeviceSlugs[0]?.replace(/-/g, " ") ||
      null;

    let cancelled = false;
    const ctrl = new AbortController();

    void (async () => {
      try {
        const res = await fetch(
          `/api/cart/suggestions?devices=${encodeURIComponent(devices)}&exclude=${encodeURIComponent(exclude)}`,
          { signal: ctrl.signal },
        );
        if (!res.ok) return;
        const data = (await res.json()) as { items?: Suggestion[] };
        if (cancelled) return;
        setItems((data.items ?? []).slice(0, 3));
        setLabel(deviceLabel);
      } catch {
        /* abort / network — ignore */
      }
    })();

    return () => {
      cancelled = true;
      ctrl.abort();
    };
  }, [cartDeviceSlugs, lines]);

  const visible = items.filter((item) => !dismissed.has(item.id));
  if (!visible.length) return null;

  return (
    <div className="px-5 pb-5 pt-1">
      <div className="rounded-2xl bg-zinc-50 px-3.5 py-3.5 dark:bg-white/[0.04]">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
              Complete the set
            </p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-500">
              For your {label || "device"}
            </p>
          </div>
        </div>

        <ul className="space-y-1">
          {visible.map((item) => (
            <li key={item.id} className="group flex items-center gap-2.5 rounded-xl px-1 py-1.5 transition hover:bg-white dark:hover:bg-white/[0.04]">
              <Link
                href={`/product/${item.slug}`}
                onClick={onNavigate}
                className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-white dark:bg-zinc-900"
              >
                {item.image ? (
                  <ProductImage src={item.image} alt={item.name} fill sizes="40px" className="object-contain p-0.5" />
                ) : null}
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/product/${item.slug}`}
                  onClick={onNavigate}
                  className="line-clamp-1 text-[12px] font-medium text-zinc-900 dark:text-zinc-100"
                >
                  {item.name}
                </Link>
                <p className="mt-0.5 font-mono text-[11px] tabular-nums text-zinc-500">
                  {formatPrice(item.price)}
                </p>
              </div>
              <button
                type="button"
                disabled={item.stock <= 0}
                aria-label={`Add ${item.name}`}
                className="inline-flex h-7 shrink-0 items-center gap-1 rounded-full bg-zinc-900 px-2.5 text-[11px] font-medium text-white transition hover:bg-blue-700 disabled:opacity-40 dark:bg-white dark:text-zinc-900 dark:hover:bg-blue-400"
                onClick={() => {
                  add(
                    {
                      productId: item.id,
                      variantId: null,
                      slug: item.slug,
                      name: item.name,
                      variantName: null,
                      price: item.price,
                      image: item.image,
                      maxQuantity: item.stock,
                      deviceSlugs: cartDeviceSlugs,
                      deviceLabel: label,
                    },
                    1,
                    { openDrawer: true },
                  );
                }}
              >
                <Plus size={12} strokeWidth={2.5} />
                Add
              </button>
              <button
                type="button"
                aria-label={`Dismiss ${item.name}`}
                className="grid size-7 shrink-0 place-items-center rounded-full text-zinc-400 transition hover:bg-zinc-200/80 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-white/10 dark:hover:text-zinc-200"
                onClick={() => setDismissed((prev) => new Set(prev).add(item.id))}
              >
                <X size={12} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

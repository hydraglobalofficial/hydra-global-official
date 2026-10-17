"use client";

import Form from "next/form";
import Link from "next/link";
import { useRef } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { moneySymbol } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { DeviceOption, ProductSort } from "@/server/queries/catalog";

type Props = {
  action: string;
  categories: { slug: string; name: string }[];
  devices: DeviceOption[];
  sortOptions: { value: ProductSort; label: string }[];
  current: { category?: string; device?: string; minPrice?: number; maxPrice?: number; inStock?: boolean; sort?: ProductSort };
};

export function ShopFilters({ action, categories, devices, sortOptions, current }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const submit = () => formRef.current?.requestSubmit();
  const activeCount = [current.category, current.device, current.minPrice, current.maxPrice, current.inStock].filter(Boolean).length;

  return (
    <Form ref={formRef} action={action} scroll={false} className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-medium">
          <SlidersHorizontal size={16} className="text-accent" /> Filters
          {activeCount > 0 && <span className="rounded-full bg-accent/15 px-2 font-mono text-[10px] text-accent">{activeCount}</span>}
        </p>
        {activeCount > 0 && (
          <Link href={action} scroll={false} className="flex items-center gap-1 text-xs text-muted hover:text-fg">
            <X size={12} /> Clear
          </Link>
        )}
      </div>

      <label className="block space-y-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Sort by</span>
        <select name="sort" defaultValue={current.sort ?? "featured"} onChange={submit} className="h-11 w-full rounded-xl border border-line bg-surface-2 px-3 text-sm focus:border-accent/60 focus:outline-none">
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="space-y-2">
        <legend className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Category</legend>
        {[{ slug: "", name: "All categories" }, ...categories].map((c) => (
          <label key={c.slug || "all"} className="flex cursor-pointer items-center gap-3 rounded-lg py-1 text-sm text-muted has-[:checked]:text-fg">
            <input type="radio" name="category" value={c.slug} defaultChecked={(current.category ?? "") === c.slug} onChange={submit} className="peer sr-only" />
            <span className="grid size-4 place-items-center rounded-full border border-line-strong peer-checked:border-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
              <span className={cn("size-2 rounded-full", (current.category ?? "") === c.slug ? "bg-accent" : "bg-transparent")} />
            </span>
            {c.name}
          </label>
        ))}
      </fieldset>

      {devices.length > 0 && (
        <label className="block space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Device</span>
          <select name="device" defaultValue={current.device ?? ""} onChange={submit} className="h-11 w-full rounded-xl border border-line bg-surface-2 px-3 text-sm focus:border-accent/60 focus:outline-none">
            <option value="">All devices</option>
            {devices.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.model}
              </option>
            ))}
          </select>
        </label>
      )}

      <fieldset className="space-y-2">
        <legend className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
          Price ({moneySymbol()})
        </legend>
        <div className="flex items-center gap-2">
          <input name="min" type="number" min={0} inputMode="numeric" placeholder="Min" defaultValue={current.minPrice} onBlur={submit} className="h-11 w-full rounded-xl border border-line bg-surface-2 px-3 text-sm focus:border-accent/60 focus:outline-none" />
          <span className="text-subtle">–</span>
          <input name="max" type="number" min={0} inputMode="numeric" placeholder="Max" defaultValue={current.maxPrice} onBlur={submit} className="h-11 w-full rounded-xl border border-line bg-surface-2 px-3 text-sm focus:border-accent/60 focus:outline-none" />
        </div>
      </fieldset>

      <label className="flex cursor-pointer items-center justify-between text-sm">
        <span className="text-muted">In stock only</span>
        <input type="checkbox" name="stock" value="1" defaultChecked={current.inStock} onChange={submit} className="peer sr-only" />
        <span className="relative h-6 w-11 rounded-full bg-surface-3 transition-colors after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-muted after:transition-transform peer-checked:bg-accent/30 peer-checked:after:translate-x-5 peer-checked:after:bg-accent" />
      </label>

      <noscript>
        <button type="submit" className="w-full rounded-full bg-fg py-2 text-sm text-bg">Apply</button>
      </noscript>
    </Form>
  );
}

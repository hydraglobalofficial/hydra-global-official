"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DeviceOption } from "@/server/queries/catalog";

const brandOptions = [
  { value: "APPLE", label: "iPhone", slug: "iphone" },
  { value: "SAMSUNG", label: "Samsung", slug: "samsung" },
] as const;

export function DeviceFinder({ devices }: { devices: DeviceOption[] }) {
  const router = useRouter();
  const [brand, setBrand] = useState<(typeof brandOptions)[number]["value"] | null>(null);
  const [device, setDevice] = useState<string>("");

  const models = useMemo(() => devices.filter((d) => d.brand === brand), [devices, brand]);
  const brandSlug = brandOptions.find((b) => b.value === brand)?.slug;

  function find() {
    if (!brandSlug) return;
    router.push(device ? `/shop/${brandSlug}?device=${device}` : `/shop/${brandSlug}`);
  }

  return (
    <div className="border-gradient relative overflow-hidden rounded-3xl p-6 md:p-10">
      <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative grid gap-8 lg:grid-cols-[1fr_2fr] lg:items-center">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">Find your fit</p>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Built for your exact model.</h2>
          <p className="text-muted">Pick your phone and we&apos;ll show armor cut to its precise curves and cut-outs.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-end">
          <div className="space-y-2">
            <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">01 · Brand</span>
            <div className="flex gap-2">
              {brandOptions.map((b) => (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => {
                    setBrand(b.value);
                    setDevice("");
                  }}
                  aria-pressed={brand === b.value}
                  className={cn(
                    "h-12 rounded-xl border px-5 text-sm transition-all",
                    brand === b.value ? "border-accent bg-accent/10 text-fg" : "border-line bg-surface-2 text-muted hover:text-fg",
                  )}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
          <label className="space-y-2">
            <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">02 · Model</span>
            <select
              value={device}
              onChange={(e) => setDevice(e.target.value)}
              disabled={!brand}
              className="h-12 w-full rounded-xl border border-line bg-surface-2 px-4 text-sm text-fg disabled:opacity-40 focus:border-accent/60 focus:outline-none"
            >
              <option value="">{brand ? "All models" : "Select a brand first"}</option>
              {models.map((m) => (
                <option key={m.id} value={m.slug}>
                  {m.model}
                </option>
              ))}
            </select>
          </label>
          <Button size="lg" onClick={find} disabled={!brand} className="h-12">
            <Search size={16} /> Find <ArrowRight size={16} className="hidden md:block" />
          </Button>
        </div>
      </div>
    </div>
  );
}

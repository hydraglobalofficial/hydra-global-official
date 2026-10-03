"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUpRight, Search } from "lucide-react";
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
  const popular = useMemo(
    () => [...devices.filter((d) => d.brand === "APPLE").slice(0, 2), ...devices.filter((d) => d.brand === "SAMSUNG").slice(0, 2)],
    [devices],
  );

  function find() {
    if (!brandSlug) return;
    router.push(device ? `/shop/${brandSlug}?device=${device}` : `/shop/${brandSlug}`);
  }

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-line bg-surface p-4 sm:rounded-[2rem] sm:p-6 md:p-10">
      <div className="relative grid gap-6 sm:gap-8 lg:grid-cols-[1fr_2fr] lg:items-center">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-subtle">Find your fit</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">Built for your exact model.</h2>
          <p className="text-sm text-muted sm:text-base">Pick your phone and we&apos;ll show armor cut to its precise curves and cut-outs.</p>
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
                <option key={m.slug} value={m.slug}>
                  {m.model}
                </option>
              ))}
            </select>
          </label>
          <Button size="lg" onClick={find} disabled={!brand} className="h-12 w-full md:w-auto">
            <Search size={16} /> Find <ArrowRight size={16} className="hidden md:block" />
          </Button>
          {popular.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 md:col-span-3">
              <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Popular</span>
              {popular.map((d) => (
                <Link
                  key={d.slug}
                  href={`/shop/${d.brand === "APPLE" ? "iphone" : "samsung"}?device=${d.slug}`}
                  className="group inline-flex items-center gap-1 rounded-full border border-line bg-white/[0.03] px-3 py-1.5 text-xs text-muted transition-all hover:border-accent/40 hover:bg-accent/10 hover:text-fg"
                >
                  {d.model}
                  <ArrowUpRight size={12} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

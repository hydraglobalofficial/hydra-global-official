import Link from "next/link";
import { ArrowRight, Camera, EyeOff, Layers, Shield, Smartphone, Sparkles } from "lucide-react";
import type { NavigationData } from "@/server/queries/catalog";

const categoryIcons: Record<string, typeof Shield> = {
  shield: Shield,
  "eye-off": EyeOff,
  camera: Camera,
  layers: Layers,
  sparkles: Sparkles,
};

function groupBySeries(devices: NavigationData["devices"]) {
  const map = new Map<string, NavigationData["devices"]>();
  for (const d of devices) map.set(d.series, [...(map.get(d.series) ?? []), d]);
  return [...map.entries()];
}

export function MegaMenu({ nav }: { nav: NavigationData }) {
  const apple = groupBySeries(nav.devices.filter((d) => d.brand === "APPLE"));
  const samsung = groupBySeries(nav.devices.filter((d) => d.brand === "SAMSUNG"));

  return (
    <div className="container-page grid grid-cols-12 gap-8 py-10">
      <div className="col-span-4">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-subtle">Shop by Category</p>
        <div className="grid gap-1">
          {nav.categories.map((c) => {
            const Icon = categoryIcons[c.icon ?? ""] ?? Shield;
            return (
              <Link key={c.id} href={`/shop?category=${c.slug}`} className="group flex items-start gap-4 rounded-2xl p-3 hover:bg-white/[0.04]">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-accent group-hover:border-accent/40">
                  <Icon size={18} />
                </span>
                <span>
                  <span className="block text-sm font-medium group-hover:text-accent">{c.name}</span>
                  {c.description && <span className="line-clamp-1 text-xs text-muted">{c.description}</span>}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {[
        { title: "iPhone", href: "/shop/iphone", groups: apple },
        { title: "Samsung Galaxy", href: "/shop/samsung", groups: samsung },
      ].map((brand) => (
        <div key={brand.title} className="col-span-3">
          <Link href={brand.href} className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-subtle hover:text-accent">
            <Smartphone size={12} /> {brand.title}
          </Link>
          <div className="space-y-5">
            {brand.groups.map(([series, devices]) => (
              <div key={series}>
                <p className="mb-2 text-sm font-medium">{series}</p>
                <ul className="space-y-1.5">
                  {devices.map((d) => (
                    <li key={d.id}>
                      <Link href={`${brand.href}?device=${d.slug}`} className="text-sm text-muted hover:text-fg">
                        {d.model}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Link
        href="/shop"
        className="border-gradient group col-span-2 flex flex-col justify-between rounded-3xl p-5"
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">New drop</p>
          <p className="mt-3 text-lg font-semibold leading-tight">Privacy Armor for iPhone 17 series</p>
        </div>
        <span className="flex items-center gap-2 text-sm text-muted group-hover:text-fg">
          Explore <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
    </div>
  );
}

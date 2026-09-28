import { Sparkle } from "lucide-react";

const items = [
  "iPhone 17 Pro Max",
  "Galaxy S25 Ultra",
  "9H Tempered Glass",
  "iPhone 17 Pro",
  "Privacy Armor",
  "Galaxy Z Fold7",
  "Camera Lens Armor",
  "iPhone 16 Series",
  "Matte Anti-Glare",
  "Galaxy S24 Ultra",
];

/** Infinite ticker of supported devices and product lines. */
export function BrandMarquee() {
  const row = [...items, ...items];
  return (
    <section aria-label="Supported devices" className="relative overflow-hidden border-y border-line bg-black/40 py-5 backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-bg to-transparent" />
      <div className="flex w-max animate-marquee items-center gap-10 hover:[animation-play-state:paused]">
        {row.map((label, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap text-sm font-medium tracking-wide text-muted">
            <span className="text-base text-fg/80 md:text-lg">{label}</span>
            <Sparkle size={14} className="text-accent/70" />
          </span>
        ))}
      </div>
    </section>
  );
}

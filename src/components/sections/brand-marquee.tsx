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
    <section aria-label="Supported devices" className="relative overflow-x-clip border-y border-line bg-bg py-4 backdrop-blur-sm sm:py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-bg to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-bg to-transparent sm:w-32" />
      <div className="flex w-max animate-marquee items-center gap-8 hover:[animation-play-state:paused] sm:gap-10">
        {row.map((label, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap text-sm font-medium tracking-wide text-muted sm:gap-10">
            <span className="text-sm text-fg/80 sm:text-base md:text-lg">{label}</span>
            <Sparkle size={14} className="text-accent/70" />
          </span>
        ))}
      </div>
    </section>
  );
}

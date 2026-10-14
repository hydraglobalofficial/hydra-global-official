"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Rating } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Tahmid R.",
    device: "iPhone 17 Pro Max",
    text: "Honestly can't tell there's a protector on it. Dropped it on the stairs last week — glass cracked, screen perfect.",
    rating: 5,
    hue: "#93c5fd",
  },
  {
    name: "Nusrat J.",
    device: "Galaxy S25 Ultra",
    text: "First protector that actually works with the ultrasonic fingerprint. The install kit made it idiot-proof.",
    rating: 5,
    hue: "#a1a1aa",
  },
  {
    name: "Arif H.",
    device: "iPhone 16 Pro",
    text: "Privacy glass is a game changer on the commute. Arrived fast, installed in two minutes.",
    rating: 5,
    hue: "#d4d4d8",
  },
  {
    name: "Sadia K.",
    device: "Galaxy S24 Ultra",
    text: "Matte finish looks premium and kills fingerprints. Ordered a second one for my husband's phone.",
    rating: 5,
    hue: "#c4b5fd",
  },
  {
    name: "Imran S.",
    device: "iPhone 17 Pro",
    text: "Lens armor saved my camera glass after a desk drop. Fit is exact — no dust under the rings.",
    rating: 5,
    hue: "#67e8f9",
  },
  {
    name: "Rafi A.",
    device: "iPhone 15 Pro Max",
    text: "Fast shipping, bubble-free install. Support actually replied on WhatsApp in minutes.",
    rating: 4.5,
    hue: "#fda4af",
  },
];

const AUTO_MS = 5200;
const ease = [0.22, 1, 0.36, 1] as const;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [perView, setPerView] = useState(1);

  useEffect(() => {
    const sync = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) setPerView(3);
      else if (window.matchMedia("(min-width: 640px)").matches) setPerView(2);
      else setPerView(1);
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - perView);
  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + maxIndex + 1) % (maxIndex + 1)),
    [maxIndex],
  );

  const safeIndex = Math.min(index, maxIndex);

  useEffect(() => {
    if (paused || maxIndex === 0) return;
    const id = setTimeout(() => go(1), AUTO_MS);
    return () => clearTimeout(id);
  }, [index, paused, go, maxIndex]);

  const visible = testimonials.slice(safeIndex, safeIndex + perView);

  return (
    <section
      className="container-page py-14 sm:py-20 md:py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Customer reviews"
    >
      <div className="mb-6 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-5">
        <div className="max-w-2xl space-y-3 sm:space-y-4">
          <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
            <span className="size-1.5 rounded-full bg-accent" />
            Reviews
          </p>
          <h2 className="text-[1.65rem] font-semibold tracking-tight text-balance sm:text-3xl md:text-5xl">
            Loved by <span className="text-muted">thousands.</span>
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-muted sm:gap-3">
            <Rating value={4.8} size={16} />
            <span className="text-sm sm:text-base">4.8 average from verified buyers</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous reviews"
            className="touch-target grid place-items-center rounded-full border border-white/10 text-muted transition-colors hover:border-accent/40 hover:text-fg"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next reviews"
            className="touch-target grid place-items-center rounded-full border border-white/10 text-muted transition-colors hover:border-accent/40 hover:text-fg"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${safeIndex}-${perView}`}
            className={cn("grid gap-4", perView === 3 ? "lg:grid-cols-3" : perView === 2 ? "sm:grid-cols-2" : "grid-cols-1")}
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.45, ease }}
          >
            {visible.map((t) => (
              <figure
                key={t.name}
                className="card-premium flex h-full min-h-[15rem] flex-col justify-between gap-6 rounded-2xl p-5 sm:min-h-[17rem] sm:gap-8 sm:rounded-3xl sm:p-7"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <Quote size={26} className="text-accent/45" />
                    <Rating value={t.rating} size={12} />
                  </div>
                  <blockquote className="text-pretty text-[15px] leading-relaxed text-fg/90">&ldquo;{t.text}&rdquo;</blockquote>
                </div>
                <figcaption className="flex items-center gap-3 border-t border-white/[0.06] pt-5">
                  <span
                    className="grid size-10 place-items-center rounded-full text-sm font-semibold text-black"
                    style={{ background: `linear-gradient(135deg, ${t.hue}, #ffffff)` }}
                  >
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted">{t.device} · Verified buyer</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {Array.from({ length: maxIndex + 1 }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to review set ${i + 1}`}
            aria-current={i === safeIndex ? "true" : undefined}
            onClick={() => setIndex(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === safeIndex ? "w-7 bg-accent" : "w-1.5 bg-white/20 hover:bg-white/35",
            )}
          />
        ))}
      </div>
    </section>
  );
}

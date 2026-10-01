"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type Variants } from "motion/react";
import { ButtonLink } from "@/components/ui/button";
import { Rating } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { PhoneVisual } from "./phone-visual";
import { GlassLiftVisual, PrivacyVisual } from "./hero-visuals";

const SLIDE_MS = 7000;
const ease = [0.22, 1, 0.36, 1] as const;

const slides: {
  key: string;
  brand: string;
  title: React.ReactNode;
  text: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
  Visual: () => React.JSX.Element;
}[] = [
  {
    key: "armor",
    brand: "HYDRA",
    title: (
      <>
        Technology
        <span className="block text-accent">within reach.</span>
      </>
    ),
    text: "Premium cases, screen armor and camera gear for iPhone & Galaxy — cut to fit, built to last.",
    primary: { href: "/shop", label: "Shop now" },
    secondary: { href: "/about", label: "Our story" },
    Visual: PhoneVisual,
  },
  {
    key: "clarity",
    brand: "Clarity glass",
    title: (
      <>
        Less glare.
        <span className="block text-accent">More clarity.</span>
      </>
    ),
    text: "Anti-reflective armor for outdoor readability — tuned for iPhone 17 and Galaxy S25.",
    primary: { href: "/shop?category=tempered-glass", label: "Shop glass" },
    secondary: { href: "/shop/iphone", label: "iPhone lineup" },
    Visual: GlassLiftVisual,
  },
  {
    key: "privacy",
    brand: "Privacy armor",
    title: (
      <>
        Your screen.
        <span className="block text-accent">Your business.</span>
      </>
    ),
    text: "Side views black out past 30° — privacy for the metro, office and every café seat.",
    primary: { href: "/shop?category=privacy-glass", label: "Shop privacy" },
    secondary: { href: "/shop/samsung", label: "Galaxy lineup" },
    Visual: PrivacyVisual,
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.025, staggerDirection: -1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
  exit: { opacity: 0, y: -14, transition: { duration: 0.25 } },
};

function Stage({ children }: { children: React.ReactNode }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 90, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 90, damping: 18 });

  return (
    <motion.div
      className="relative h-full w-full [perspective:1600px]"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      style={{ rotateX: rx, rotateY: ry }}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = slides[index];

  const go = useCallback((dir: 1 | -1) => setIndex((i) => (i + dir + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => go(1), SLIDE_MS);
    return () => clearTimeout(id);
  }, [index, paused, go]);

  return (
    <section
      className="relative isolate min-h-[100svh] overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Full-bleed cinematic plane */}
      <div className="pointer-events-none absolute inset-0 bg-[#03050a]" />
      <motion.div
        className="pointer-events-none absolute -right-[10%] top-[-5%] h-[90%] w-[70%] rounded-full bg-accent/25 blur-[120px]"
        animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_40%,rgba(255,255,255,0.04),transparent_55%)]" />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#03050a] via-[#03050a]/80 to-transparent" />

      <div className="container-page relative grid min-h-[100svh] items-center gap-8 pb-28 pt-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-4 lg:pb-24 lg:pt-6">
        {/* Copy — brand-first, tight hero budget */}
        <div className="relative z-10 max-w-xl space-y-8 lg:space-y-9">
          <div className="grid min-h-[16.5rem] sm:min-h-[18rem]">
            <AnimatePresence initial={false}>
              <motion.div
                key={slide.key}
                className="col-start-1 row-start-1 space-y-6 sm:space-y-7"
                initial="hidden"
                animate="show"
                exit="exit"
                variants={container}
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${slides.length}`}
              >
                <motion.p
                  variants={item}
                  className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent"
                >
                  {slide.brand}
                </motion.p>

                <motion.h1
                  variants={item}
                  className="text-[2.85rem] font-semibold leading-[0.98] tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-[4.6rem] lg:leading-[0.96]"
                >
                  {slide.title}
                </motion.h1>

                <motion.p variants={item} className="max-w-md text-base leading-relaxed text-muted sm:text-lg">
                  {slide.text}
                </motion.p>

                <motion.div variants={item} className="flex flex-wrap items-center gap-3">
                  <ButtonLink href={slide.primary.href} size="lg" className="min-w-[9.5rem] text-[15px]">
                    {slide.primary.label} <ArrowRight size={17} />
                  </ButtonLink>
                  <ButtonLink href={slide.secondary.href} size="lg" variant="outline">
                    {slide.secondary.label}
                  </ButtonLink>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-3">
              <Rating value={4.8} size={13} />
              <p className="text-xs text-muted sm:text-sm">50,000+ owners · Bangladesh</p>
            </div>
            <div className="hidden h-4 w-px bg-white/10 sm:block" />
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-subtle">
              <Link href="/shop/iphone" className="transition-colors hover:text-fg">
                iPhone
              </Link>
              <Link href="/shop/samsung" className="transition-colors hover:text-fg">
                Samsung
              </Link>
              <Link href="/shop" className="transition-colors hover:text-fg">
                All products
              </Link>
            </div>
          </div>
        </div>

        {/* Dominant product plane */}
        <Stage>
          <div className="relative mx-auto flex aspect-[4/5] w-full max-w-[34rem] items-center justify-center lg:max-w-none lg:translate-x-2">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[45%] size-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(30,64,175,0.45)_0%,transparent_62%)] blur-3xl"
            />
            <div aria-hidden className="pointer-events-none absolute inset-x-[18%] bottom-[4%] h-20 rounded-[100%] bg-black/70 blur-3xl" />

            <div className="relative z-[1] w-full scale-[1.02] sm:scale-105 lg:scale-110">
              <div className="grid">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={slide.key}
                    className="col-start-1 row-start-1"
                    initial={{ opacity: 0, scale: 0.94, y: 28 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.04, y: -18 }}
                    transition={{ duration: 0.55, ease }}
                  >
                    <slide.Visual />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Stage>
      </div>

      {/* Bottom control dock — one composition footer for the first viewport */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
        <div className="container-page pointer-events-auto pb-5 pt-2 sm:pb-7">
          <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-black/50 p-3 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:px-5 sm:py-3">
            <dl className="grid grid-cols-3 divide-x divide-white/[0.06] sm:flex sm:divide-x">
              {[
                { v: "9H+", l: "Hardness" },
                { v: "±0.05", l: "mm fit" },
                { v: "12 mo", l: "Warranty" },
              ].map((s) => (
                <div key={s.l} className="flex flex-col items-center px-3 py-1 sm:flex-row sm:gap-2 sm:px-5">
                  <dt className="order-2 text-[10px] uppercase tracking-[0.14em] text-subtle sm:order-1 sm:text-xs">{s.l}</dt>
                  <dd className="order-1 font-mono text-sm font-semibold tabular-nums sm:order-2 sm:text-base">{s.v}</dd>
                </div>
              ))}
            </dl>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <span className="font-mono text-xs tabular-nums text-muted">
                <span className="text-fg">{String(index + 1).padStart(2, "0")}</span>
                <span className="mx-1 text-white/20">/</span>
                {String(slides.length).padStart(2, "0")}
              </span>
              <div className="flex gap-1.5">
                {slides.map((s, i) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === index ? "true" : undefined}
                    className="relative h-1 w-8 overflow-hidden rounded-full bg-white/15"
                  >
                    {i === index && (
                      <motion.span
                        key={`${s.key}-${paused}`}
                        className="absolute inset-y-0 left-0 bg-accent"
                        initial={{ width: paused ? "100%" : "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: paused ? 0 : SLIDE_MS / 1000, ease: "linear" }}
                      />
                    )}
                    {i < index && <span className="absolute inset-0 bg-white/40" />}
                  </button>
                ))}
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous slide"
                  className={cn(
                    "grid size-9 place-items-center rounded-full border border-white/10 text-muted transition-colors hover:border-accent/40 hover:text-fg",
                  )}
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next slide"
                  className="grid size-9 place-items-center rounded-full border border-white/10 text-muted transition-colors hover:border-accent/40 hover:text-fg"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

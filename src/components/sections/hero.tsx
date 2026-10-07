"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type Variants } from "motion/react";
import { ButtonLink } from "@/components/ui/button";
import { Rating } from "@/components/ui/primitives";
import type { HeroSlide, HomeHeroContent } from "@/content/site-sections";
import { cn } from "@/lib/utils";
import { PhoneVisual } from "./phone-visual";
import { GlassLiftVisual, PrivacyVisual } from "./hero-visuals";

const SLIDE_MS = 7000;
const ease = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
  exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

function SlideVisual({ slide, priority }: { slide: HeroSlide; priority?: boolean }) {
  if (slide.visual === "image" && slide.image) {
    return (
      <div className="relative mx-auto aspect-[4/5] w-full max-w-[30rem] overflow-hidden rounded-[2rem]">
        <Image
          src={slide.image}
          alt={slide.brand}
          fill
          sizes="(max-width: 1024px) 90vw, 34rem"
          className="object-cover"
          priority={priority}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/5" />
      </div>
    );
  }
  if (slide.visual === "glass") return <GlassLiftVisual />;
  if (slide.visual === "privacy") return <PrivacyVisual />;
  return <PhoneVisual />;
}

function Stage({ children }: { children: React.ReactNode }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), { stiffness: 70, damping: 22, mass: 0.8 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), { stiffness: 70, damping: 22, mass: 0.8 });

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

/** Classic carousel strip — sits tight under the phone stage. */
function HeroStagePager({
  index,
  total,
  paused,
  labels,
  onPrev,
  onNext,
  onSelect,
}: {
  index: number;
  total: number;
  paused: boolean;
  labels: string[];
  onPrev: () => void;
  onNext: () => void;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="pointer-events-auto w-[min(100%,20rem)]">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous slide"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-white/15 bg-black/55 text-fg shadow-[0_10px_30px_-12px_rgba(0,0,0,0.8)] backdrop-blur-md transition-colors hover:border-accent/50 hover:bg-black/70"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="min-w-0 flex-1 rounded-full border border-white/12 bg-black/55 px-3 py-2.5 shadow-[0_14px_40px_-18px_rgba(0,0,0,0.85)] backdrop-blur-md">
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: total }, (_, i) => {
              const active = i === index;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelect(i)}
                  aria-label={labels[i] ? `Go to ${labels[i]}` : `Go to slide ${i + 1}`}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "relative overflow-hidden rounded-full transition-all duration-300",
                    active
                      ? "h-2.5 w-10 bg-white/15"
                      : "size-2.5 bg-white/30 hover:bg-white/55",
                  )}
                >
                  {active && (
                    <span
                      key={`${index}-${paused ? "p" : "r"}`}
                      className={cn(
                        "absolute inset-y-0 left-0 origin-left rounded-full bg-accent",
                        paused ? "w-full" : "animate-hero-rail w-full",
                      )}
                      style={paused ? undefined : { animationDuration: `${SLIDE_MS}ms` }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <p className="mt-1.5 text-center font-mono text-[10px] tabular-nums tracking-[0.2em] text-muted">
            <span className="text-fg">{String(index + 1).padStart(2, "0")}</span>
            <span className="mx-1 text-white/25">/</span>
            {String(total).padStart(2, "0")}
          </p>
        </div>

        <button
          type="button"
          onClick={onNext}
          aria-label="Next slide"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-accent/40 bg-accent/20 text-fg shadow-[0_10px_30px_-12px_rgba(30,64,175,0.55)] backdrop-blur-md transition-colors hover:bg-accent/30"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export function Hero({ content }: { content: HomeHeroContent }) {
  const slides = content.slides;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = slides[Math.min(index, slides.length - 1)] ?? slides[0];
  const stats = content.stats;

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const id = window.setTimeout(() => go(1), SLIDE_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, go, slides.length]);

  // Keep index valid if CMS slide count shrinks after publish.
  useEffect(() => {
    if (index >= slides.length) setIndex(0);
  }, [index, slides.length]);

  const social = useMemo(
    () => ({
      ratingLabel: content.ratingLabel,
      quickLinks: content.quickLinks,
    }),
    [content.ratingLabel, content.quickLinks],
  );

  if (!slide) return null;

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
      <div className="pointer-events-none absolute inset-0 bg-[#03050a]" />
      <div className="pointer-events-none absolute -right-[10%] top-[-5%] h-[90%] w-[70%] animate-hero-glow rounded-full bg-accent/25 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_40%,rgba(255,255,255,0.04),transparent_55%)]" />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#03050a] via-[#03050a]/80 to-transparent" />

      <div className="container-page relative grid min-h-[100svh] items-center gap-6 pb-28 pt-6 sm:pb-24 sm:pt-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-4 lg:pb-20 lg:pt-6">
        <div className="relative z-10 max-w-xl space-y-6 sm:space-y-8 lg:space-y-9">
          <div className="grid min-h-[14.5rem] sm:min-h-[18rem]">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={slide.key}
                className="col-start-1 row-start-1 space-y-5 sm:space-y-7"
                initial="hidden"
                animate="show"
                exit="exit"
                variants={container}
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${slides.length}`}
              >
                <motion.p
                  variants={item}
                  className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent sm:text-[11px] sm:tracking-[0.35em]"
                >
                  {slide.brand}
                </motion.p>

                <motion.h1
                  variants={item}
                  className="text-[clamp(2.15rem,9.5vw,2.85rem)] font-semibold leading-[0.98] tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-[4.6rem] lg:leading-[0.96]"
                >
                  {slide.title}
                  <span className="block text-accent">{slide.titleAccent}</span>
                </motion.h1>

                <motion.p variants={item} className="max-w-md text-[0.95rem] leading-relaxed text-muted sm:text-lg">
                  {slide.text}
                </motion.p>

                <motion.div variants={item} className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <ButtonLink href={slide.primaryHref} size="lg" className="min-h-11 min-w-[9rem] text-[15px] sm:min-w-[9.5rem]">
                    {slide.primaryLabel} <ArrowRight size={17} />
                  </ButtonLink>
                  <ButtonLink href={slide.secondaryHref} size="lg" variant="outline" className="min-h-11">
                    {slide.secondaryLabel}
                  </ButtonLink>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-3">
              <Rating value={4.8} size={13} />
              <p className="text-xs text-muted sm:text-sm">{social.ratingLabel}</p>
            </div>
            <div className="hidden h-4 w-px bg-white/10 sm:block" />
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-subtle">
              {social.quickLinks.map((link) => (
                <Link key={`${link.href}-${link.label}`} href={link.href} className="transition-colors hover:text-fg">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full min-w-0 max-w-[34rem] lg:max-w-none lg:translate-x-2">
          <Stage>
            <div className="relative mx-auto flex aspect-[4/5] w-full max-w-full items-center justify-center overflow-hidden sm:overflow-visible">
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-[45%] size-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(30,64,175,0.45)_0%,transparent_62%)] blur-3xl"
              />
              <div aria-hidden className="pointer-events-none absolute inset-x-[18%] bottom-[4%] h-20 rounded-[100%] bg-black/70 blur-3xl" />

              <div className="relative z-[1] w-full max-w-full scale-100 sm:scale-105 lg:scale-110">
                <div className="grid">
                  <AnimatePresence initial={false} mode="popLayout">
                    <motion.div
                      key={slide.key}
                      className="col-start-1 row-start-1"
                      initial={{ opacity: 0, scale: 0.96, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 1.02, y: -12 }}
                      transition={{ duration: 0.45, ease }}
                    >
                      <SlideVisual slide={slide} priority={index === 0} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {slides.length > 1 && (
                <div className="absolute inset-x-0 bottom-[7%] z-30 flex justify-center px-3 sm:bottom-[8%] lg:bottom-[9%]">
                  <HeroStagePager
                    index={index}
                    total={slides.length}
                    paused={paused}
                    labels={slides.map((s) => s.brand)}
                    onPrev={() => go(-1)}
                    onNext={() => go(1)}
                    onSelect={setIndex}
                  />
                </div>
              )}
            </div>
          </Stage>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 pb-[env(safe-area-inset-bottom)]">
        <div className="container-page pointer-events-auto pb-4 pt-2 sm:pb-7">
          <div className="rounded-2xl border border-white/[0.07] bg-black/50 px-2 py-2.5 backdrop-blur-xl sm:rounded-full sm:px-5 sm:py-3">
            <dl className="grid grid-cols-3 divide-x divide-white/[0.06] sm:flex sm:justify-center sm:divide-x">
              {stats.map((s) => (
                <div key={s.label} className="flex min-w-0 flex-col items-center px-1.5 py-1 sm:flex-row sm:gap-2 sm:px-8">
                  <dt className="order-2 max-w-full truncate text-center text-[9px] uppercase tracking-[0.12em] text-subtle sm:order-1 sm:text-xs sm:tracking-[0.14em]">
                    {s.label}
                  </dt>
                  <dd className="order-1 font-mono text-xs font-semibold tabular-nums sm:order-2 sm:text-base">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

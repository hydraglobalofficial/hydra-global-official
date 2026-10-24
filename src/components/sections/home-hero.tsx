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

const SLIDE_MS = 5500;
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
      <div className="relative mx-auto w-full max-w-[36rem]">
        <Image
          src={slide.image}
          alt={slide.brand}
          width={1600}
          height={1000}
          sizes="(max-width: 1024px) 92vw, 36rem"
          className="h-auto w-full rounded-[1.75rem] object-contain"
          priority={priority}
          loading="eager"
        />
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

/** Compact progress dots under the phone — arrows live on the sides. */
function HeroStagePager({
  index,
  total,
  paused,
  labels,
  onSelect,
}: {
  index: number;
  total: number;
  paused: boolean;
  labels: string[];
  onSelect: (i: number) => void;
}) {
  return (
    <div className="pointer-events-auto w-[min(100%,12.5rem)] sm:w-[min(100%,14rem)]">
      <div className="rounded-full border border-line bg-bg/80 px-2.5 py-1.5 shadow-[0_14px_40px_-18px_rgba(0,0,0,0.55)] backdrop-blur-md light:bg-white/90 light:shadow-[0_10px_28px_-16px_rgba(0,0,0,0.16)] sm:px-3 sm:py-2">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
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
                  active ? "h-1.5 w-7 bg-fg/15 sm:h-2 sm:w-9" : "size-1.5 bg-fg/30 hover:bg-fg/55 sm:size-2",
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
        <p className="mt-0.5 text-center font-mono text-[9px] tabular-nums tracking-[0.2em] text-muted sm:mt-1 sm:text-[10px]">
          <span className="text-fg">{String(index + 1).padStart(2, "0")}</span>
          <span className="mx-1 text-fg/25">/</span>
          {String(total).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}

function HeroSideArrow({
  dir,
  onClick,
}: {
  dir: "prev" | "next";
  onClick: () => void;
}) {
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous slide" : "Next slide"}
      className={cn(
        "pointer-events-auto absolute top-1/2 z-30 grid size-11 place-items-center rounded-full",
        "border border-line-strong bg-bg/90 text-fg backdrop-blur-md transition",
        "hover:border-fg/35 hover:bg-surface hover:scale-105 active:scale-95",
        "shadow-[0_12px_28px_-14px_rgba(0,0,0,0.55)] light:bg-white light:shadow-[0_10px_24px_-14px_rgba(0,0,0,0.14)]",
        "sm:size-12",
      )}
      style={{
        transform: "translateY(-50%)",
        ...(dir === "prev" ? { left: 8 } : { right: 8 }),
      }}
    >
      <Icon size={20} strokeWidth={2.4} />
    </button>
  );
}

export function Hero({ content }: { content: HomeHeroContent }) {
  const slides = content.slides;
  const [index, setIndex] = useState(0);
  /** Pause only while hovering the phone stage / controls — not the whole hero. */
  const [paused, setPaused] = useState(false);
  const safeIndex = slides.length ? ((index % slides.length) + slides.length) % slides.length : 0;
  const slide = slides[safeIndex] ?? slides[0];
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
      className="relative isolate overflow-hidden sm:min-h-[calc(100svh-7.5rem)]"
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      <div suppressHydrationWarning className="hero-stage-bg pointer-events-none absolute inset-0 bg-bg" data-hero-stage="v3" />
      <div suppressHydrationWarning className="hero-stage-glow pointer-events-none absolute -right-[10%] top-[-5%] h-[90%] w-[70%] animate-hero-glow rounded-full bg-accent/25 blur-[120px] light:hidden" />
      <div suppressHydrationWarning className="hero-stage-wash pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_40%,rgba(255,255,255,0.04),transparent_55%)] light:hidden" />
      <div suppressHydrationWarning className="hero-stage-grid bg-grid pointer-events-none absolute inset-0 opacity-30 light:hidden" />
      <div suppressHydrationWarning className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg via-bg/80 to-transparent" />

      {/*
        DOM: writing first, image second.
        Mobile: flex-col-reverse → image on top.
        Large: flex-row → writing left, image right.
      */}
      <div className="container-page relative flex flex-col-reverse items-stretch gap-2 pb-20 pt-4 sm:gap-5 sm:pb-20 sm:pt-5 lg:flex-row lg:items-center lg:gap-6 lg:pb-16 lg:pt-0 xl:gap-8">
        <div className="relative z-10 w-full max-w-xl shrink-0 space-y-4 sm:space-y-6 lg:space-y-7">
          <div className="grid min-h-[8.5rem] sm:min-h-[12rem]">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={slide.key}
                className="col-start-1 row-start-1 space-y-3 sm:space-y-7"
                initial="hidden"
                animate="show"
                exit="exit"
                variants={container}
                aria-roledescription="slide"
                aria-label={`${safeIndex + 1} of ${slides.length}: ${slide.brand}`}
              >
                <motion.p
                  variants={item}
                  className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[10px] uppercase tracking-[0.22em] text-accent sm:text-[11px] sm:tracking-[0.25em]"
                >
                  <span>{slide.brand}</span>
                  {slides.length > 1 ? (
                    <>
                      <span className="text-fg/25" aria-hidden>
                        ·
                      </span>
                      <span className="tabular-nums tracking-[0.18em] text-muted">
                        {String(safeIndex + 1).padStart(2, "0")}
                        <span className="mx-1 text-fg/25">/</span>
                        {String(slides.length).padStart(2, "0")}
                      </span>
                    </>
                  ) : null}
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
            <div className="hidden h-4 w-px bg-line sm:block" />
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-subtle">
              {social.quickLinks.map((link) => (
                <Link key={`${link.href}-${link.label}`} href={link.href} className="transition-colors hover:text-fg">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div
          className="relative mx-auto mt-1 w-full min-w-0 max-w-[34rem] sm:mt-0 lg:mx-0 lg:max-w-none lg:flex-1"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          {slides.length > 1 && (
            <>
              <HeroSideArrow dir="prev" onClick={() => go(-1)} />
              <HeroSideArrow dir="next" onClick={() => go(1)} />
            </>
          )}
          <Stage>
            <div
              className={cn(
                "relative mx-auto flex w-full max-w-full items-center justify-center overflow-visible pt-2 sm:pt-1 lg:pt-0",
                slide.visual === "image" ? "min-h-[16rem]" : "aspect-[4/5]",
              )}
            >
              {slide.visual !== "image" && (
                <div aria-hidden className="hero-visual-shadow pointer-events-none absolute inset-x-[18%] bottom-[4%] h-20 rounded-[100%] bg-black/70 blur-3xl light:bg-black/8" />
              )}

              <div
                className={cn(
                  "relative z-[1] w-full max-w-full",
                  slide.visual === "image" ? "" : "scale-[0.96] sm:scale-[1.03] lg:scale-105",
                )}
              >
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
            </div>
          </Stage>

          {slides.length > 1 && (
            <div
              className={cn(
                "z-30 flex justify-center px-3",
                slide.visual === "image"
                  ? "relative mt-3"
                  : "absolute inset-x-0 bottom-[3%] sm:bottom-[5%] lg:bottom-[6%]",
              )}
            >
              <HeroStagePager
                index={safeIndex}
                total={slides.length}
                paused={paused}
                labels={slides.map((s) => s.brand)}
                onSelect={setIndex}
              />
            </div>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 pb-[env(safe-area-inset-bottom)]">
        <div className="container-page pointer-events-auto pb-4 pt-2 sm:pb-7">
          <div className="rounded-2xl border border-line bg-bg/70 px-2 py-2.5 backdrop-blur-xl sm:rounded-full sm:px-5 sm:py-3">
            <dl className="grid grid-cols-3 divide-x divide-line sm:flex sm:justify-center sm:divide-x">
              {stats.map((s, i) => (
                <div key={`${s.value}-${i}`} className="flex min-w-0 flex-col items-center px-1.5 py-1 sm:flex-row sm:gap-2 sm:px-8">
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

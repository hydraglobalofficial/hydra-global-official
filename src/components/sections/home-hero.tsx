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
  film,
}: {
  index: number;
  total: number;
  paused: boolean;
  labels: string[];
  onSelect: (i: number) => void;
  film?: boolean;
}) {
  return (
    <div className="pointer-events-auto w-[min(100%,12.5rem)] sm:w-[min(100%,14rem)]">
      <div
        className={cn(
          "rounded-full border px-2.5 py-1.5 backdrop-blur-md sm:px-3 sm:py-2",
          film
            ? "border-white/25 bg-black/40 shadow-[0_14px_40px_-18px_rgba(0,0,0,0.65)]"
            : "border-line bg-bg/80 shadow-[0_14px_40px_-18px_rgba(0,0,0,0.55)] light:border-[#C5E0F3] light:bg-white light:shadow-[0_10px_28px_-16px_rgba(0,0,0,0.14)]",
        )}
      >
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
                  active
                    ? film
                      ? "h-1.5 w-7 bg-white/25 sm:h-2 sm:w-9"
                      : "h-1.5 w-7 bg-fg/15 sm:h-2 sm:w-9"
                    : film
                      ? "size-1.5 bg-white/45 hover:bg-white sm:size-2"
                      : "size-1.5 bg-fg/30 hover:bg-fg/55 sm:size-2",
                )}
              >
                {active && (
                  <span
                    key={`${index}-${paused ? "p" : "r"}`}
                    className={cn(
                      cn("absolute inset-y-0 left-0 origin-left rounded-full", film ? "bg-white" : "bg-accent"),
                      paused ? "w-full" : "animate-hero-rail w-full",
                    )}
                    style={paused ? undefined : { animationDuration: `${SLIDE_MS}ms` }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <p className={cn("mt-0.5 text-center font-mono text-[9px] tabular-nums tracking-[0.2em] sm:mt-1 sm:text-[10px]", film ? "text-white/70" : "text-muted")}>
          <span className={film ? "text-white" : "text-fg"}>{String(index + 1).padStart(2, "0")}</span>
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
  film,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  film?: boolean;
}) {
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous slide" : "Next slide"}
      className={cn(
        "pointer-events-auto absolute top-1/2 z-30 grid size-11 place-items-center rounded-full backdrop-blur-md transition",
        "hover:scale-105 active:scale-95 sm:size-12",
        film
          ? "border border-white/30 bg-black/35 text-white shadow-[0_12px_28px_-14px_rgba(0,0,0,0.65)] hover:bg-black/55"
          : "border border-line-strong bg-bg/90 text-fg shadow-[0_12px_28px_-14px_rgba(0,0,0,0.55)] hover:border-fg/35 hover:bg-surface light:bg-white light:shadow-[0_10px_24px_-14px_rgba(0,0,0,0.14)]",
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

  /** Custom image is the banner — 16:9 on every breakpoint, never cropped. */
  const film = slide.visual === "image" && Boolean(slide.image);
  const mobileImage = slide.imageMobile?.trim() || slide.image;

  const hasTitle = Boolean(slide.title.trim() || slide.titleAccent.trim());
  const hasText = Boolean(slide.text.trim());
  const hasPrimary = Boolean(slide.primaryLabel.trim());
  const hasSecondary = Boolean(slide.secondaryLabel.trim());

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden",
        !film && "sm:min-h-[calc(100svh-7.5rem)]",
      )}
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={film ? () => setPaused(true) : undefined}
      onMouseLeave={film ? () => setPaused(false) : undefined}
    >
      {film ? (
      <>
        <div className="hero-film pointer-events-none relative aspect-video w-full overflow-hidden bg-black md:aspect-auto md:h-[calc(100svh-8rem)]">
          <AnimatePresence initial={false}>
            <motion.div
              key={slide.key}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease }}
            >
              <Image
                src={mobileImage}
                alt=""
                fill
                priority={safeIndex === 0}
                sizes="100vw"
                className="object-contain object-center md:hidden"
              />
              <Image
                src={slide.image}
                alt=""
                fill
                priority={safeIndex === 0}
                sizes="100vw"
                className="hidden object-cover object-center md:block"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.12)_42%,transparent_70%)] md:bg-[linear-gradient(90deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.22)_38%,transparent_68%)]" />
          {slides.length > 1 && (
            <>
              <div className="hidden md:contents">
                <HeroSideArrow dir="prev" film onClick={() => go(-1)} />
                <HeroSideArrow dir="next" film onClick={() => go(1)} />
              </div>
              <div className="pointer-events-auto absolute inset-x-0 bottom-2.5 z-30 flex justify-center gap-1.5 md:hidden">
                {slides.map((s, i) => {
                  const active = i === safeIndex;
                  return (
                    <button
                      key={s.key || i}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={s.brand ? `Go to ${s.brand}` : `Go to slide ${i + 1}`}
                      aria-current={active ? "true" : undefined}
                      className={cn(
                        "rounded-full transition-all duration-300",
                        active ? "h-1.5 w-5 bg-white" : "size-1.5 bg-white/45",
                      )}
                    />
                  );
                })}
              </div>
              <div className="pointer-events-auto absolute inset-x-0 bottom-3 z-30 hidden justify-center sm:bottom-4 md:flex">
                <HeroStagePager
                  film
                  index={safeIndex}
                  total={slides.length}
                  paused={paused}
                  labels={slides.map((s) => s.brand)}
                  onSelect={setIndex}
                />
              </div>
            </>
          )}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-start px-5 pb-8 text-left md:items-center md:px-5 md:pb-0 md:pl-[clamp(2.75rem,6.5vw,6rem)] md:pr-[45%]">
            <div className="pointer-events-auto w-full max-w-xl space-y-2 md:space-y-[clamp(0.55rem,0.35rem+0.7vw,1.15rem)]">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={slide.key}
                  className="space-y-2 md:space-y-[clamp(0.55rem,0.35rem+0.7vw,1.15rem)]"
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  variants={container}
                  aria-roledescription="slide"
                  aria-label={`${safeIndex + 1} of ${slides.length}: ${slide.brand || slide.title || "Hero"}`}
                >
                  {hasTitle && (
                    <motion.h1
                      variants={item}
                      className="text-balance text-[1.45rem] font-semibold leading-[1.05] tracking-[-0.035em] text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.75)] sm:text-[clamp(1.85rem,0.7rem+4.4vw,4.4rem)] sm:leading-[1.02]"
                    >
                      {slide.title.trim() ? slide.title : null}
                      {slide.titleAccent.trim() ? (
                        <span className={slide.title.trim() ? "block text-white" : "text-white"}>{slide.titleAccent}</span>
                      ) : null}
                    </motion.h1>
                  )}
                  {hasText && (
                    <motion.p
                      variants={item}
                      className="hidden max-w-[28rem] text-[clamp(0.9rem,0.8rem+0.28vw,1.1rem)] font-normal leading-snug text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] md:block"
                    >
                      {slide.text}
                    </motion.p>
                  )}
                  {(hasPrimary || hasSecondary) && (
                    <motion.div variants={item} className="flex flex-wrap items-center justify-start gap-2 sm:gap-3">
                      {hasPrimary && (
                        <ButtonLink
                          href={slide.primaryHref}
                          size="sm"
                          className="!h-8 !rounded-full !bg-white !px-3.5 !text-[12px] !font-medium !text-[#1a1028] hover:!bg-white/90 sm:!h-11 sm:!px-6 sm:!text-sm"
                        >
                          {slide.primaryLabel}
                        </ButtonLink>
                      )}
                      {hasSecondary && (
                        <ButtonLink
                          href={slide.secondaryHref}
                          size="sm"
                          variant="outline"
                          className="!h-8 !rounded-full !border-white/55 !bg-transparent !px-3.5 !text-[12px] !text-white hover:!bg-white/10 sm:!h-11 sm:!px-6 sm:!text-sm"
                        >
                          {slide.secondaryLabel}
                        </ButtonLink>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
        {stats.length > 0 && (
          <div className="relative z-20 shrink-0 border-t border-[#C5E0F3] bg-white">
            <dl className="container-page flex items-center justify-center divide-x divide-[#C5E0F3] py-2.5 sm:py-3">
              {stats.map((s, i) => {
                const label = s.label.trim();
                const showLabel = label.length > 0 && !/^[-–—.·]+$/.test(label);
                return (
                  <div key={`${s.value}-${i}`} className="flex min-w-0 items-baseline justify-center gap-1.5 px-3 sm:px-8">
                    <dd className="truncate font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-fg sm:text-xs">
                      {s.value}
                    </dd>
                    {showLabel && (
                      <dt className="truncate text-[10px] uppercase tracking-[0.12em] text-subtle sm:text-[11px]">{label}</dt>
                    )}
                  </div>
                );
              })}
            </dl>
          </div>
        )}
      </>
      ) : (
        <>
          <div suppressHydrationWarning className="hero-stage-bg pointer-events-none absolute inset-0 bg-bg" data-hero-stage="v3" />
          <div suppressHydrationWarning className="hero-stage-glow pointer-events-none absolute -right-[10%] top-[-5%] h-[90%] w-[70%] animate-hero-glow rounded-full bg-accent/25 blur-[120px] light:hidden" />
          <div suppressHydrationWarning className="hero-stage-wash pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_40%,rgba(255,255,255,0.04),transparent_55%)] light:hidden" />
          <div suppressHydrationWarning className="hero-stage-grid bg-grid pointer-events-none absolute inset-0 opacity-30 light:hidden" />
          <div suppressHydrationWarning className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg via-bg/80 to-transparent" />
        </>
      )}

      {!film && (
      <div className="container-page relative z-10 flex flex-col-reverse gap-2 pb-20 pt-4 sm:gap-5 sm:pb-20 sm:pt-5 lg:flex-row lg:items-center lg:gap-6 lg:pb-16 lg:pt-0 xl:gap-8">
        <div className={cn("relative z-10 w-full max-w-xl shrink-0 space-y-4 sm:space-y-6 lg:space-y-7", film && "pointer-events-auto max-w-none space-y-0")}>
          <div className={cn("grid", film ? "min-h-0" : "min-h-[8.5rem] sm:min-h-[12rem]")}>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={slide.key}
                className={cn(
                  "col-start-1 row-start-1",
                  film ? "space-y-[clamp(0.7rem,0.45rem+0.9vw,1.35rem)] text-left" : "space-y-3 sm:space-y-7",
                )}
                initial="hidden"
                animate="show"
                exit="exit"
                variants={container}
                aria-roledescription="slide"
                aria-label={`${safeIndex + 1} of ${slides.length}: ${slide.brand}`}
              >
                <motion.p
                  variants={item}
                  className={cn(
                    "flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[10px] uppercase tracking-[0.22em] text-accent sm:text-[11px] sm:tracking-[0.25em]",
                    film && "hidden",
                  )}
                >
                  <span>{slide.brand}</span>
                  {slides.length > 1 ? (
                    <>
                      <span className={film ? "text-white/35" : "text-fg/25"} aria-hidden>
                        ·
                      </span>
                      <span className={cn("tabular-nums tracking-[0.18em]", film ? "text-white/60" : "text-muted")}>
                        {String(safeIndex + 1).padStart(2, "0")}
                        <span className={cn("mx-1", film ? "text-white/35" : "text-fg/25")}>/</span>
                        {String(slides.length).padStart(2, "0")}
                      </span>
                    </>
                  ) : null}
                </motion.p>

                {hasTitle && (
                  <motion.h1
                    variants={item}
                    className="text-balance text-[clamp(2.15rem,9.5vw,2.85rem)] font-semibold leading-[0.98] tracking-tight sm:text-6xl md:text-7xl lg:text-[4.6rem] lg:leading-[0.96]"
                  >
                    {slide.title.trim() ? slide.title : null}
                    {slide.titleAccent.trim() ? (
                      <span className={cn(slide.title.trim() ? "block text-accent" : "text-accent")}>{slide.titleAccent}</span>
                    ) : null}
                  </motion.h1>
                )}

                {hasText && (
                  <motion.p variants={item} className="max-w-md text-[0.95rem] leading-relaxed text-muted sm:text-lg">
                    {slide.text}
                  </motion.p>
                )}

                {(hasPrimary || hasSecondary) && (
                  <motion.div variants={item} className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    {hasPrimary && (
                      <ButtonLink href={slide.primaryHref} size="lg" className="min-h-11 min-w-[9rem] text-[15px] sm:min-w-[9.5rem]">
                        {slide.primaryLabel} <ArrowRight size={17} />
                      </ButtonLink>
                    )}
                    {hasSecondary && (
                      <ButtonLink href={slide.secondaryHref} size="lg" variant="outline" className="min-h-11">
                        {slide.secondaryLabel}
                      </ButtonLink>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {!film && <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-3">
              <Rating
                value={4.8}
                size={13}
                starClassName={film ? "!text-white" : undefined}
                trackClassName={film ? "!text-white/30" : undefined}
              />
              <p className={cn("text-xs sm:text-sm", film ? "text-white/75" : "text-muted")}>{social.ratingLabel}</p>
            </div>
            <div className={cn("hidden h-4 w-px sm:block", film ? "bg-white/25" : "bg-line")} />
            <div className={cn("flex flex-wrap gap-x-4 gap-y-1 text-xs", film ? "text-white/70" : "text-subtle")}>
              {social.quickLinks.map((link) => (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  className={cn("transition-colors", film ? "hover:text-white" : "hover:text-fg")}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>}
        </div>

        {!film && (
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
              <div className="relative mx-auto flex aspect-[4/5] w-full max-w-full items-center justify-center overflow-visible pt-2 sm:pt-1 lg:pt-0">
                <div aria-hidden className="hero-visual-shadow pointer-events-none absolute inset-x-[18%] bottom-[4%] h-20 rounded-[100%] bg-black/70 blur-3xl light:bg-black/8" />
                <div className="relative z-[1] w-full max-w-full scale-[0.96] sm:scale-[1.03] lg:scale-105">
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
              <div className="absolute inset-x-0 bottom-[3%] z-30 flex justify-center px-3 sm:bottom-[5%] lg:bottom-[6%]">
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
        )}
      </div>
      )}

      {!film && (
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 pb-[env(safe-area-inset-bottom)]">
        <div className="container-page pointer-events-auto pb-4 pt-2 sm:pb-7">
          <div className="rounded-2xl border border-line bg-bg/70 px-2 py-2.5 backdrop-blur-xl sm:rounded-full sm:px-5 sm:py-3 light:border-[#C5E0F3] light:bg-white">
            <dl className="grid grid-cols-3 divide-x divide-line sm:flex sm:justify-center sm:divide-x">
              {stats.map((s, i) => (
                <div key={`${s.value}-${i}`} className="flex min-w-0 flex-col items-center px-1.5 py-1 sm:flex-row sm:gap-2 sm:px-8">
                  <dt
                    className={cn(
                      "order-2 max-w-full truncate text-center text-[9px] uppercase tracking-[0.12em] sm:order-1 sm:text-xs sm:tracking-[0.14em]",
                      "text-subtle",
                    )}
                  >
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
      )}
    </section>
  );
}

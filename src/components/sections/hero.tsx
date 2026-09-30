"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, EyeOff, Fingerprint, ShieldCheck, Sparkles, Wrench, Zap } from "lucide-react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type Variants } from "motion/react";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow, Rating } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { PhoneVisual } from "./phone-visual";
import { GlassLiftVisual, PrivacyVisual } from "./hero-visuals";

const SLIDE_MS = 7000;

const stats = [
  { value: "9H+", label: "Surface hardness" },
  { value: "0.33mm", label: "Ultra-thin glass" },
  { value: "99.9%", label: "HD clarity" },
];

type Chip = { icon: typeof Zap; label: string; value: string; sub: string };

const slides: {
  key: string;
  eyebrow: string;
  title: React.ReactNode;
  text: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
  Visual: () => React.JSX.Element;
  chips: [Chip, Chip];
}[] = [
  {
    key: "armor",
    eyebrow: "Next-gen screen armor · 2026",
    title: (
      <>
        Invisible strength. <span className="text-accent">Engineered</span> for flagships.
      </>
    ),
    text: "Aerospace-grade tempered glass, privacy filters and camera armor — laser-cut for iPhone and Samsung Galaxy, and backed by a 12-month warranty.",
    primary: { href: "/shop", label: "Shop the collection" },
    secondary: { href: "/installation", label: "Installation guide" },
    Visual: PhoneVisual,
    chips: [
      { icon: Zap, label: "Impact test", value: "3.2×", sub: "stronger than standard glass" },
      { icon: ShieldCheck, label: "100% genuine", value: "12 mo", sub: "warranty on every protector" },
    ],
  },
  {
    key: "clarity",
    eyebrow: "New · Anti-glare clarity glass",
    title: (
      <>
        Less glare. <span className="text-accent">More clarity.</span>
      </>
    ),
    text: "Anti-reflective nano-coating keeps your screen readable under Dhaka sun — now cut for the iPhone 17 and Galaxy S25 lineups.",
    primary: { href: "/shop?category=tempered-glass", label: "Shop clarity glass" },
    secondary: { href: "/shop/iphone", label: "iPhone 17 lineup" },
    Visual: GlassLiftVisual,
    chips: [
      { icon: Sparkles, label: "AR coating", value: "99.9%", sub: "light transmission" },
      { icon: Fingerprint, label: "Touch", value: "100%", sub: "sensitivity preserved" },
    ],
  },
  {
    key: "privacy",
    eyebrow: "Privacy armor",
    title: (
      <>
        Your screen. <span className="text-accent">Your business.</span>
      </>
    ),
    text: "Micro-louver privacy glass blacks out side views beyond 30° — made for the metro, the office and every café in between.",
    primary: { href: "/shop?category=privacy-glass", label: "Shop privacy glass" },
    secondary: { href: "/shop/samsung", label: "Galaxy S25 series" },
    Visual: PrivacyVisual,
    chips: [
      { icon: EyeOff, label: "Privacy angle", value: "30°", sub: "side views blacked out" },
      { icon: ShieldCheck, label: "Face ID", value: "Ready", sub: "sensor-safe cut-outs" },
    ],
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -14, filter: "blur(6px)", transition: { duration: 0.3 } },
};

function ParallaxStage({ children }: { children: React.ReactNode }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 16 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 16 });

  return (
    <motion.div
      className="relative mx-auto w-full max-w-md [perspective:1200px] lg:max-w-none"
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
      initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

function FloatingChip({ chip, className, delay = 0 }: { chip: Chip; className: string; delay?: number }) {
  const Icon = chip.icon;
  return (
    <motion.div
      className={cn("glass absolute hidden rounded-2xl p-4 sm:block", className)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        opacity: { duration: 0.4, delay },
        scale: { duration: 0.4, delay },
        y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay },
      }}
    >
      <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
        <Icon size={12} className="text-accent" /> {chip.label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-accent">{chip.value}</p>
      <p className="text-xs text-muted">{chip.sub}</p>
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
      className="relative overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg/60" />
      <motion.div
        className="pointer-events-none absolute -top-32 left-1/4 h-[32rem] w-[32rem] rounded-full bg-accent/15 blur-[140px]"
        animate={{ x: [0, 40, 0], y: [0, 24, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute right-0 top-20 h-[28rem] w-[28rem] rounded-full bg-white/[0.04] blur-[140px]"
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container-page relative grid items-center gap-8 pb-12 pt-8 sm:gap-12 sm:pb-16 sm:pt-10 md:pt-16 lg:min-h-[42rem] lg:grid-cols-2 lg:gap-8">
        <div className="space-y-8">
          <div className="grid">
          <AnimatePresence initial={false}>
            <motion.div
              key={slide.key}
              className="col-start-1 row-start-1 space-y-8"
              initial="hidden"
              animate="show"
              exit="exit"
              variants={container}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
            >
              <motion.div variants={item}>
                <Eyebrow>{slide.eyebrow}</Eyebrow>
              </motion.div>
              <motion.h1 variants={item} className="text-[2.35rem] font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-7xl">
                {slide.title}
              </motion.h1>
              <motion.p variants={item} className="max-w-lg text-base text-pretty text-muted sm:text-lg">
                {slide.text}
              </motion.p>
              <motion.div variants={item} className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <ButtonLink href={slide.primary.href} size="lg" className="w-full sm:w-auto">
                  {slide.primary.label} <ArrowRight size={18} />
                </ButtonLink>
                <ButtonLink href={slide.secondary.href} size="lg" variant="outline" className="w-full sm:w-auto">
                  {slide.key === "armor" && <Wrench size={18} />} {slide.secondary.label}
                </ButtonLink>
              </motion.div>
            </motion.div>
          </AnimatePresence>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {["#38bdf8", "#a1a1aa", "#52525b", "#e4e4e7"].map((c) => (
                  <span key={c} className="size-8 rounded-full border-2 border-black" style={{ background: `linear-gradient(135deg, ${c}, #111)` }} />
                ))}
              </div>
              <div>
                <Rating value={4.8} size={13} />
                <p className="mt-0.5 text-xs text-muted">Trusted by 50,000+ phone owners in Bangladesh</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-xs tabular-nums text-muted">
                <span className="text-fg">0{index + 1}</span> / 0{slides.length}
              </span>
              <div className="flex gap-1.5">
                {slides.map((s, i) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === index ? "true" : undefined}
                    className="relative h-1 w-8 overflow-hidden rounded-full bg-white/15 transition-all hover:bg-white/25"
                  >
                    {i === index && (
                      <motion.span
                        key={`${s.key}-${paused}`}
                        className="absolute inset-y-0 left-0 rounded-full bg-accent"
                        initial={{ width: paused ? "100%" : "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: paused ? 0 : SLIDE_MS / 1000, ease: "linear" }}
                      />
                    )}
                    {i < index && <span className="absolute inset-0 rounded-full bg-white/40" />}
                  </button>
                ))}
              </div>
              <div className="flex gap-1">
                <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className="grid size-8 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent/50 hover:text-fg">
                  <ChevronLeft size={15} />
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next slide" className="grid size-8 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent/50 hover:text-fg">
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <ParallaxStage>
          <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="aspect-square w-[88%] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgb(56_189_248/0.35)_60deg,transparent_140deg,rgb(255_255_255/0.12)_220deg,transparent_300deg)] opacity-60 blur-2xl animate-spin-slow" />
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="aspect-square w-[78%] rounded-full border border-white/[0.06]" />
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="aspect-square w-[60%] rounded-full border border-dashed border-accent/15" />
          </div>
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 size-0">
            <span className="absolute size-2 rounded-full bg-accent shadow-[0_0_16px_4px_rgba(56,189,248,0.7)] animate-orbit [--orbit-radius:min(39vw,210px)]" />
            <span className="absolute size-1.5 rounded-full bg-white/80 shadow-[0_0_12px_3px_rgba(255,255,255,0.35)] animate-orbit [--orbit-radius:min(30vw,160px)] [animation-delay:-6s] [animation-duration:12s]" />
            <span className="absolute size-1.5 rounded-full bg-accent/70 shadow-[0_0_12px_3px_rgba(56,189,248,0.45)] animate-orbit [--orbit-radius:min(39vw,210px)] [animation-delay:-11s]" />
          </div>

          <div className="grid">
          <AnimatePresence initial={false}>
            <motion.div
              key={slide.key}
              className="relative col-start-1 row-start-1"
              initial={{ opacity: 0, scale: 0.92, rotate: -4, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.04, rotate: 3, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <slide.Visual />
              <FloatingChip chip={slide.chips[0]} className="-left-2 bottom-16 lg:-left-8" delay={0.25} />
              <FloatingChip chip={slide.chips[1]} className="-right-2 top-16 lg:right-0" delay={0.4} />
            </motion.div>
          </AnimatePresence>
          </div>
        </ParallaxStage>
      </div>

      <div className="container-page relative">
        <motion.dl
          className="card-premium grid grid-cols-3 divide-x divide-line rounded-3xl"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              className="flex flex-col-reverse px-4 py-6 text-center md:py-8"
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
            >
              <dt className="mt-1 text-xs text-muted md:text-sm">{s.label}</dt>
              <dd className="font-mono text-2xl font-semibold tracking-tight md:text-4xl">{s.value}</dd>
            </motion.div>
          ))}
        </motion.dl>
        <a href="#explore" aria-label="Scroll to explore" className="mx-auto mt-8 flex w-fit flex-col items-center gap-1 text-subtle transition-colors hover:text-accent">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Explore</span>
          <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
            <ChevronDown size={18} />
          </motion.span>
        </a>
      </div>
    </section>
  );
}

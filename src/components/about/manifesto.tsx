"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { interpolate } from "@/lib/interpolate";
import { cn } from "@/lib/utils";

const VIDEO_SRC = "/brand/hydra-animation.mp4";

/** Manifesto: words light up — brand video as soft background (no SVG draw). */
export function Manifesto({ text, highlight }: { text: string; highlight: readonly string[] }) {
  const mounted = useHasMounted();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const progress = useMotionValue(reduced ? 1 : 0);
  const words = text.split(" ");

  useEffect(() => {
    if (!mounted || reduced || !inView) return;
    const anim = animate(progress, 1, { duration: 2.8, ease: [0.65, 0, 0.35, 1] });
    return () => anim.stop();
  }, [mounted, inView, progress, reduced]);

  return (
    <section ref={ref} className="relative overflow-hidden py-28 md:py-36" aria-label="Our manifesto">
      <div
        className="pointer-events-none absolute -right-[8%] top-1/2 w-[min(92vw,42rem)] -translate-y-1/2 opacity-35 md:-right-[4%] md:w-[min(58vw,40rem)]"
        aria-hidden
      >
        <video src={VIDEO_SRC} className="w-full object-contain" autoPlay muted loop playsInline preload="metadata" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-line to-transparent" />

      <div className="container-page relative">
        <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">Manifesto</p>
        <p className="max-w-3xl text-[1.65rem] font-semibold leading-[1.18] tracking-tight text-fg sm:text-3xl md:max-w-4xl md:text-5xl lg:text-6xl">
          {words.map((word, i) => {
            const highlighted = highlight.includes(word.replace(/[^\w']/g, ""));
            if (!mounted) {
              return (
                <span key={i}>
                  <span className={cn("inline-block translate-y-2 opacity-40", highlighted && "text-fg")}>{word}</span>{" "}
                </span>
              );
            }
            return (
              <Word
                key={i}
                word={word}
                progress={progress}
                range={[0.08 + (i / words.length) * 0.78, 0.08 + ((i + 1) / words.length) * 0.78]}
                highlight={highlighted}
              />
            );
          })}
        </p>
      </div>
    </section>
  );
}

function Word({ word, progress, range, highlight }: { word: string; progress: MotionValue<number>; range: [number, number]; highlight: boolean }) {
  const opacity = useTransform(progress, (v) => interpolate(v, range, [0.4, 1]));
  const y = useTransform(progress, (v) => interpolate(v, range, [8, 0]));

  return (
    <>
      <motion.span className={cn("inline-block text-fg", highlight && "text-fg")} style={{ opacity, y }}>
        {word}
      </motion.span>{" "}
    </>
  );
}

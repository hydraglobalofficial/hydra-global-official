"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { HydraCreature } from "@/components/hydra/hydra-creature";
import { interpolate } from "@/lib/interpolate";
import { cn } from "@/lib/utils";

/** Manifesto: words light up while the HYDRA rises — no sticky scroll lock. */
export function Manifesto({ text, highlight }: { text: string; highlight: readonly string[] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const progress = useMotionValue(reduced ? 1 : 0);
  const words = text.split(" ");

  useEffect(() => {
    if (reduced || !inView) return;
    const anim = animate(progress, 1, { duration: 2.8, ease: [0.65, 0, 0.35, 1] });
    return () => anim.stop();
  }, [inView, progress, reduced]);

  return (
    <section ref={ref} className="relative overflow-hidden py-24 md:py-28" aria-label="Our manifesto">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-25 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_72%)]" />
      <motion.div
        className="pointer-events-none absolute -right-[8%] top-1/2 w-[min(92vw,42rem)] -translate-y-1/2 opacity-40 md:-right-[4%] md:w-[min(58vw,40rem)]"
        aria-hidden
      >
        <HydraCreature progress={progress} ghost className="w-full" />
      </motion.div>
      <div className="pointer-events-none absolute left-1/3 top-1/2 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1e3a8a]/20 blur-[120px]" />

      <div className="container-page relative">
        <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">Manifesto</p>
        <p className="max-w-3xl text-3xl font-semibold leading-[1.2] tracking-tight md:max-w-4xl md:text-5xl lg:text-6xl">
          {words.map((word, i) => (
            <Word
              key={i}
              word={word}
              progress={progress}
              range={[0.08 + (i / words.length) * 0.78, 0.08 + ((i + 1) / words.length) * 0.78]}
              highlight={highlight.includes(word.replace(/[^\w']/g, ""))}
            />
          ))}
        </p>
      </div>
    </section>
  );
}

function Word({ word, progress, range, highlight }: { word: string; progress: MotionValue<number>; range: [number, number]; highlight: boolean }) {
  const opacity = useTransform(progress, (v) => interpolate(v, range, [0.12, 1]));
  const y = useTransform(progress, (v) => interpolate(v, range, [8, 0]));

  return (
    <>
      <motion.span className={cn("inline-block", highlight && "text-accent")} style={{ opacity, y }}>
        {word}
      </motion.span>{" "}
    </>
  );
}

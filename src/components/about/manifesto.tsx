"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { HydraCreature } from "@/components/hydra/hydra-creature";
import { interpolate } from "@/lib/interpolate";
import { cn } from "@/lib/utils";

/** Sticky manifesto: words light up while the HYDRA rises behind the copy. */
export function Manifesto({ text, highlight }: { text: string; highlight: readonly string[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const complete = useMotionValue(1);
  const scroll = reduced ? complete : scrollYProgress;
  const progress = useTransform(scroll, (v) => interpolate(v, [0.05, 0.72], [0, 1]));
  const driftX = useTransform(scroll, (v) => interpolate(v, [0, 1], [40, -20]));
  const driftY = useTransform(scroll, (v) => interpolate(v, [0, 1], [30, -40]));
  const words = text.split(" ");

  return (
    <section ref={ref} className={cn("relative", reduced ? "py-24" : "h-[280vh]")} aria-label="Our manifesto">
      <div className={cn("flex items-center overflow-hidden", !reduced && "sticky top-0 h-svh")}>
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-25 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_72%)]" />
        <motion.div
          className="pointer-events-none absolute -right-[8%] top-1/2 w-[min(92vw,42rem)] -translate-y-1/2 md:-right-[4%] md:w-[min(58vw,40rem)]"
          style={{ x: driftX, y: driftY }}
          aria-hidden
        >
          <HydraCreature progress={progress} ghost className="w-full" />
        </motion.div>
        <motion.div
          className="pointer-events-none absolute left-1/3 top-1/2 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]"
          style={{ opacity: progress }}
        />

        <div className="container-page relative">
          <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">Manifesto</p>
          <p className="max-w-3xl text-3xl font-semibold leading-[1.2] tracking-tight md:max-w-4xl md:text-5xl lg:text-6xl">
            {words.map((word, i) => (
              <Word
                key={i}
                word={word}
                scroll={scroll}
                range={[0.08 + (i / words.length) * 0.78, 0.08 + ((i + 1) / words.length) * 0.78]}
                highlight={highlight.includes(word.replace(/[^\w']/g, ""))}
              />
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

function Word({ word, scroll, range, highlight }: { word: string; scroll: MotionValue<number>; range: [number, number]; highlight: boolean }) {
  const opacity = useTransform(scroll, (v) => interpolate(v, range, [0.12, 1]));
  const y = useTransform(scroll, (v) => interpolate(v, range, [8, 0]));

  return (
    <>
      <motion.span className={cn("inline-block", highlight && "text-accent")} style={{ opacity, y }}>
        {word}
      </motion.span>{" "}
    </>
  );
}

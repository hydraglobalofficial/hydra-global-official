"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { LogoMark } from "@/components/layout/logo";
import { interpolate } from "@/lib/interpolate";
import { cn } from "@/lib/utils";

/** Sticky statement whose words light up one by one as the visitor scrolls. */
export function Manifesto({ text, highlight }: { text: string; highlight: readonly string[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const complete = useMotionValue(1);
  const scroll = reduced ? complete : scrollYProgress;
  const rotate = useTransform(scroll, (v) => v * 120);
  const emblemScale = useTransform(scroll, (v) => interpolate(v, [0, 1], [0.85, 1.15]));
  const words = text.split(" ");

  return (
    <section ref={ref} className={cn("relative", reduced ? "py-24" : "h-[260vh]")} aria-label="Our manifesto">
      <div className={cn("flex items-center overflow-hidden", !reduced && "sticky top-0 h-svh")}>
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.07]"
          style={{ rotate, scale: emblemScale }}
          aria-hidden
        >
          <LogoMark className="size-[34rem] md:size-[46rem]" />
        </motion.div>
        <div className="container-page relative">
          <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">Manifesto</p>
          <p className="max-w-5xl text-3xl font-semibold leading-[1.2] tracking-tight md:text-5xl lg:text-6xl">
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
  const y = useTransform(scroll, (v) => interpolate(v, range, [6, 0]));

  return (
    <>
      <motion.span className={cn("inline-block", highlight && "text-accent")} style={{ opacity, y }}>
        {word}
      </motion.span>{" "}
    </>
  );
}

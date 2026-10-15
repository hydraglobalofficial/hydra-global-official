"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { interpolate } from "@/lib/interpolate";
import { cn } from "@/lib/utils";

/** Sticky statement — words light up one by one as the visitor scrolls. */
export function Manifesto({ text, highlight }: { text: string; highlight: readonly string[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const complete = useMotionValue(1);
  const scroll = reduced ? complete : scrollYProgress;
  const words = text.split(" ");

  return (
    <section ref={ref} className={cn("relative", reduced ? "py-24" : "h-[260vh]")} aria-label="Our manifesto">
      <div className={cn("flex items-center overflow-hidden", !reduced && "sticky top-0 h-svh")}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-line to-transparent" />

        <div className="container-page relative">
          <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">Manifesto</p>
          <p className="max-w-5xl text-[1.65rem] font-semibold leading-[1.18] tracking-tight text-fg sm:text-3xl md:text-5xl lg:text-6xl">
            {words.map((word, i) => (
              <Word
                key={`${word}-${i}`}
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

function Word({
  word,
  scroll,
  range,
  highlight,
}: {
  word: string;
  scroll: MotionValue<number>;
  range: [number, number];
  highlight: boolean;
}) {
  const opacity = useTransform(scroll, (v) => interpolate(v, range, [0.12, 1]));
  const y = useTransform(scroll, (v) => interpolate(v, range, [6, 0]));

  return (
    <>
      <motion.span className={cn("inline-block", highlight && "text-gradient")} style={{ opacity, y }}>
        {word}
      </motion.span>{" "}
    </>
  );
}

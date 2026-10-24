"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const meanings = [
  { label: "Protection", text: "Armor that takes the hit." },
  { label: "Precision", text: "Cut to your exact device." },
  { label: "Progression", text: "Built for what comes next." },
];

const ease = [0.16, 1, 0.3, 1] as const;

/** About statement. The three meanings settle down the rail, one after another. */
export function Manifesto({ text, highlight }: { text: string; highlight: readonly string[] }) {
  const reduce = useReducedMotion();
  const marks = new Set(highlight.map((word) => word.toLowerCase()));
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <section className="border-y border-line/70 py-14 sm:py-20 md:py-24" aria-label="Our manifesto">
      <div className="container-page grid items-start gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,24rem)] lg:items-center lg:gap-20">
        <motion.div
          className="min-w-0"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.8, ease }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">Manifesto</p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-fg sm:text-lg md:text-xl md:leading-8">
            {words.map((word, i) => {
              const clean = word.replace(/[^\w']/g, "").toLowerCase();
              return (
                <span key={`${word}-${i}`}>
                  <span className={cn(marks.has(clean) && "font-medium text-accent")}>{word}</span>{" "}
                </span>
              );
            })}
          </p>
        </motion.div>

        <div className="relative">
          <motion.span
            aria-hidden
            className="absolute bottom-6 left-[15px] top-6 w-px origin-top bg-gradient-to-b from-accent via-accent/35 to-transparent"
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.15, ease, delay: 0.12 }}
          />
          <ol className="relative grid gap-3">
            {meanings.map((item, i) => (
              <motion.li
                key={item.label}
                className="relative flex gap-4 rounded-2xl border border-line bg-surface/80 px-3.5 py-3.5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] backdrop-blur-sm sm:px-4 sm:py-4"
                initial={reduce ? false : { opacity: 0, y: -22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.72, ease, delay: 0.22 + i * 0.18 }}
              >
                <span className="relative z-10 mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-accent/30 bg-bg font-mono text-[10px] text-accent">
                  0{i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-semibold tracking-tight text-fg">{item.label}</span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-muted">{item.text}</span>
                </span>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

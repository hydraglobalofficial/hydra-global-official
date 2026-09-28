"use client";

import { useRef } from "react";
import { BadgeCheck, Cpu, HeartHandshake, Leaf, Lightbulb, Scale } from "lucide-react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { interpolate } from "@/lib/interpolate";
import { cn } from "@/lib/utils";

const values = [
  {
    icon: Cpu,
    title: "Engineering first",
    keyword: "Precision",
    text: "Every product starts in CAD against real device scans — never a generic template. If it isn't cut to ±0.05 mm, it doesn't ship.",
    tone: "from-accent/25 text-accent",
  },
  {
    icon: BadgeCheck,
    title: "Radical authenticity",
    keyword: "Genuine",
    text: "Sealed packaging and a unique authenticity code on every box. What we say is inside is exactly what you get.",
    tone: "from-accent-3/20 text-accent-3",
  },
  {
    icon: HeartHandshake,
    title: "Customer obsessed",
    keyword: "People",
    text: "A local team that answers personally, a 12-month warranty, and replacements dispatched within 24 hours.",
    tone: "from-accent-2/25 text-accent-2",
  },
  {
    icon: Scale,
    title: "Integrity always",
    keyword: "Trust",
    text: "Honest pricing, VAT-compliant invoicing and no inflated claims. We would rather lose a sale than a customer's trust.",
    tone: "from-warning/20 text-warning",
  },
  {
    icon: Lightbulb,
    title: "Relentless innovation",
    keyword: "Progress",
    text: "Like the Hydra, we keep growing new heads — privacy layers, camera armor and coatings tested in our own lab.",
    tone: "from-accent/25 text-accent",
  },
  {
    icon: Leaf,
    title: "Responsible growth",
    keyword: "Future",
    text: "Recyclable packaging, fair local employment and partnerships that let small retailers across Bangladesh grow with us.",
    tone: "from-success/20 text-success",
  },
] as const;

/** Core values as cards that pin and stack on top of each other while scrolling. */
export function ValuesStack() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <div ref={ref} className="relative">
      {values.map((value, i) => (
        <ValueCard key={value.title} value={value} index={i} total={values.length} progress={scrollYProgress} />
      ))}
    </div>
  );
}

function ValueCard({
  value,
  index,
  total,
  progress,
}: {
  value: (typeof values)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const depth = total - 1 - index;
  const scale = useTransform(progress, (v) => interpolate(v, [index / total, 1], [1, 1 - depth * 0.035]));
  const dim = useTransform(progress, (v) => interpolate(v, [index / total, 1], [0, depth * 0.1]));
  const Icon = value.icon;

  return (
    <div className={cn("sticky", index < total - 1 && "mb-[12vh]")} style={{ top: `calc(7rem + ${index * 1.25}rem)` }}>
      <motion.div className="rounded-[2rem] bg-bg" style={{ scale, transformOrigin: "50% 0%" }}>
        <article className="card-premium relative overflow-hidden rounded-[2rem] p-7 md:p-10">
          <div className={cn("pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-gradient-to-br to-transparent blur-3xl", value.tone)} />
          <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="font-mono text-xs text-subtle">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight md:text-4xl">{value.title}</h3>
              <p className="mt-4 max-w-xl text-pretty text-muted md:text-lg">{value.text}</p>
            </div>
            <div className="flex items-center gap-4 md:flex-col md:items-end">
              <div className={cn("grid size-16 place-items-center rounded-2xl border border-line bg-gradient-to-br to-transparent md:size-20", value.tone)}>
                <Icon size={30} strokeWidth={1.6} />
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-subtle">{value.keyword}</span>
            </div>
          </div>
          <motion.div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: dim }} />
        </article>
      </motion.div>
    </div>
  );
}

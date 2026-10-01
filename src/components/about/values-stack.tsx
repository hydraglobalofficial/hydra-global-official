"use client";

import { useRef } from "react";
import { BadgeCheck, Cpu, HeartHandshake, Leaf, Lightbulb, Scale } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { interpolate } from "@/lib/interpolate";
import { cn } from "@/lib/utils";

const values = [
  {
    icon: Cpu,
    title: "Engineering first",
    keyword: "Precision",
    text: "Every product starts in CAD against real device scans — never a generic template. If it isn't cut to ±0.05 mm, it doesn't ship.",
  },
  {
    icon: BadgeCheck,
    title: "Radical authenticity",
    keyword: "Genuine",
    text: "Sealed packaging and a unique authenticity code on every box. What we say is inside is exactly what you get.",
  },
  {
    icon: HeartHandshake,
    title: "Customer obsessed",
    keyword: "People",
    text: "A local team that answers personally, a 12-month warranty, and replacements dispatched within 24 hours.",
  },
  {
    icon: Scale,
    title: "Integrity always",
    keyword: "Trust",
    text: "Honest pricing, VAT-compliant invoicing and no inflated claims. We would rather lose a sale than a customer's trust.",
  },
  {
    icon: Lightbulb,
    title: "Relentless innovation",
    keyword: "Progress",
    text: "Like the Hydra, we keep growing new heads — privacy layers, camera armor and coatings tested in our own lab.",
  },
  {
    icon: Leaf,
    title: "Responsible growth",
    keyword: "Future",
    text: "Recyclable packaging, fair local employment and partnerships that let small retailers across Bangladesh grow with us.",
  },
] as const;

/**
 * Core values as sticky stacked cards.
 * Each card pins under the header; the next one slides over it while
 * earlier cards gently scale + dim — so the stack reads as one composition.
 */
export function ValuesStack() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  if (reduced) {
    return (
      <div className="space-y-4">
        {values.map((value, i) => (
          <StaticValueCard key={value.title} value={value} index={i} total={values.length} />
        ))}
      </div>
    );
  }

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
  const slot = 1 / total;

  // Hold full size until the next card arrives, then ease into the stack.
  const scale = useTransform(progress, (v) =>
    interpolate(v, [index * slot, (index + 1) * slot, 1], [1, 1, 1 - depth * 0.045]),
  );
  const y = useTransform(progress, (v) =>
    interpolate(v, [index * slot, (index + 1) * slot, 1], [0, 0, depth * -10]),
  );
  const dim = useTransform(progress, (v) =>
    interpolate(v, [index * slot, (index + 1) * slot, 1], [0, 0, Math.min(0.55, depth * 0.12)]),
  );
  const glow = useTransform(progress, (v) =>
    interpolate(v, [(index - 0.15) * slot, index * slot, (index + 0.85) * slot], [0.15, 1, 0.35]),
  );

  const Icon = value.icon;

  return (
    <div
      className="sticky top-[5.75rem] z-[1] flex min-h-[min(72vh,28rem)] items-start pb-5 sm:top-[6.5rem] md:top-[7.25rem]"
      style={{ zIndex: index + 1 }}
    >
      <motion.article
        className="card-premium group relative w-full overflow-hidden rounded-[1.75rem] p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] sm:rounded-[2rem] sm:p-8 md:p-10"
        style={{ scale, y, transformOrigin: "50% 0%" }}
        whileHover={{ borderColor: "rgba(30,64,175,0.35)" }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        <motion.div
          className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-accent/30 blur-3xl"
          style={{ opacity: glow }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

        <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] text-subtle">
              {String(index + 1).padStart(2, "0")}
              <span className="mx-2 text-white/15">/</span>
              {String(total).padStart(2, "0")}
            </p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-balance sm:text-3xl md:text-4xl">{value.title}</h3>
            <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted sm:text-base md:text-lg">{value.text}</p>
          </div>

          <div className="flex items-center gap-4 md:flex-col md:items-end md:gap-3">
            <motion.div
              className="grid size-14 place-items-center rounded-2xl border border-accent/30 bg-accent/10 text-accent shadow-[0_0_40px_-12px_rgba(30,64,175,0.8)] sm:size-16 md:size-20"
              whileHover={{ scale: 1.06, rotate: -3 }}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
            >
              <Icon size={28} strokeWidth={1.55} />
            </motion.div>
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-subtle sm:text-[11px]">{value.keyword}</span>
          </div>
        </div>

        <motion.div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-black" style={{ opacity: dim }} />
      </motion.article>
    </div>
  );
}

function StaticValueCard({
  value,
  index,
  total,
}: {
  value: (typeof values)[number];
  index: number;
  total: number;
}) {
  const Icon = value.icon;
  return (
    <article className="card-premium relative overflow-hidden rounded-[1.75rem] p-6 sm:rounded-[2rem] sm:p-8 md:p-10">
      <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="font-mono text-[11px] tracking-[0.22em] text-subtle">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{value.title}</h3>
          <p className="mt-3 max-w-xl text-pretty text-muted">{value.text}</p>
        </div>
        <div className={cn("flex items-center gap-3 md:flex-col md:items-end")}>
          <div className="grid size-14 place-items-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
            <Icon size={26} strokeWidth={1.55} />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-subtle">{value.keyword}</span>
        </div>
      </div>
    </article>
  );
}

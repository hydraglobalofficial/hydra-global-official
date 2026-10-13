"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useTransform, type MotionValue } from "motion/react";
import { interpolate } from "@/lib/interpolate";
import { cn } from "@/lib/utils";

/** Public crest used for the head assembly animation. */
export const HYDRA_SRC = "/products/Hydra_Animation.png";

export type HydraHead = {
  label: string;
  caption: string;
  tip: { left: number; top: number };
  start: number;
  clip: string;
  fromX?: number;
};

/**
 * Protection · Precision · Progression — driven by Hydra_Animation.png
 * Power core (center) first; side heads arrive as complete pieces.
 */
export const hydraHeads: HydraHead[] = [
  {
    label: "Protection",
    caption: "Armor that takes the hit",
    tip: { left: 50, top: 5 },
    start: 0.04,
    // Center head + full shared base — side necks stay out
    clip: "polygon(31% 0%, 69% 0%, 65% 48%, 56% 100%, 44% 100%, 35% 48%)",
  },
  {
    label: "Precision",
    caption: "Cut to your exact device",
    tip: { left: 27, top: 17 },
    start: 0.32,
    fromX: -150,
    clip: "polygon(0% 0%, 42% 0%, 49% 45%, 51% 100%, 0% 100%)",
  },
  {
    label: "Progression",
    caption: "Built for what comes next",
    tip: { left: 73, top: 17 },
    start: 0.46,
    fromX: 150,
    clip: "polygon(58% 0%, 100% 0%, 100% 100%, 49% 100%, 51% 45%)",
  },
];

export function headTip(head: HydraHead) {
  return head.tip;
}

export function headRevealRange(head: HydraHead) {
  return [head.start + 0.06, head.start + 0.18] as const;
}

type CreatureProps = {
  progress: MotionValue<number>;
  className?: string;
  ghost?: boolean;
  still?: boolean;
};

const IMAGE_SIZES = "(min-width: 1024px) 760px, (min-width: 768px) 580px, 400px";

/**
 * Hydra_Animation.png assemble from the power spine:
 * 1) Center alone
 * 2) Left side slides in
 * 3) Right side slides in
 * 4) Merge to full crest
 *
 * Sit the crest on a themed stage (dark absorbs the PNG black plate; light uses a designed charcoal well).
 */
export function HydraCreature({ progress, className, ghost = false, still = false }: CreatureProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const glowOpacity = useTransform(progress, (v) =>
    interpolate(v, [0, 0.12, 1], [0, ghost ? 0.18 : 0.4, ghost ? 0.2 : 0.5]),
  );
  const glowScale = useTransform(progress, (v) => interpolate(v, [0, 0.22, 1], [0.55, 1, 1.02]));
  const layersOpacity = useTransform(progress, (v) => interpolate(v, [0.74, 0.86], [1, 0]));
  const fullOpacity = useTransform(progress, (v) => interpolate(v, [0.74, 0.86], [0, ghost ? 0.28 : 1]));

  if (!mounted) {
    return (
      <div className={cn("hydra-crest-art relative mx-auto aspect-[3930/3454] w-full", className)} aria-hidden>
        <div className="absolute inset-0 opacity-20">
          <Image src={HYDRA_SRC} alt="" fill sizes={IMAGE_SIZES} className="object-contain" priority={!ghost} quality={95} />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={cn("hydra-crest-art relative mx-auto aspect-[3930/3454] w-full overflow-visible", className)}
      aria-hidden
      animate={still || ghost ? undefined : { y: [0, -5, 0] }}
      transition={still || ghost ? undefined : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[44%] size-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14)_0%,transparent_68%)] blur-[70px] light:opacity-0"
        style={{ opacity: glowOpacity, scale: glowScale }}
      />

      <motion.div className="absolute inset-0" style={{ opacity: layersOpacity }}>
        {hydraHeads.map((head) => (
          <HeadLayer key={head.label} head={head} progress={progress} ghost={ghost} />
        ))}
      </motion.div>

      <motion.div className="absolute inset-0" style={{ opacity: fullOpacity }}>
        <Image
          src={HYDRA_SRC}
          alt=""
          fill
          sizes={IMAGE_SIZES}
          quality={95}
          className="object-contain"
          priority={!ghost}
        />
      </motion.div>
    </motion.div>
  );
}

function HeadLayer({ head, progress, ghost }: { head: HydraHead; progress: MotionValue<number>; ghost: boolean }) {
  const isSide = head.fromX != null;
  const arriveEnd = head.start + (isSide ? 0.16 : 0.13);

  const opacity = useTransform(progress, (v) => {
    if (v < head.start) return 0;
    if (isSide) {
      return interpolate(v, [head.start, head.start + 0.02], [0, ghost ? 0.34 : 1]);
    }
    return interpolate(v, [head.start, arriveEnd], [0, ghost ? 0.34 : 1]);
  });

  const x = useTransform(progress, (v) => {
    if (!isSide) return 0;
    if (v < head.start) return head.fromX ?? 0;
    return interpolate(v, [head.start, arriveEnd], [head.fromX ?? 0, 0]);
  });

  const y = useTransform(progress, (v) => {
    if (isSide) return interpolate(v, [head.start, arriveEnd], [6, 0]);
    // Center rises from the power base
    return interpolate(v, [head.start, arriveEnd], [22, 0]);
  });

  const scale = useTransform(progress, (v) => {
    if (!isSide) {
      // Power core scales up from the spine
      return interpolate(v, [head.start, arriveEnd], [0.88, 1]);
    }
    if (v < head.start) return 0.96;
    return interpolate(v, [head.start, arriveEnd], [0.96, 1]);
  });

  const visibility = useTransform(opacity, (o) => (o < 0.01 ? "hidden" : "visible"));

  return (
    <motion.div
      className="absolute inset-0 will-change-transform"
      style={{
        opacity,
        x,
        y,
        scale,
        visibility,
        clipPath: head.clip,
        WebkitClipPath: head.clip,
        transformOrigin: isSide ? `${head.tip.left}% ${head.tip.top}%` : "50% 72%",
      }}
    >
      <Image src={HYDRA_SRC} alt="" fill sizes={IMAGE_SIZES} quality={95} className="object-contain" />
    </motion.div>
  );
}

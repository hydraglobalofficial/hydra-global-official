"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "motion/react";
import { interpolate } from "@/lib/interpolate";
import { cn } from "@/lib/utils";

export const HYDRA_SRC = "/products/Hydra_Animation.png";

export type HydraHead = {
  label: string;
  caption: string;
  clip: string;
  tip: { left: number; top: number };
  start: number;
  fromX?: number;
};

/**
 * Three heads = Protection · Precision · Progression.
 * Side clips keep full body height (minimal bottom crop) so dragons aren't cut in half.
 */
export const hydraHeads: HydraHead[] = [
  {
    label: "Protection",
    caption: "Armor that takes the hit",
    clip: "inset(0% 28% 2% 28%)",
    tip: { left: 50, top: 4 },
    start: 0.06,
  },
  {
    label: "Precision",
    caption: "Cut to your exact device",
    clip: "inset(0% 48% 2% 0%)",
    tip: { left: 30, top: 17 },
    start: 0.34,
    fromX: -88,
  },
  {
    label: "Progression",
    caption: "Built for what comes next",
    clip: "inset(0% 0% 2% 48%)",
    tip: { left: 70, top: 17 },
    start: 0.44,
    fromX: 88,
  },
];

export function headTip(head: HydraHead) {
  return head.tip;
}

export function headRevealRange(head: HydraHead) {
  return [head.start + 0.14, head.start + 0.26] as const;
}

type CreatureProps = {
  progress: MotionValue<number>;
  className?: string;
  ghost?: boolean;
  still?: boolean;
};

/**
 * Metallic three-headed HYDRA. Progress 0→1:
 * glow → center head → side heads (full body) → merged body at full size (no grow).
 */
export function HydraCreature({ progress, className, ghost = false, still = false }: CreatureProps) {
  const glowOpacity = useTransform(progress, (v) => interpolate(v, [0, 0.1, 1], [0, ghost ? 0.4 : 0.9, ghost ? 0.5 : 1]));
  const glowScale = useTransform(progress, (v) => interpolate(v, [0, 0.22, 1], [0.45, 1, 1.08]));
  const ring = useTransform(progress, (v) => interpolate(v, [0.04, 0.4], [0.35, 1]));
  const ringOuter = useTransform(ring, (v) => v * 1.08);
  const ringMid = useTransform(ring, (v) => v * 0.92);
  const ringOpacity = useTransform(progress, (v) => interpolate(v, [0.04, 0.18, 0.75, 1], [0, 0.65, 0.35, 0.22]));
  // Appear at full size immediately — no grow-up scale.
  const bodyOpacity = useTransform(progress, (v) => interpolate(v, [0.62, 0.72], [0, ghost ? 0.28 : 1]));
  const beam = useTransform(progress, (v) => interpolate(v, [0.75, 1], [-40, 120]));
  const beamOpacity = useTransform(progress, (v) => interpolate(v, [0.72, 0.85, 1], [0, 0.4, 0.1]));

  return (
    <motion.div
      className={cn("relative mx-auto aspect-[3930/3454] w-full", className)}
      aria-hidden
      animate={still || ghost ? undefined : { y: [0, -6, 0] }}
      transition={still || ghost ? undefined : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[44%] size-[95%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1e3a8a]/45 blur-[90px]"
        style={{ opacity: glowOpacity, scale: glowScale }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[48%] size-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-[50px]"
        style={{ opacity: glowOpacity, scale: glowScale }}
      />

      <motion.div
        className="pointer-events-none absolute left-1/2 top-[44%] size-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#1e40af]/40"
        style={{ opacity: ringOpacity, scale: ring }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[44%] size-[64%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
        style={{ opacity: ringOpacity, scale: ringMid }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[44%] size-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/15"
        style={{ opacity: ringOpacity, scale: ringOuter }}
        animate={ghost || still ? undefined : { rotate: 360 }}
        transition={ghost || still ? undefined : { duration: 48, repeat: Infinity, ease: "linear" }}
      />

      {[0, 1, 2, 3, 4, 5].map((i) => (
        <OrbitDot key={i} index={i} progress={progress} ghost={ghost} />
      ))}

      {hydraHeads.map((head) => (
        <HeadLayer key={head.label} head={head} progress={progress} ghost={ghost} />
      ))}

      <motion.div className="absolute inset-0" style={{ opacity: bodyOpacity }}>
        <Image
          src={HYDRA_SRC}
          alt=""
          fill
          sizes="(min-width: 768px) 640px, 400px"
          className={cn("object-contain", !ghost && "drop-shadow-[0_0_40px_rgba(30,58,138,0.45)]")}
          priority={!ghost}
        />
      </motion.div>

      {!ghost && (
        <motion.div
          className="pointer-events-none absolute inset-y-[8%] w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-md"
          style={{ left: beam, opacity: beamOpacity }}
        />
      )}
    </motion.div>
  );
}

function OrbitDot({ index, progress, ghost }: { index: number; progress: MotionValue<number>; ghost: boolean }) {
  const opacity = useTransform(progress, (v) => interpolate(v, [0.2 + index * 0.04, 0.4 + index * 0.04], [0, ghost ? 0.35 : 0.7]));
  const angle = (index / 6) * Math.PI * 2;
  const radius = ghost ? 118 : 138;

  return (
    <motion.span
      className="pointer-events-none absolute left-1/2 top-[44%] size-1.5 rounded-full bg-[#60a5fa] shadow-[0_0_10px_rgba(37,99,235,0.8)]"
      style={{
        opacity,
        x: Math.cos(angle) * radius - 3,
        y: Math.sin(angle) * radius - 3,
      }}
      animate={ghost ? undefined : { scale: [1, 1.55, 1] }}
      transition={ghost ? undefined : { duration: 2.4 + index * 0.2, repeat: Infinity, ease: "easeInOut", delay: index * 0.15 }}
    />
  );
}

function HeadLayer({ head, progress, ghost }: { head: HydraHead; progress: MotionValue<number>; ghost: boolean }) {
  const end = head.start + 0.2;
  const fadeOut = ghost ? 1 : 0.68;
  const opacity = useTransform(progress, (v) =>
    interpolate(v, [head.start, end, fadeOut - 0.04, fadeOut + 0.04], [0, ghost ? 0.35 : 1, ghost ? 0.35 : 1, ghost ? 0.2 : 0]),
  );
  const scale = useTransform(progress, (v) => interpolate(v, [head.start, end], [1, 1]));
  const x = useTransform(progress, (v) => interpolate(v, [head.start, end], [head.fromX ?? 0, 0]));
  const y = useTransform(progress, (v) => interpolate(v, [head.start, end], [head.fromX ? 4 : 16, 0]));

  return (
    <motion.div
      className="absolute inset-0 will-change-transform"
      style={{ opacity, scale, x, y, clipPath: head.clip, transformOrigin: `${head.tip.left}% ${head.tip.top}%` }}
    >
      <Image src={HYDRA_SRC} alt="" fill sizes="(min-width: 768px) 640px, 400px" className="object-contain" />
    </motion.div>
  );
}

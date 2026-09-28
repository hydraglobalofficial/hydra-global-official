"use client";

import { useId } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

export type HydraHead = {
  label: string;
  caption: string;
  neck: string;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  start: number;
  back?: boolean;
};

const NECK_DRAW = 0.3;
const HEAD_LENGTH = 58;

/** Back heads come first so they render behind the front three. */
export const hydraHeads: HydraHead[] = [
  { label: "Camera", caption: "Sapphire-grade lens armor", neck: "M200 300 C130 318 80 262 55 215", x: 55, y: 215, rotate: -30, scale: 0.78, start: 0.34, back: true },
  { label: "Fit", caption: "Laser-cut for your exact model", neck: "M200 300 C270 318 320 262 345 215", x: 345, y: 215, rotate: 30, scale: 0.78, start: 0.34, back: true },
  { label: "Privacy", caption: "28° side-view blackout", neck: "M200 300 C150 305 135 215 110 160", x: 110, y: 160, rotate: -24, scale: 0.92, start: 0.24 },
  { label: "Impact", caption: "Drop-tested 9H tempered core", neck: "M200 300 C250 305 265 215 290 160", x: 290, y: 160, rotate: 24, scale: 0.92, start: 0.24 },
  { label: "Clarity", caption: "99.9% HD transparency", neck: "M200 300 C205 260 192 200 200 150", x: 200, y: 150, rotate: 0, scale: 1.05, start: 0.14 },
];

/** Where a head's snout ends up, as a percentage of the 400×400 viewBox. */
export function headTip(head: HydraHead) {
  const rad = (head.rotate * Math.PI) / 180;
  const len = HEAD_LENGTH * head.scale;
  return {
    left: ((head.x + Math.sin(rad) * len) / 400) * 100,
    top: ((head.y - Math.cos(rad) * len) / 400) * 100,
  };
}

export function headRevealRange(head: HydraHead) {
  const end = head.start + NECK_DRAW;
  return [end + 0.02, end + 0.1] as const;
}

/**
 * Line-art five-headed HYDRA. `progress` (0 → 1) drives the whole build:
 * coils, then necks, then heads, then eyes and the shield aura.
 */
export function HydraCreature({ progress, className }: { progress: MotionValue<number>; className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const stroke = `hydra-stroke-${uid}`;
  const aura = `hydra-aura-${uid}`;

  const coil = useTransform(progress, [0, 0.22], [0, 1]);
  const coilVisible = useTransform(progress, [0, 0.01], [0, 1]);
  const tail = useTransform(progress, [0.08, 0.3], [0, 1]);
  const shield = useTransform(progress, [0.7, 0.95], [0, 1]);
  const auraOpacity = useTransform(progress, [0.6, 1], [0, 0.9]);
  const auraScale = useTransform(progress, [0.6, 1], [0.6, 1]);

  return (
    <svg viewBox="0 0 400 400" className={cn("overflow-visible drop-shadow-[0_0_14px_rgba(56,189,248,0.35)]", className)} aria-hidden>
      <defs>
        <linearGradient id={stroke} gradientUnits="userSpaceOnUse" x1="0" y1="40" x2="0" y2="390">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="0.55" stopColor="#7dd3fc" />
          <stop offset="1" stopColor="#e4e4e7" stopOpacity="0.7" />
        </linearGradient>
        <radialGradient id={aura}>
          <stop offset="0" stopColor="#38bdf8" stopOpacity="0.35" />
          <stop offset="0.6" stopColor="#38bdf8" stopOpacity="0.08" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <motion.circle cx="200" cy="200" r="190" fill={`url(#${aura})`} style={{ opacity: auraOpacity, scale: auraScale }} />

      <motion.path
        d="M200 40 L330 115 L330 265 L200 340 L70 265 L70 115 Z"
        fill="none"
        stroke={`url(#${stroke})`}
        strokeWidth="1"
        strokeOpacity="0.45"
        style={{ pathLength: shield, opacity: shield }}
      />

      <g fill="none" stroke={`url(#${stroke})`} strokeLinecap="round" strokeLinejoin="round">
        <motion.path d="M90 342 A110 26 0 1 0 310 342 A110 26 0 1 0 90 342" strokeWidth="2" style={{ pathLength: coil, opacity: coilVisible }} />
        <motion.path d="M110 320 A90 22 0 1 0 290 320 A90 22 0 1 0 110 320" strokeWidth="2.4" style={{ pathLength: coil, opacity: coilVisible }} />
        <motion.path d="M310 342 C352 348 362 372 332 380 C304 388 292 370 308 362" strokeWidth="2" style={{ pathLength: tail, opacity: tail }} />
      </g>

      {hydraHeads.map((head, i) => (
        <NeckAndHead key={head.label} head={head} index={i} progress={progress} stroke={stroke} />
      ))}
    </svg>
  );
}

function NeckAndHead({ head, index, progress, stroke }: { head: HydraHead; index: number; progress: MotionValue<number>; stroke: string }) {
  const end = head.start + NECK_DRAW;
  const draw = useTransform(progress, [head.start, end], [0, 1]);
  const visible = useTransform(progress, [head.start, head.start + 0.01], [0, 1]);
  const headIn = useTransform(progress, [end - 0.04, end + 0.06], [0, 1]);
  const headScale = useTransform(headIn, [0, 1], [0.3, 1]);
  const eyes = useTransform(progress, [0.72, 0.84], [0, 1]);
  const scales = useTransform(progress, [end, end + 0.1], [0, 0.5]);

  return (
    <g opacity={head.back ? 0.7 : 1}>
      <motion.path d={head.neck} fill="none" stroke="#fff" strokeOpacity="0.05" strokeWidth={16 * head.scale} strokeLinecap="round" style={{ pathLength: draw, opacity: visible }} />
      <motion.path d={head.neck} fill="none" stroke={`url(#${stroke})`} strokeWidth={2.4 * head.scale} strokeLinecap="round" style={{ pathLength: draw, opacity: visible }} />
      <motion.path d={head.neck} fill="none" stroke="#e0f2fe" strokeWidth={5 * head.scale} strokeDasharray="1.5 7" strokeLinecap="round" style={{ opacity: scales }} />

      <g transform={`translate(${head.x} ${head.y}) rotate(${head.rotate}) scale(${head.scale})`}>
        <motion.g style={{ opacity: headIn, scale: headScale, originY: 1 }}>
          <motion.g
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ duration: 4 + index * 0.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ originY: 1 }}
          >
            <path
              d="M-13 -20 C-24 -24 -31 -36 -32 -54 M-15 -9 C-24 -9 -30 -15 -33 -24 M13 -20 C24 -24 31 -36 32 -54 M15 -9 C24 -9 30 -15 33 -24"
              fill="none"
              stroke={`url(#${stroke})`}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path d="M-10 0 L-17 -13 L-15 -31 L-7 -47 L0 -58 L7 -47 L15 -31 L17 -13 L10 0 Z" fill="#050608" stroke={`url(#${stroke})`} strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M-15 -34 L-3 -29 M15 -34 L3 -29 M0 -24 L0 -6 M-7 -44 L-3 -49 M7 -44 L3 -49" fill="none" stroke="#e0f2fe" strokeOpacity="0.55" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M-12 -28 L-4 -25 L-11 -22 Z M12 -28 L4 -25 L11 -22 Z" fill="#0b1a20" stroke="#38bdf8" strokeOpacity="0.5" strokeWidth="0.8" strokeLinejoin="round" />
            <motion.g style={{ opacity: eyes }}>
              <ellipse cx="-8.5" cy="-25" rx="7" ry="4" fill="#38bdf8" opacity="0.4" />
              <ellipse cx="8.5" cy="-25" rx="7" ry="4" fill="#38bdf8" opacity="0.4" />
              <path d="M-12 -28 L-4 -25 L-11 -22 Z M12 -28 L4 -25 L11 -22 Z" fill="#f0f9ff" />
            </motion.g>
          </motion.g>
        </motion.g>
      </g>
    </g>
  );
}

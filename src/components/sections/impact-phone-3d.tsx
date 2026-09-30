"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useLocalLockScreen } from "@/hooks/use-local-lock-screen";
import { cn } from "@/lib/utils";

type Stage = "idle" | "hold" | "fall" | "hit" | "crack" | "burst" | "settle";

/** Irregular tempered-glass fracture paths — uneven thickness, real branching. */
const PRIMARY = [
  "M98 208 L71 162 L49 128 L28 94 L14 68",
  "M98 208 L128 171 L151 149 L174 131 L191 108",
  "M98 208 L109 261 L104 312 L99 358 L97 388",
  "M98 208 L74 251 L51 289 L33 328 L21 361",
  "M98 208 L141 231 L163 252 L181 279",
  "M98 208 L84 151 L72 118 L61 89",
];
const BRANCH = [
  "M71 162 L54 179 L41 201",
  "M49 128 L36 141",
  "M128 171 L142 192 L155 214",
  "M151 149 L164 161",
  "M109 261 L124 278 L139 301",
  "M104 312 L118 329",
  "M74 251 L62 268 L51 291",
  "M141 231 L152 244",
  "M84 151 L76 168",
  "M98 208 L115 198 L133 191",
  "M98 208 L82 199 L64 194",
];

const FROST = [
  "M98 208 L71 162 L84 151 Z",
  "M98 208 L128 171 L115 198 Z",
  "M98 208 L109 261 L141 231 Z",
  "M98 208 L74 251 L82 199 Z",
  "M71 162 L49 128 L54 179 Z",
  "M128 171 L151 149 L142 192 Z",
  "M109 261 L104 312 L124 278 Z",
  "M74 251 L51 289 L62 268 Z",
];

/** Photoreal drop demo — no floating badges, no neon FX. */
export function ImpactPhone3D({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-18% 0px" });
  const [stage, setStage] = useState<Stage>("idle");
  const [runId, setRunId] = useState(0);
  const played = useRef(false);

  useEffect(() => {
    if (!inView) return;
    if (played.current && runId === 0) return;
    played.current = true;

    const timers = [
      setTimeout(() => setStage("hold"), 80),
      setTimeout(() => setStage("fall"), 720),
      setTimeout(() => setStage("hit"), 1750),
      setTimeout(() => setStage("crack"), 1840),
      setTimeout(() => setStage("burst"), 2480),
      setTimeout(() => setStage("settle"), 3600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [inView, runId]);

  function replay() {
    setStage("idle");
    setRunId((n) => n + 1);
  }

  const cracked = stage === "crack" || stage === "burst" || stage === "settle";
  const hit = stage === "hit" || cracked;

  return (
    <div ref={ref} className={cn("relative mx-auto grid h-[24rem] w-full max-w-3xl place-items-center overflow-hidden sm:h-[28rem] md:h-[34rem]", className)}>
      {/* Soft ground only — no neon orbs */}
      <div className="pointer-events-none absolute left-1/2 top-[74%] h-8 w-52 -translate-x-1/2 rounded-[100%] bg-black/80 blur-2xl" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[72%] h-2.5 w-36 -translate-x-1/2 rounded-[100%] bg-black/60 blur-sm"
        animate={hit ? { scaleX: 1.45, opacity: 0.9 } : stage === "fall" ? { scaleX: 1.12, opacity: 0.5 } : { scaleX: 1, opacity: 0.3 }}
        transition={{ duration: 0.3 }}
      />

      <AnimatePresence>
        {hit && (
          <motion.div
            key={`flash-${runId}`}
            className="pointer-events-none absolute left-1/2 top-[48%] size-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 blur-2xl"
            initial={{ opacity: 0.7, scale: 0.3 }}
            animate={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Fine dust — sparse, white only */}
      {Array.from({ length: 18 }, (_, i) => {
        const angle = (i / 18) * Math.PI * 2;
        const dist = 42 + (i % 5) * 18;
        return (
          <motion.span
            key={`${runId}-d-${i}`}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[48%] rounded-full bg-white/90"
            style={{ width: i % 4 === 0 ? 2.5 : 1.5, height: i % 4 === 0 ? 2.5 : 1.5, zIndex: 20 }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={
              stage === "burst" || stage === "settle"
                ? {
                    x: Math.cos(angle) * dist * 1.15,
                    y: Math.sin(angle) * dist * 0.7 + 24 + (i % 3) * 12,
                    opacity: [0, 0.85, 0],
                  }
                : { opacity: 0 }
            }
            transition={{ duration: 1.6, ease: "easeOut", delay: 0.02 * (i % 6) }}
          />
        );
      })}

      {/* Glass chips */}
      {Array.from({ length: 10 }, (_, i) => {
        const side = i % 2 === 0 ? -1 : 1;
        return (
          <motion.span
            key={`${runId}-f-${i}`}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[46%] border border-white/40 bg-gradient-to-br from-white/50 to-white/10"
            style={{
              width: 9 + (i % 4) * 3,
              height: 11 + (i % 3) * 4,
              clipPath: "polygon(15% 0, 100% 20%, 80% 100%, 0 65%)",
              zIndex: 22,
            }}
            initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
            animate={
              stage === "burst" || stage === "settle"
                ? {
                    x: [0, side * (30 + i * 10), side * (55 + i * 14)],
                    y: [0, -22 - (i % 3) * 8, 95 + i * 8],
                    opacity: [0, 1, 0.4, 0],
                    rotate: side * (50 + i * 20),
                  }
                : { opacity: 0 }
            }
            transition={{ duration: 2, ease: [0.22, 0.7, 0.2, 1], delay: 0.03 * i }}
          />
        );
      })}

      <motion.div
        key={`phone-${runId}`}
        className="relative z-10"
        style={{ perspective: 1600, transformStyle: "preserve-3d" }}
        initial={{ y: -48, opacity: 0 }}
        animate={
          stage === "idle"
            ? { y: -48, opacity: 0, rotateX: 10, rotateY: -14 }
            : stage === "hold"
              ? { y: -40, opacity: 1, rotateX: 12, rotateY: -16, rotateZ: -3 }
              : stage === "fall"
                ? { y: 10, opacity: 1, rotateX: 4, rotateY: -8, rotateZ: 0 }
                : stage === "hit" || stage === "crack"
                  ? { y: [12, 8, 13, 10], x: [0, -2, 2, 0], opacity: 1, rotateX: 2, rotateY: -5, rotateZ: 0.5 }
                  : { y: 8, opacity: 1, rotateX: 4, rotateY: -8, rotateZ: -0.5 }
        }
        transition={
          stage === "fall"
            ? { duration: 1, ease: [0.55, 0.02, 0.9, 0.4] }
            : stage === "hit" || stage === "crack"
              ? { duration: 0.4 }
              : { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
        }
      >
        <PhoneBody cracked={cracked} showCracks={stage === "crack" || stage === "burst" || stage === "settle"} growing={stage === "crack"} flashing={stage === "hit"} />
      </motion.div>

      {stage === "settle" && (
        <button
          type="button"
          onClick={replay}
          className="absolute bottom-1 right-1 inline-flex items-center gap-1.5 rounded-md border border-line bg-black/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-muted transition hover:text-fg"
        >
          <RotateCcw size={11} /> Replay
        </button>
      )}
    </div>
  );
}

function PhoneBody({
  cracked,
  showCracks,
  growing,
  flashing,
}: {
  cracked: boolean;
  showCracks: boolean;
  growing: boolean;
  flashing: boolean;
}) {
  const clock = useLocalLockScreen();

  return (
    <div
      className="relative h-[18rem] w-[9rem] sm:h-[22rem] sm:w-[11rem] md:h-[26rem] md:w-[12.75rem]"
      style={{ transform: "rotateX(6deg) rotateY(-10deg)", transformStyle: "preserve-3d" }}
    >
      {/* Rear body */}
      <div className="absolute inset-0 rounded-[2.35rem] bg-[#0c0c0e]" style={{ transform: "translateZ(-10px) scale(0.985)" }} />

      {/* Side rails */}
      <div className="absolute inset-y-12 -left-[3px] w-[2.5px] rounded-full bg-gradient-to-b from-[#8a8a92] via-[#3a3a42] to-[#6a6a72]" />
      <div className="absolute left-[-5px] top-[24%] h-6 w-[2.5px] rounded-[1px] bg-[#4a4a52]" />
      <div className="absolute left-[-5px] top-[34%] h-10 w-[2.5px] rounded-[1px] bg-[#4a4a52]" />
      <div className="absolute right-[-5px] top-[30%] h-12 w-[2.5px] rounded-[1px] bg-[#4a4a52]" />

      {/* Chassis */}
      <div
        className="absolute inset-0 overflow-hidden rounded-[2.3rem] shadow-[0_40px_80px_-28px_rgba(0,0,0,0.95)]"
        style={{
          background: "linear-gradient(145deg, #6b6b74 0%, #2c2c34 22%, #0a0a0c 55%, #3a3a44 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22), 0 40px 80px -28px rgba(0,0,0,0.95)",
        }}
      >
        {/* Display */}
        <div className="absolute inset-[4px] overflow-hidden rounded-[2rem] bg-black">
          <div
            className="absolute inset-[1.5px] overflow-hidden rounded-[1.85rem]"
            style={{
              background:
                "linear-gradient(165deg, #1a2744 0%, #0b1220 35%, #05070c 70%), radial-gradient(ellipse at 30% 20%, #1e3a5f 0%, transparent 50%)",
            }}
          >
            {/* Dynamic Island */}
            <div className="absolute left-1/2 top-3 h-[20px] w-[82px] -translate-x-1/2 rounded-full bg-black">
              <span className="absolute right-3 top-1/2 size-[6px] -translate-y-1/2 rounded-full bg-[#0d1a22] ring-1 ring-white/10" />
            </div>

            <div className="absolute inset-x-0 top-11 text-center sm:top-12">
              <p className="text-[8px] font-medium uppercase tracking-[0.22em] text-white/55 sm:text-[9px]">
                {clock.label}
              </p>
              <p
                className="mt-0.5 font-semibold tracking-tight text-white tabular-nums"
                style={{ fontSize: "clamp(2.4rem, 8vw, 3.1rem)", lineHeight: 1, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
              >
                {clock.time}
              </p>
            </div>

            {/* Home indicator */}
            <div className="absolute inset-x-0 bottom-3 mx-auto h-[4px] w-28 rounded-full bg-white/25" />

            <AnimatePresence>
              {flashing && (
                <motion.div
                  key="flash"
                  className="absolute inset-0 bg-white"
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Glass protector layer */}
        <div
          className="pointer-events-none absolute inset-[3px] overflow-hidden rounded-[2.05rem]"
          style={{
            background: cracked
              ? "linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.06) 100%)"
              : "linear-gradient(145deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.03) 38%, rgba(255,255,255,0.08) 100%)",
            boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.35)",
          }}
        >
          {/* Specular highlight */}
          <div className="absolute left-[8%] top-[5%] h-28 w-12 rotate-[-18deg] bg-gradient-to-br from-white/25 to-transparent" />

          {showCracks && (
            <svg viewBox="0 0 200 400" className="absolute inset-0 h-full w-full" aria-hidden>
              {/* Frosted shatter panels */}
              {FROST.map((d, i) => (
                <motion.path
                  key={`frost-${i}`}
                  d={d}
                  fill="rgba(255,255,255,0.11)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: growing ? 0.3 : 0.01, delay: growing ? 0.15 + i * 0.04 : 0 }}
                />
              ))}

              {/* Primary cracks — variable weight */}
              <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                {PRIMARY.map((d, i) => (
                  <motion.path
                    key={d}
                    d={d}
                    stroke="rgba(255,255,255,0.92)"
                    strokeWidth={i < 2 ? 1.35 : 1.05}
                    initial={{ pathLength: 0, opacity: 0.3 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      duration: growing ? 0.5 : 0.01,
                      delay: growing ? i * 0.045 : 0,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                ))}
              </g>

              {/* Secondary branches — thinner */}
              <g fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="0.7" strokeLinecap="round">
                {BRANCH.map((d, i) => (
                  <motion.path
                    key={d}
                    d={d}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.85 }}
                    transition={{
                      duration: growing ? 0.4 : 0.01,
                      delay: growing ? 0.22 + i * 0.03 : 0,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                ))}
              </g>

              {/* Impact crush point */}
              <motion.circle
                cx="98"
                cy="208"
                r="3"
                fill="rgba(255,255,255,0.95)"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15 }}
                style={{ transformOrigin: "98px 208px" }}
              />
              <motion.circle
                cx="98"
                cy="208"
                r="9"
                fill="none"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="0.6"
                initial={{ opacity: 0.6, scale: 0.4 }}
                animate={{ opacity: 0, scale: 1.8 }}
                transition={{ duration: 0.55 }}
                style={{ transformOrigin: "98px 208px" }}
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

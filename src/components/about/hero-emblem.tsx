"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { HydraCreature } from "@/components/hydra/hydra-creature";

/** The HYDRA draws itself once when the About page opens. */
export function HeroEmblem() {
  const progress = useMotionValue(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const controls = animate(progress, 1, { duration: reduced ? 0 : 2.8, delay: reduced ? 0 : 0.25, ease: [0.65, 0, 0.35, 1] });
    return () => controls.stop();
  }, [progress, reduced]);

  return (
    <div className="relative mx-auto aspect-[3930/3454] w-full max-w-lg">
      <div className="pointer-events-none absolute inset-[8%] rounded-full bg-accent/15 blur-[60px]" />
      <motion.div
        className="absolute inset-[2%] rounded-full border border-dashed border-white/12"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-[10%] rounded-full border border-accent/20"
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_14px_var(--color-accent)]" />
      </motion.div>
      <motion.div
        className="absolute inset-[22%] rounded-full border border-white/[0.06]"
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      />
      <HydraCreature progress={progress} className="relative w-full" />
    </div>
  );
}

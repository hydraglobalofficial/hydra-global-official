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
      <motion.div
        className="absolute inset-[2%] rounded-full border border-dashed border-white/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-[10%] rounded-full border border-accent/15"
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]" />
      </motion.div>
      <HydraCreature progress={progress} className="relative w-full" />
    </div>
  );
}

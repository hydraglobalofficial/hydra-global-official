"use client";

import { useEffect } from "react";
import { animate, useMotionValue, useReducedMotion } from "motion/react";
import { HydraCreature } from "@/components/hydra/hydra-creature";

/** The HYDRA draws itself once when the About page opens. */
export function HeroEmblem() {
  const progress = useMotionValue(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const controls = animate(progress, 1, {
      duration: reduced ? 0 : 2.8,
      delay: reduced ? 0 : 0.25,
      ease: [0.65, 0, 0.35, 1],
    });
    return () => controls.stop();
  }, [progress, reduced]);

  return (
    <div className="relative mx-auto aspect-[3930/3454] w-full max-w-lg">
      <div className="pointer-events-none absolute inset-[12%] rounded-full bg-accent/12 blur-[70px]" />
      <HydraCreature progress={progress} className="relative w-full" />
    </div>
  );
}

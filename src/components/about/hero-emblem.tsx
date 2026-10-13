"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { HYDRA_SRC } from "@/components/hydra/hydra-creature";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { interpolate } from "@/lib/interpolate";

const IMAGE_SIZES = "(min-width: 768px) 520px, 360px";

/** About hero mark — top-down power pull on Hydra_Animation.png (no assemble). */
export function HeroEmblem() {
  const mounted = useHasMounted();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const progress = useMotionValue(reduced ? 1 : 0);

  useEffect(() => {
    if (!mounted || reduced || !inView) return;
    const anim = animate(progress, 1, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => anim.stop();
  }, [mounted, inView, progress, reduced]);

  const opacity = useTransform(progress, (v) => interpolate(v, [0, 0.2, 0.5], [0.2, 0.8, 1]));
  const reveal = useTransform(progress, (v) => interpolate(v, [0.02, 0.55], [8, 100]));
  const clipPath = useTransform(reveal, (p) => `inset(0% 0% ${100 - p}% 0%)`);
  const beamOpacity = useTransform(progress, (v) => interpolate(v, [0, 0.1, 0.4, 0.75], [0, 1, 0.5, 0.1]));

  return (
    <div ref={ref} className="hydra-crest-stage relative mx-auto aspect-square w-full max-w-lg overflow-visible p-3 sm:p-4">
      <div className="hydra-crest-art relative mx-auto aspect-[3930/3454] w-full">
        <motion.div className="absolute inset-0" style={{ opacity, clipPath, WebkitClipPath: clipPath }}>
          <Image src={HYDRA_SRC} alt="HYDRA" fill sizes={IMAGE_SIZES} className="object-contain" quality={95} priority />
        </motion.div>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[6%] z-[2] h-[78%] w-[20%] -translate-x-1/2"
          style={{ opacity: beamOpacity }}
        >
          <div className="absolute inset-x-[40%] inset-y-0 rounded-full bg-gradient-to-b from-white via-white/65 to-transparent blur-[1px] light:from-zinc-200 light:via-zinc-400/45" />
          <div className="absolute inset-x-[46%] inset-y-[6%] rounded-full bg-gradient-to-b from-white to-transparent blur-[8px] light:from-zinc-300/70" />
        </motion.div>

        {!reduced && mounted ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-x-[42%] top-[8%] z-[3] h-[70%] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0.5, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut", delay: 1.6 }}
          >
            <motion.div
              className="absolute inset-x-0 h-[28%] rounded-full bg-gradient-to-b from-transparent via-white/75 to-transparent blur-[6px] light:via-zinc-500/40"
              animate={{ y: ["-10%", "280%"] }}
              transition={{ duration: 3.4, repeat: Infinity, repeatDelay: 1.6, ease: [0.45, 0, 0.2, 1], delay: 1.6 }}
            />
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}

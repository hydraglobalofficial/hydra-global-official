"use client";

import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { HydraCreature } from "@/components/hydra/hydra-creature";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const WORD = "HYDRA".split("");

type Phase = "loading" | "reveal" | "brand" | "exit" | "done";

/**
 * Page-load intro:
 * 1) loading bar
 * 2) center head → side heads (full body) → merge at full size
 * 3) HYDRA + slogan
 * 4) fade into site
 */
export function SplashScreen() {
  const [phase, setPhase] = useState<Phase>("loading");
  const progress = useMotionValue(0);
  const load = useMotionValue(0);
  const loadWidth = useTransform(load, (v) => `${Math.round(v * 100)}%`);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setPhase("done");
      return;
    }

    document.documentElement.dataset.splash = "playing";

    const loadAnim = animate(load, 1, {
      duration: 1.05,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => setPhase("reveal"),
    });

    return () => {
      loadAnim.stop();
    };
  }, [load, reduced]);

  useEffect(() => {
    if (phase !== "reveal") return;

    const creature = animate(progress, 1, {
      duration: 2.85,
      ease: [0.65, 0, 0.35, 1],
    });
    const brand = setTimeout(() => setPhase("brand"), 2300);
    return () => {
      creature.stop();
      clearTimeout(brand);
    };
  }, [phase, progress]);

  useEffect(() => {
    if (phase !== "brand") return;
    const exit = setTimeout(() => setPhase("exit"), 1600);
    return () => clearTimeout(exit);
  }, [phase]);

  useEffect(() => {
    if (phase !== "exit") return;
    const done = setTimeout(() => {
      document.documentElement.dataset.splash = "seen";
      setPhase("done");
    }, 780);
    return () => clearTimeout(done);
  }, [phase]);

  if (phase === "done") return null;

  const showCreature = phase === "reveal" || phase === "brand" || phase === "exit";
  const showBrand = phase === "brand" || phase === "exit";

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-black transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        phase === "exit" && "pointer-events-none scale-[1.04] opacity-0 blur-sm",
      )}
      onClick={() => {
        if (phase === "brand") setPhase("exit");
      }}
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(30_58_138_/_0.22),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#000_85%)]" />

      {showCreature && (
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[46%] size-[min(90vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1e3a8a]/35 blur-[100px] md:size-[36rem] md:blur-[130px]"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 0.9, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      )}

      <div className="relative flex w-full max-w-lg flex-col items-center px-6">
        {phase === "loading" && (
          <motion.div
            className="flex w-full max-w-xs flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-[#93c5fd]">HYDRA</p>
            <p className="mt-3 text-[11px] uppercase tracking-[0.35em] text-muted">Loading</p>
            <div className="mt-8 h-[2px] w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#1e3a8a] via-[#93c5fd] to-[#1e3a8a]"
                style={{ width: loadWidth }}
              />
            </div>
          </motion.div>
        )}

        {showCreature && (
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45 }}
          >
            <HydraCreature progress={progress} still className="w-[min(82vw,20rem)] sm:w-80 md:w-[28rem]" />

            {showBrand && (
              <>
                <p className="mt-3 flex text-4xl font-semibold tracking-[0.42em] text-zinc-200 sm:tracking-[0.48em] md:text-5xl" aria-label="HYDRA">
                  {WORD.map((letter, i) => (
                    <motion.span
                      key={`${letter}-${i}`}
                      initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </p>
                <motion.p
                  className="mt-4 text-[0.65rem] uppercase tracking-[0.4em] text-zinc-400 sm:tracking-[0.48em]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55, duration: 0.55 }}
                >
                  {siteConfig.slogan}
                </motion.p>
                <motion.p
                  className="mt-6 text-[10px] uppercase tracking-[0.35em] text-subtle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.65 }}
                  transition={{ delay: 0.9, duration: 0.45 }}
                >
                  Tap to enter
                </motion.p>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { HydraCreature } from "@/components/hydra/hydra-creature";
import { cn } from "@/lib/utils";

const SEEN_KEY = "hydra.splash.seen";
const WORD = "HYDRA".split("");

/** Cinematic brand intro: three heads rise one by one, then the wordmark. */
export function SplashScreen() {
  const [phase, setPhase] = useState<"show" | "hide" | "done">("show");
  const progress = useMotionValue(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- skip intro for returning visitors
      setPhase("done");
      return;
    }
    sessionStorage.setItem(SEEN_KEY, "1");
    const controls = animate(progress, 1, { duration: reduced ? 0.01 : 3.1, ease: [0.65, 0, 0.35, 1] });
    const hide = setTimeout(() => setPhase("hide"), reduced ? 600 : 4000);
    return () => {
      controls.stop();
      clearTimeout(hide);
    };
  }, [progress, reduced]);

  useEffect(() => {
    if (phase !== "hide") return;
    const done = setTimeout(() => setPhase("done"), 900);
    return () => clearTimeout(done);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-black transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [html[data-splash=seen]_&]:hidden",
        phase === "hide" && "pointer-events-none scale-[1.08] opacity-0 blur-md",
      )}
      onClick={() => setPhase("hide")}
      aria-hidden
    >
      <div className="bg-grid absolute inset-0 opacity-35 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_68%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#000_78%)]" />

      <motion.div
        className="absolute left-1/2 top-1/2 size-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[140px]"
        animate={{ scale: [0.65, 1.25, 1], opacity: [0.3, 1, 0.65] }}
        transition={{ duration: 3.2, ease: "easeOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-[58%] size-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-[80px]"
        animate={{ opacity: [0, 0.7, 0.35], scale: [0.8, 1.1, 1] }}
        transition={{ duration: 2.8, ease: "easeOut", delay: 0.2 }}
      />

      <motion.div
        className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
        initial={{ top: "0%", opacity: 0 }}
        animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
        transition={{ duration: 2.6, ease: "easeInOut" }}
      />

      {[0.55, 0.75, 0.95, 1.15].map((scale, i) => (
        <motion.div
          key={scale}
          className="pointer-events-none absolute left-1/2 top-1/2 size-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/25 md:size-[24rem]"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: [0.4, scale], opacity: [0, 0.55, 0] }}
          transition={{ duration: 2.8, ease: "easeOut", delay: 0.15 * i }}
        />
      ))}

      <div className="relative flex flex-col items-center px-6">
        <motion.p
          className="mb-4 font-mono text-[10px] uppercase tracking-[0.45em] text-accent"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduced ? 0 : 0.2, duration: 0.6 }}
        >
          HYDRA Global
        </motion.p>

        <HydraCreature progress={progress} still className="w-72 md:w-[26rem]" />

        <p className="mt-2 flex text-4xl font-semibold tracking-[0.48em] md:text-5xl" aria-label="HYDRA">
          {WORD.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 22, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: reduced ? 0 : 2.35 + i * 0.09, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="text-fg"
            >
              {letter}
            </motion.span>
          ))}
        </p>
        <motion.p
          className="mt-4 text-[0.7rem] uppercase tracking-[0.5em] text-muted"
          initial={{ opacity: 0, letterSpacing: "0.7em" }}
          animate={{ opacity: 1, letterSpacing: "0.5em" }}
          transition={{ delay: reduced ? 0 : 2.95, duration: 0.7 }}
        >
          Armor for the bold
        </motion.p>
        <div className="mt-7 h-px w-56 overflow-hidden bg-white/10">
          <motion.div
            className="h-full origin-left bg-gradient-to-r from-accent via-white to-accent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: reduced ? 0.3 : 3.2, ease: [0.65, 0, 0.35, 1] }}
          />
        </div>
        <motion.p
          className="mt-5 text-[10px] uppercase tracking-[0.35em] text-subtle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: reduced ? 0 : 3.2, duration: 0.5 }}
        >
          Tap to enter
        </motion.p>
      </div>
    </div>
  );
}

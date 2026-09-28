"use client";

import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { HydraCreature } from "@/components/hydra/hydra-creature";
import { cn } from "@/lib/utils";

const SEEN_KEY = "hydra.splash.seen";
const WORD = "HYDRA".split("");

/** Brand intro shown once per browser session: the HYDRA rises, then the wordmark. */
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
    const controls = animate(progress, 1, { duration: reduced ? 0.01 : 1.9, ease: [0.65, 0, 0.35, 1] });
    const hide = setTimeout(() => setPhase("hide"), reduced ? 600 : 2700);
    return () => {
      controls.stop();
      clearTimeout(hide);
    };
  }, [progress, reduced]);

  useEffect(() => {
    if (phase !== "hide") return;
    const done = setTimeout(() => setPhase("done"), 800);
    return () => clearTimeout(done);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-black transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [html[data-splash=seen]_&]:hidden",
        phase === "hide" && "pointer-events-none scale-110 opacity-0 blur-sm",
      )}
      onClick={() => setPhase("hide")}
      aria-hidden
    >
      <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_70%)]" />
      <motion.div
        className="absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]"
        animate={{ scale: [0.8, 1.1, 1] }}
        transition={{ duration: 2.4, ease: "easeOut" }}
      />
      <motion.div
        className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent"
        initial={{ top: "0%", opacity: 0 }}
        animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
      />

      <div className="relative flex flex-col items-center">
        <HydraCreature progress={progress} className="w-60 md:w-80" />
        <p className="-mt-2 flex text-3xl font-semibold tracking-[0.5em] md:text-4xl" aria-label="HYDRA">
          {WORD.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: reduced ? 0 : 1.5 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-fg"
            >
              {letter}
            </motion.span>
          ))}
        </p>
        <motion.p
          className="mt-3 text-[0.65rem] uppercase tracking-[0.45em] text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduced ? 0 : 2.05, duration: 0.6 }}
        >
          Armor for the bold
        </motion.p>
        <div className="mt-6 h-px w-44 overflow-hidden bg-white/10">
          <motion.div
            className="h-full origin-left bg-accent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: reduced ? 0.3 : 2.4, ease: [0.65, 0, 0.35, 1] }}
          />
        </div>
      </div>
    </div>
  );
}

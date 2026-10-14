"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { HYDRA_SRC } from "@/components/hydra/hydra-creature";
import { interpolate } from "@/lib/interpolate";

const SEEN_KEY = "hydra-splash-seen";
const WORDMARK = "/products/Hydra.png";
const emptySubscribe = () => () => {};

function useShouldPlaySplash(reduced: boolean | null) {
  return useSyncExternalStore(
    emptySubscribe,
    () => {
      if (reduced) return false;
      try {
        return sessionStorage.getItem(SEEN_KEY) !== "1";
      } catch {
        return true;
      }
    },
    () => false,
  );
}

/**
 * Opening splash — Hydra_Animation.png with a clean top→bottom power flow.
 * Skipped on SSR and for returning visitors (session) for faster first paint.
 */
export function SplashScreen() {
  const reduced = useReducedMotion();
  const shouldPlay = useShouldPlaySplash(reduced);
  const [exiting, setExiting] = useState(false);
  const [hidden, setHidden] = useState(false);
  const done = useRef(false);
  const progress = useMotionValue(0);

  const beginExit = useCallback(() => {
    if (done.current || exiting) return;
    setExiting(true);
    window.setTimeout(() => {
      if (done.current) return;
      done.current = true;
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* ignore */
      }
      document.documentElement.dataset.splash = "seen";
      setHidden(true);
    }, 380);
  }, [exiting]);

  useEffect(() => {
    if (!shouldPlay) return;

    document.documentElement.dataset.splash = "playing";
    const anim = animate(progress, 1, {
      duration: 1.45,
      ease: [0.22, 1, 0.36, 1],
    });

    const hold = window.setTimeout(() => beginExit(), 1900);
    return () => {
      anim.stop();
      window.clearTimeout(hold);
    };
  }, [shouldPlay, progress, beginExit]);

  const crestOpacity = useTransform(progress, (v) => interpolate(v, [0, 0.15, 0.4], [0, 0.7, 1]));
  const crestScale = useTransform(progress, (v) => interpolate(v, [0, 0.45], [0.92, 1]));
  const reveal = useTransform(progress, (v) => interpolate(v, [0.05, 0.58], [6, 100]));
  const clipPath = useTransform(reveal, (p) => `inset(0% 0% ${100 - p}% 0%)`);
  const beamOpacity = useTransform(progress, (v) => interpolate(v, [0.02, 0.12, 0.4, 0.72], [0, 1, 0.65, 0.15]));
  const beamY = useTransform(progress, (v) => interpolate(v, [0.05, 0.6], [-18, 10]));
  const wordOpacity = useTransform(progress, (v) => interpolate(v, [0.45, 0.7], [0, 1]));
  const wordY = useTransform(progress, (v) => interpolate(v, [0.45, 0.7], [12, 0]));
  const glowOpacity = useTransform(progress, (v) => interpolate(v, [0.1, 0.35, 1], [0, 0.55, 0.35]));

  if (!shouldPlay || hidden) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-black"
      onClick={beginExit}
      role="presentation"
      aria-hidden
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[42%] size-[min(70vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12)_0%,transparent_68%)] blur-[60px]"
        style={{ opacity: glowOpacity }}
      />

      <div className="relative flex w-[min(86vw,22rem)] flex-col items-center gap-6 sm:w-[min(70vw,26rem)]">
        <div className="hydra-crest-stage relative w-full overflow-visible p-2 sm:p-3">
          <motion.div
            className="hydra-crest-art relative mx-auto aspect-[3930/3454] w-full"
            style={{ opacity: crestOpacity, scale: crestScale }}
          >
            <div className="absolute inset-0 opacity-[0.18]">
              <Image src={HYDRA_SRC} alt="" fill sizes="420px" className="object-contain" priority quality={90} />
            </div>

            <motion.div className="absolute inset-0" style={{ clipPath, WebkitClipPath: clipPath }}>
              <Image
                src={HYDRA_SRC}
                alt="HYDRA"
                fill
                sizes="420px"
                className="object-contain"
                priority
                quality={90}
              />
            </motion.div>

            <motion.div
              className="pointer-events-none absolute left-1/2 top-[4%] z-[2] h-[80%] w-[26%] -translate-x-1/2"
              style={{ opacity: beamOpacity, y: beamY }}
            >
              <div className="absolute inset-x-[36%] inset-y-0 rounded-full bg-gradient-to-b from-white via-white/75 to-transparent blur-[1px]" />
              <div className="absolute inset-x-[42%] inset-y-[3%] rounded-full bg-gradient-to-b from-white to-transparent blur-[10px]" />
              <div className="absolute left-1/2 top-0 size-3.5 -translate-x-1/2 rounded-full bg-white blur-[2px]" />
            </motion.div>

            <motion.div
              className="pointer-events-none absolute inset-x-[40%] top-[6%] z-[3] h-[72%] overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0.7, 0] }}
              transition={{ duration: 1.15, delay: 0.28, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute inset-x-0 h-[30%] rounded-full bg-gradient-to-b from-transparent via-white to-transparent blur-[5px]"
                initial={{ y: "-20%" }}
                animate={{ y: "320%" }}
                transition={{ duration: 1.15, delay: 0.28, ease: [0.45, 0, 0.2, 1] }}
              />
            </motion.div>
          </motion.div>
        </div>

        <motion.div className="relative h-8 w-[min(100%,11rem)] sm:h-9 sm:w-48" style={{ opacity: wordOpacity, y: wordY }}>
          <Image
            src={WORDMARK}
            alt="HYDRA"
            fill
            sizes="192px"
            className="object-contain object-center brightness-0 invert"
            priority
          />
        </motion.div>

        <motion.p
          className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500"
          style={{ opacity: wordOpacity }}
        >
          Tap to enter
        </motion.p>
      </div>
    </motion.div>
  );
}

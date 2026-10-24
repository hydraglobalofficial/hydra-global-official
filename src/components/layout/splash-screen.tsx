"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";
import { HydraVideo } from "@/components/hydra/hydra-video";

const SEEN_KEY = "hydra-splash-seen";
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

/** Opening splash — plays the HYDRA film once, then the store. Tap to skip. */
export function SplashScreen() {
  const reduced = useReducedMotion();
  const shouldPlay = useShouldPlaySplash(reduced);
  const [exiting, setExiting] = useState(false);
  const [hidden, setHidden] = useState(false);
  const done = useRef(false);

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
    const cap = window.setTimeout(() => beginExit(), 20000);
    return () => window.clearTimeout(cap);
  }, [shouldPlay, beginExit]);

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
      <HydraVideo
        className="h-auto max-h-[86vh] w-[min(92vw,40rem)] object-contain"
        onEnded={beginExit}
      />
    </motion.div>
  );
}

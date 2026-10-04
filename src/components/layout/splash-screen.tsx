"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { HydraCreature } from "@/components/hydra/hydra-creature";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const SEEN_KEY = "hydra-splash-seen";
const WORDMARK_SRC = "/products/Hydra.png";

type Phase = "loading" | "reveal" | "brand" | "exit" | "done";

/**
 * Page-load intro:
 * 1) short loading bar
 * 2) hydra heads assemble
 * 3) real HYDRA name (logo wordmark) animates in + slogan
 * 4) fade into site
 */
export function SplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>("loading");
  const progress = useMotionValue(0);
  const load = useMotionValue(0);
  const loadWidth = useTransform(load, (v) => `${Math.round(v * 100)}%`);
  const reduced = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (reduced || sessionStorage.getItem(SEEN_KEY) === "1") {
      setPhase("done");
      return;
    }

    document.documentElement.dataset.splash = "playing";

    const loadAnim = animate(load, 1, {
      duration: 0.55,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => setPhase("reveal"),
    });

    return () => {
      loadAnim.stop();
    };
  }, [mounted, load, reduced]);

  useEffect(() => {
    if (phase !== "reveal") return;

    const creature = animate(progress, 1, {
      duration: 2.2,
      ease: [0.65, 0, 0.35, 1],
    });
    const brand = setTimeout(() => setPhase("brand"), 1850);
    return () => {
      creature.stop();
      clearTimeout(brand);
    };
  }, [phase, progress]);

  useEffect(() => {
    if (phase !== "brand") return;
    // Keep name animation on screen long enough to read
    const exit = setTimeout(() => setPhase("exit"), 1600);
    return () => clearTimeout(exit);
  }, [phase]);

  useEffect(() => {
    if (phase !== "exit") return;
    const done = setTimeout(() => {
      sessionStorage.setItem(SEEN_KEY, "1");
      document.documentElement.dataset.splash = "seen";
      setPhase("done");
    }, 520);
    return () => clearTimeout(done);
  }, [phase]);

  if (!mounted || phase === "done") return null;

  const showCreature = phase === "reveal" || phase === "brand" || phase === "exit";
  const showBrand = phase === "brand" || phase === "exit";

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-black transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        phase === "exit" && "pointer-events-none scale-[1.03] opacity-0 blur-sm",
      )}
      onClick={() => {
        if (phase === "brand" || phase === "reveal") setPhase("exit");
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
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      )}

      <div className="relative flex w-full max-w-lg flex-col items-center px-6">
        {phase === "loading" && (
          <motion.div
            className="flex w-full max-w-xs flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative h-8 w-40">
              <Image
                src={WORDMARK_SRC}
                alt=""
                fill
                sizes="180px"
                className="object-contain opacity-80 brightness-0 invert"
                priority
              />
            </div>
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
            transition={{ duration: 0.35 }}
          >
            <HydraCreature progress={progress} still className="w-[min(82vw,20rem)] sm:w-80 md:w-[28rem]" />

            {showBrand && (
              <>
                {/* Real logo name animation — same role as the old letter reveal */}
                <motion.div
                  className="relative mt-4 h-12 w-[min(78vw,18rem)] sm:h-14 sm:w-80 md:h-16 md:w-[22rem]"
                  initial={{ opacity: 0, y: 22, filter: "blur(12px)", scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  aria-label="HYDRA"
                >
                  <Image
                    src={WORDMARK_SRC}
                    alt="HYDRA"
                    fill
                    sizes="360px"
                    quality={95}
                    priority
                    className="object-contain brightness-0 invert"
                  />
                </motion.div>

                <motion.p
                  className="mt-4 text-[0.65rem] uppercase tracking-[0.4em] text-zinc-400 sm:tracking-[0.48em]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.45 }}
                >
                  {siteConfig.slogan}
                </motion.p>
                <motion.p
                  className="mt-6 text-[10px] uppercase tracking-[0.35em] text-subtle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.65 }}
                  transition={{ delay: 0.7, duration: 0.35 }}
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

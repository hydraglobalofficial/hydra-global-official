"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { siteConfig } from "@/config/site";
import { HYDRA_SRC, hydraHeads, headTip } from "@/components/hydra/hydra-creature";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { interpolate } from "@/lib/interpolate";

const IMAGE_SIZES = "(min-width: 1024px) 760px, (min-width: 768px) 580px, 400px";

/**
 * Brand story — full Hydra_Animation.png with a top-down power pull only
 * (no head-assemble / clip-path animation).
 */
export function HydraRise() {
  const mounted = useHasMounted();
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { once: true, amount: 0.35 });
  const progress = useMotionValue(reduced ? 1 : 0);

  useEffect(() => {
    if (!mounted || reduced || !inView) return;
    const anim = animate(progress, 1, {
      duration: 2.1,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => anim.stop();
  }, [mounted, inView, progress, reduced]);

  return (
    <section className="relative overflow-x-clip py-20 sm:py-24 md:py-28" aria-label="The HYDRA story">
      <div className="container-page relative grid w-full items-center gap-10 md:grid-cols-[1fr_1.15fr] md:gap-12">
        <div className="relative order-2 max-w-lg md:order-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">Unleashed</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
            Meet the <span className="text-muted">HYDRA.</span>
          </h2>
          <p className="mt-4 text-sm text-muted sm:text-base">
            {siteConfig.slogan}. Accessories for iPhone and Samsung Galaxy, shipped worldwide.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-fg transition hover:text-accent"
          >
            Shop accessories <ArrowRight size={16} />
          </Link>
        </div>

        <div
          ref={stageRef}
          className="relative order-1 mx-auto w-[min(100%,22rem)] overflow-visible px-1 pt-12 sm:w-full sm:max-w-[24rem] sm:pt-14 md:order-2 md:max-w-[34rem] md:pt-16"
        >
          <div className="hydra-crest-stage relative mx-auto w-full overflow-visible p-2 sm:p-3 md:p-4">
            <div className="relative mx-auto w-full">
              <PowerCrest progress={progress} loop={!reduced && mounted} />
              {hydraHeads.map((head, i) => (
                <HeadLabel key={head.label} head={head} progress={progress} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Full crest + top-down power pull / shine. */
function PowerCrest({ progress, loop }: { progress: MotionValue<number>; loop: boolean }) {
  const crestOpacity = useTransform(progress, (v) => interpolate(v, [0, 0.18, 0.45], [0.15, 0.75, 1]));
  const crestY = useTransform(progress, (v) => interpolate(v, [0, 0.4], [18, 0]));
  const crestScale = useTransform(progress, (v) => interpolate(v, [0, 0.45], [0.96, 1]));

  // Top → bottom reveal (power drawn from above)
  const reveal = useTransform(progress, (v) => interpolate(v, [0.02, 0.55], [8, 100]));
  const clipPath = useTransform(reveal, (p) => `inset(0% 0% ${100 - p}% 0%)`);

  // First power strike from the top
  const beamOpacity = useTransform(progress, (v) => interpolate(v, [0, 0.08, 0.35, 0.7], [0, 1, 0.55, 0.12]));
  const beamY = useTransform(progress, (v) => interpolate(v, [0, 0.55], [-12, 8]));

  return (
    <motion.div
      className="hydra-crest-art hydra-crest-ink relative mx-auto aspect-[3930/3454] w-full"
      animate={loop ? { y: [0, -5, 0] } : undefined}
      transition={loop ? { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2.1 } : undefined}
    >
      <motion.div className="absolute inset-0 opacity-[0.16]" aria-hidden>
        <Image
          src={HYDRA_SRC}
          alt=""
          fill
          sizes={IMAGE_SIZES}
          className="hydra-mark-ink object-contain"
          quality={95}
          priority
        />
      </motion.div>

      <motion.div
        className="absolute inset-0"
        style={{ opacity: crestOpacity, y: crestY, scale: crestScale, clipPath, WebkitClipPath: clipPath }}
      >
        <Image
          src={HYDRA_SRC}
          alt="HYDRA crest"
          fill
          sizes={IMAGE_SIZES}
          className="hydra-mark-ink object-contain"
          quality={95}
          priority
        />
      </motion.div>

      {/* Opening strike — power pulled from the top down the spine */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[6%] z-[2] h-[78%] w-[22%] -translate-x-1/2"
        style={{ opacity: beamOpacity, y: beamY }}
      >
        <div className="absolute inset-x-[38%] inset-y-0 rounded-full bg-gradient-to-b from-white via-white/70 to-transparent blur-[1px] light:from-zinc-500 light:via-zinc-700/55" />
        <div className="absolute inset-x-[44%] inset-y-[4%] rounded-full bg-gradient-to-b from-white to-transparent blur-[8px] light:from-zinc-600/70" />
        <div className="absolute left-1/2 top-0 size-3 -translate-x-1/2 rounded-full bg-white blur-[3px] light:bg-zinc-700" />
      </motion.div>

      {/* Looping power — soft top → bottom pull */}
      {loop ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-[42%] top-[8%] z-[3] h-[70%] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.55, 0.55, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut", delay: 1.8 }}
        >
          <motion.div
            className="absolute inset-x-0 h-[28%] rounded-full bg-gradient-to-b from-transparent via-white/80 to-transparent blur-[6px] light:via-zinc-600/50"
            animate={{ y: ["-10%", "280%"] }}
            transition={{ duration: 3.6, repeat: Infinity, repeatDelay: 1.4, ease: [0.45, 0, 0.2, 1], delay: 1.8 }}
          />
        </motion.div>
      ) : null}
    </motion.div>
  );
}

function HeadLabel({
  head,
  progress,
  index,
}: {
  head: (typeof hydraHeads)[number];
  progress: MotionValue<number>;
  index: number;
}) {
  const tip = headTip(head);
  const start = 0.48 + index * 0.08;
  const end = start + 0.16;
  const opacity = useTransform(progress, (v) => interpolate(v, [start, end], [0, 1]));
  const y = useTransform(progress, (v) => interpolate(v, [start, end], [8, 0]));

  return (
    <motion.div
      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[110%] text-center"
      style={{ left: `${tip.left}%`, top: `${tip.top}%`, opacity, y }}
    >
      <p className="whitespace-nowrap rounded-full border border-white/12 bg-black/90 px-2 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-[0.16em] text-zinc-100 backdrop-blur-md light:border-black/20 light:bg-black light:text-white sm:px-2.5 sm:py-1 sm:text-[10px] sm:tracking-[0.2em]">
        {head.label}
      </p>
    </motion.div>
  );
}

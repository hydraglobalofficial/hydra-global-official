"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { HydraCreature, headRevealRange, headTip, hydraHeads, type HydraHead } from "./hydra-creature";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { interpolate } from "@/lib/interpolate";
import { siteConfig } from "@/config/site";

/** Creature + crown labels (Protection / Precision / Progression) + short CTA. */
export function HydraRise() {
  const mounted = useHasMounted();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const reduced = useReducedMotion();
  const progress = useMotionValue(reduced ? 1 : 0);
  const copyOpacity = useTransform(progress, (v) => interpolate(v, [0.55, 0.78], [0, 1]));
  const copyY = useTransform(progress, (v) => interpolate(v, [0.55, 0.78], [18, 0]));

  useEffect(() => {
    if (!mounted || reduced || !inView) return;
    const anim = animate(progress, 1, { duration: 3.2, ease: [0.65, 0, 0.35, 1] });
    return () => anim.stop();
  }, [mounted, inView, progress, reduced]);

  const copy = (
    <>
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">Unleashed</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
        Meet the <span className="text-muted">HYDRA.</span>
      </h2>
      <p className="mt-4 text-sm text-muted sm:text-base">
        {siteConfig.slogan}. Accessories for iPhone and Samsung Galaxy, delivered anywhere in Bangladesh.
      </p>
      <Link href="/shop" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-fg transition hover:text-accent">
        Shop accessories <ArrowRight size={16} />
      </Link>
    </>
  );

  return (
    <section ref={ref} className="relative overflow-x-clip py-20 sm:py-24 md:py-28" aria-label="The HYDRA story">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,rgba(30,58,138,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[min(90vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1e3a8a]/15 blur-[100px] sm:size-[36rem] md:left-[68%] md:size-[44rem]" />

      <div className="container-page relative grid w-full items-center gap-10 md:grid-cols-[1fr_1.15fr] md:gap-12">
        {mounted ? (
          <motion.div style={{ opacity: copyOpacity, y: copyY }} className="relative order-2 max-w-lg md:order-1">
            {copy}
          </motion.div>
        ) : (
          <div className="relative order-2 max-w-lg translate-y-[18px] opacity-0 md:order-1">{copy}</div>
        )}

        <div className="relative order-1 mx-auto w-[min(100%,22rem)] overflow-visible px-1 pt-11 sm:w-full sm:max-w-[24rem] sm:pt-12 md:order-2 md:max-w-[34rem] md:pt-14">
          <HydraCreature progress={progress} className="w-full" />
          {mounted && hydraHeads.map((head) => <HeadLabel key={head.label} head={head} progress={progress} />)}
        </div>
      </div>
    </section>
  );
}

function HeadLabel({ head, progress }: { head: HydraHead; progress: MotionValue<number> }) {
  const tip = headTip(head);
  const range = headRevealRange(head);
  const opacity = useTransform(progress, (v) => interpolate(v, [range[0], range[1]], [0, 1]));

  return (
    <motion.div
      className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[110%] text-center"
      style={{ left: `${tip.left}%`, top: `${tip.top}%`, opacity }}
    >
      <p className="whitespace-nowrap rounded-full border border-white/12 bg-black/90 px-2 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-[0.16em] text-zinc-100 shadow-[0_6px_18px_rgba(0,0,0,0.55)] backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[10px] sm:tracking-[0.2em]">
        {head.label}
      </p>
    </motion.div>
  );
}

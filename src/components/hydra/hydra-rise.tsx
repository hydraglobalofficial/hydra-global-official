"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { HydraCreature, headRevealRange, headTip, hydraHeads, type HydraHead } from "./hydra-creature";
import { interpolate } from "@/lib/interpolate";
import { cn } from "@/lib/utils";

const chapters = [
  {
    eyebrow: "The legend",
    title: (
      <>
        One body. <span className="text-muted">Five heads.</span>
      </>
    ),
    body: "In myth, cut off one head of the Hydra and two grow back. We engineer our armor with the same relentless spirit.",
    range: [0, 0.34],
  },
  {
    eyebrow: "Every head guards something",
    title: (
      <>
        Five layers of <span className="text-muted">protection.</span>
      </>
    ),
    body: "Clarity, privacy, impact, camera and fit — each one a specialist, all of them working as one on your phone.",
    range: [0.34, 0.68],
  },
  {
    eyebrow: "Unleashed",
    title: (
      <>
        Meet the <span className="text-muted">HYDRA.</span>
      </>
    ),
    body: "Precision armor for iPhone and Samsung Galaxy, delivered anywhere in Bangladesh.",
    range: [0.68, 1],
    cta: true,
  },
] as const;

/** Sticky scroll story: the HYDRA builds itself as the visitor scrolls. */
export function HydraRise() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const complete = useMotionValue(1);
  const scroll = reduced ? complete : scrollYProgress;
  const progress = useTransform(scroll, (v) => interpolate(v, [0.04, 0.8], [0, 1]));
  const glow = useTransform(scroll, [0, 1], [0.6, 1.15]);

  return (
    <section ref={ref} className={cn("relative", reduced ? "py-24" : "h-[320vh]")} aria-label="The HYDRA story">
      <div className={cn("flex items-center overflow-hidden", !reduced && "sticky top-0 h-svh")}>
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_70%)]" />
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.07] blur-[130px] md:left-[68%]"
          style={{ scale: glow }}
        />

        <div className="container-page relative grid w-full items-center gap-6 pt-20 md:grid-cols-[1fr_1.1fr] md:gap-12 md:pt-0">
          <div className="relative order-2 grid min-h-[15rem] md:order-1">
            {chapters.map((c, i) => (
              <Chapter key={i} chapter={c} scroll={scroll} first={i === 0} last={i === chapters.length - 1} />
            ))}
          </div>

          <div className="relative order-1 mx-auto w-full max-w-[22rem] md:order-2 md:max-w-[34rem]">
            <HydraCreature progress={progress} className="w-full" />
            {hydraHeads.map((head) => (
              <HeadLabel key={head.label} head={head} progress={progress} />
            ))}
          </div>
        </div>

        {!reduced && (
          <div className="absolute inset-x-0 bottom-8 mx-auto flex w-40 items-center gap-3">
            <span className="text-[0.6rem] uppercase tracking-[0.3em] text-subtle">Scroll</span>
            <div className="h-px flex-1 overflow-hidden bg-white/10">
              <motion.div className="h-full origin-left bg-accent" style={{ scaleX: scrollYProgress }} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Chapter({
  chapter,
  scroll,
  first,
  last,
}: {
  chapter: (typeof chapters)[number];
  scroll: MotionValue<number>;
  first: boolean;
  last: boolean;
}) {
  const [a, b] = chapter.range;
  const input = [...(first ? [0] : [a - 0.04, a + 0.04]), ...(last ? [1] : [b - 0.04, b + 0.04])];
  const opacityOut = [...(first ? [1] : [0, 1]), ...(last ? [1] : [1, 0])];
  const yOut = [...(first ? [0] : [40, 0]), ...(last ? [0] : [0, -40])];
  const opacity = useTransform(scroll, (v) => interpolate(v, input, opacityOut));
  const y = useTransform(scroll, (v) => interpolate(v, input, yOut));
  const pointerEvents = useTransform(opacity, (o) => (o > 0.5 ? "auto" : "none"));

  return (
    <motion.div className="col-start-1 row-start-1 self-center text-center md:text-left" style={{ opacity, y, pointerEvents }}>
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">{chapter.eyebrow}</p>
      <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">{chapter.title}</h2>
      <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted md:mx-0 md:text-lg">{chapter.body}</p>
      {"cta" in chapter && (
        <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.03]"
          >
            Shop the armor <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/about" className="inline-flex items-center rounded-full border border-line-strong px-6 py-3 text-sm text-fg transition-colors hover:bg-white/5">
            Our story
          </Link>
        </div>
      )}
    </motion.div>
  );
}

function HeadLabel({ head, progress }: { head: HydraHead; progress: MotionValue<number> }) {
  const [from, to] = headRevealRange(head);
  const opacity = useTransform(progress, [from, to], [0, 1]);
  const y = useTransform(progress, [from, to], [8, 0]);
  const tip = headTip(head);

  return (
    <motion.div
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-[135%]"
      style={{ left: `${tip.left}%`, top: `${tip.top}%`, opacity, y }}
    >
      <div className="glass whitespace-nowrap rounded-full px-3 py-1 text-center shadow-[0_0_24px_rgba(56,189,248,0.15)]">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-fg md:text-xs">{head.label}</p>
        <p className="hidden text-[0.6rem] text-muted md:block">{head.caption}</p>
      </div>
    </motion.div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { animate, motion, useInView } from "motion/react";
import type { ImpactPhoto } from "@/content/site-sections";
import { cn } from "@/lib/utils";

function CountUp({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 2.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString("en-US")}
    </span>
  );
}

/** Quiet places around the type. Small tilt, same frame, so it feels placed — not thrown. */
const SPOTS = [
  { className: "left-[3%] top-[10%] w-[6.25rem] -rotate-2 sm:w-[8.5rem]" },
  { className: "left-[18%] top-[3%] hidden w-[7.25rem] rotate-1 md:block" },
  { className: "right-[18%] top-2 w-[6.25rem] -rotate-1 sm:w-32" },
  { className: "right-[3%] top-[14%] hidden w-[8.25rem] rotate-2 lg:block" },
  { className: "bottom-[8%] left-[5%] w-[6.5rem] rotate-2 sm:w-[9rem]" },
  { className: "bottom-[5%] right-[6%] w-[7rem] -rotate-2 sm:w-[9.5rem]" },
] as const;

function ScatteredPhoto({ photo, index }: { photo: ImpactPhoto; index: number }) {
  const spot = SPOTS[index % SPOTS.length]!;
  return (
    <motion.figure
      className={cn(
        "absolute overflow-hidden rounded-[1.15rem] bg-black shadow-[0_28px_50px_-34px_rgba(15,23,42,0.45)]",
        spot.className,
      )}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image src={photo.url} alt={photo.alt || "HYDRA"} fill sizes="180px" className="object-cover" />
      </div>
    </motion.figure>
  );
}

function Copy() {
  return (
    <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
      <motion.p
        className="font-mono text-[11px] uppercase tracking-[0.32em] text-muted"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Protected worldwide
      </motion.p>
      <motion.p
        className="mt-3 font-semibold leading-[0.86] tracking-[-0.07em] text-fg sm:mt-4"
        style={{ fontSize: "clamp(4.25rem, 14vw, 9.5rem)" }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <CountUp to={20000} className="tabular-nums" />
        <span>+</span>
      </motion.p>
      <motion.div
        className="mx-auto mt-5 max-w-lg space-y-3 sm:mt-6"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.12 }}
      >
        <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl md:text-4xl">
          Devices equipped by HYDRA.
        </h2>
        <p className="text-sm text-pretty text-muted sm:text-base">
          Engineered for the flagship phones people actually carry. Screen armor, cases, camera kits and more — cut per
          model, quality-checked and shipped worldwide.
        </p>
      </motion.div>
    </div>
  );
}

export function ImpactStat({ images = [] }: { images?: ImpactPhoto[] }) {
  const photos = useMemo(() => images.filter((photo) => photo.url).slice(0, SPOTS.length), [images]);

  return (
    <section className={cn("relative overflow-hidden", photos.length > 0 ? "py-10 sm:py-14" : "py-20 sm:py-28 md:py-40")}>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(64vw,480px)] w-[min(78vw,680px)] -translate-x-1/2 -translate-y-[46%]"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in oklab, var(--color-fg, currentColor) 14%, transparent) 0.9px, transparent 1.4px)",
          backgroundSize: "13px 13px",
          maskImage: "radial-gradient(ellipse 70% 78% at 50% 50%, black 12%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 78% at 50% 50%, black 12%, transparent 72%)",
        }}
      />

      {photos.length > 0 ? (
        <div className="relative mx-auto h-[32rem] max-w-[68rem] sm:h-[36rem] lg:h-[40rem]">
          {photos.map((photo, index) => (
            <ScatteredPhoto key={`${photo.url}-${index}`} photo={photo} index={index} />
          ))}
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div
              className="max-w-xl px-4"
              style={{
                background:
                  "radial-gradient(ellipse at center, var(--color-bg, #fff) 46%, transparent 74%)",
              }}
            >
              <Copy />
            </div>
          </div>
        </div>
      ) : (
        <div className="container-page relative">
          <Copy />
        </div>
      )}
    </section>
  );
}

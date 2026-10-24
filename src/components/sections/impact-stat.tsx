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

/** Same photos always land in the same spots until the set changes. */
function scatter<T extends { url: string }>(items: T[]): T[] {
  const seed = items.map((item) => item.url).join("|");
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) hash = Math.imul(hash ^ seed.charCodeAt(i), 16777619);
  return items
    .map((item, index) => {
      hash = Math.imul(hash ^ (index + 1), 16777619);
      return { item, rank: hash >>> 0 };
    })
    .sort((a, b) => a.rank - b.rank)
    .map((row) => row.item);
}

const TILTS = [-8, 6, -5, 7, -3, 9, -7, 4, -6, 5];
const LIFTS = ["translate-y-2", "-translate-y-3", "translate-y-4", "-translate-y-1", "translate-y-1", "-translate-y-4"];

function Polaroid({
  photo,
  index,
  className,
}: {
  photo: ImpactPhoto;
  index: number;
  className?: string;
}) {
  const tilt = TILTS[index % TILTS.length] ?? 0;
  const portrait = index % 3 !== 1;
  return (
    <motion.figure
      className={cn(
        "relative shrink-0 rounded-[1.15rem] bg-white p-1.5 shadow-[0_22px_44px_-26px_rgba(15,17,23,0.7)] ring-1 ring-black/10",
        LIFTS[index % LIFTS.length],
        portrait ? "w-[5.35rem] sm:w-36 lg:w-40" : "w-[4.4rem] sm:w-28 lg:w-32",
        className,
      )}
      style={{ rotate: tilt }}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: (index % 5) * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={cn("relative overflow-hidden rounded-[0.85rem] bg-zinc-100", portrait ? "aspect-[3/4]" : "aspect-square")}>
        <Image
          src={photo.url}
          alt={photo.alt || "HYDRA"}
          fill
          sizes="(min-width: 1024px) 180px, 30vw"
          className="object-cover"
        />
      </div>
    </motion.figure>
  );
}

function PhotoStrip({ photos, start, className }: { photos: ImpactPhoto[]; start: number; className?: string }) {
  if (photos.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-x-3 gap-y-5 sm:gap-x-4", className)}>
      {photos.map((photo, i) => (
        <Polaroid key={`${photo.url}-${start + i}`} photo={photo} index={start + i} />
      ))}
    </div>
  );
}

function place(photos: ImpactPhoto[]) {
  if (photos.length <= 4) {
    const mid = Math.ceil(photos.length / 2);
    return { top: photos.slice(0, mid), bottom: photos.slice(mid), left: [] as ImpactPhoto[], right: [] as ImpactPhoto[] };
  }
  const side = photos.length >= 8 ? 2 : 1;
  const left = photos.slice(0, side);
  const right = photos.slice(side, side * 2);
  const rest = photos.slice(side * 2);
  const mid = Math.ceil(rest.length / 2);
  return { left, right, top: rest.slice(0, mid), bottom: rest.slice(mid) };
}

function Copy({ crowded }: { crowded: boolean }) {
  return (
    <div className="relative z-10 mx-auto max-w-xl px-2 text-center">
      <motion.p
        className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted sm:text-xs"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Protected worldwide
      </motion.p>
      <motion.p
        className="mt-4 font-semibold leading-[0.9] tracking-[-0.07em] text-fg sm:mt-6"
        style={{ fontSize: crowded ? "clamp(3.4rem, 13vw, 8.5rem)" : "clamp(4.75rem, 20vw, 13rem)" }}
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <CountUp to={20000} className="tabular-nums" />
        <span>+</span>
      </motion.p>
      <motion.div
        className="mx-auto mt-6 max-w-xl space-y-3 sm:mt-8 sm:space-y-4"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl md:text-4xl">
          Devices equipped by HYDRA.
        </h2>
        <p className="text-sm text-pretty text-muted sm:text-base md:text-lg">
          Engineered for the flagship phones people actually carry. Screen armor, cases, camera kits and more — cut per
          model, quality-checked and shipped worldwide.
        </p>
      </motion.div>
    </div>
  );
}

export function ImpactStat({ images = [] }: { images?: ImpactPhoto[] }) {
  const photos = useMemo(() => scatter(images.filter((photo) => photo.url).slice(0, 10)), [images]);
  const crowded = photos.length > 0;
  const { top, bottom, left, right } = place(photos);

  return (
    <section className={cn("relative overflow-hidden", crowded ? "py-8 sm:py-12 lg:py-16" : "py-20 sm:py-28 md:py-40")}>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(78vw,560px)] w-[min(96vw,760px)] -translate-x-1/2 -translate-y-1/2 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in oklab, var(--color-fg, currentColor) 16%, transparent) 1px, transparent 1.5px)",
          backgroundSize: "13px 13px",
          maskImage: "radial-gradient(ellipse at center, black 18%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 18%, transparent 70%)",
        }}
      />

      {crowded ? (
        <div className="relative mx-auto flex max-w-[1240px] flex-col gap-6 px-3 sm:gap-8 sm:px-5 lg:gap-2">
          <PhotoStrip photos={top} start={0} className="lg:-mb-8" />
          <div className="grid items-center gap-6 lg:grid-cols-[minmax(7.5rem,1fr)_minmax(16rem,36rem)_minmax(7.5rem,1fr)] lg:gap-x-2">
            <div className="hidden lg:flex lg:justify-end">
              <PhotoStrip photos={left} start={top.length} className="flex-col items-end" />
            </div>
            <Copy crowded />
            <div className="hidden lg:flex lg:justify-start">
              <PhotoStrip photos={right} start={top.length + left.length} className="flex-col items-start" />
            </div>
          </div>
          <PhotoStrip
            photos={[...left, ...right, ...bottom]}
            start={top.length}
            className="lg:hidden"
          />
          <PhotoStrip photos={bottom} start={top.length + left.length + right.length} className="hidden lg:-mt-6 lg:flex" />
        </div>
      ) : (
        <div className="container-page relative">
          <Copy crowded={false} />
        </div>
      )}
    </section>
  );
}

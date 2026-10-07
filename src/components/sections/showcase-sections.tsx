"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { animate, motion, useInView } from "motion/react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ProductImage } from "@/components/product/product-image";
import { SectionHeading } from "@/components/ui/primitives";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ImpactPhone3D } from "@/components/sections/impact-phone-3d";
import type { ShowcaseContent, ShowcaseVideoItem } from "@/content/site-sections";
import { cn } from "@/lib/utils";

export { CollectionBento } from "@/components/sections/collection-bento";

function youtubeIdFromUrl(url: string): string | null {
  if (!url) return null;
  if (/^[\w-]{11}$/.test(url)) return url;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("/")[0] || null;
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const embed = u.pathname.match(/\/embed\/([^/]+)/);
    return embed?.[1] ?? null;
  } catch {
    return null;
  }
}


function CountUp({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 2.2, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString("en-US")}
    </span>
  );
}

export function ImpactStat() {
  return (
    <section className="relative overflow-x-clip py-16 sm:py-24 md:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(30,64,175,0.18),transparent_65%)]" />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <div className="container-page relative text-center">
        <motion.p
          className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Protected worldwide
        </motion.p>
        <p className="mt-4 text-[clamp(3.25rem,18vw,12rem)] font-semibold leading-none tracking-[-0.06em]">
          <CountUp to={50000} className="bg-gradient-to-b from-white via-fg to-white/55 bg-clip-text text-transparent tabular-nums" />
          <span className="text-muted">+</span>
        </p>
        <motion.div
          className="mx-auto mt-6 max-w-2xl space-y-3 sm:mt-8 sm:space-y-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">Devices equipped by HYDRA.</h2>
          <p className="text-sm text-pretty text-muted sm:text-base">
            Engineered for the flagship phones people actually carry. Screen armor, cases, camera kits and more — cut per model,
            quality-checked and shipped worldwide — with real humans on support when you need them.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

const dropStats = [
  { value: "2 m", label: "drop-tested onto granite" },
  { value: "9H+", label: "surface hardness" },
  { value: "3.2×", label: "stronger than standard glass" },
];

export function DropTest() {
  return (
    <section className="container-page py-8 sm:py-14 md:py-16">
      <div className="relative overflow-hidden rounded-[1.25rem] border border-line bg-surface px-3 pb-7 pt-8 sm:rounded-[2rem] sm:px-6 sm:pb-12 sm:pt-16 md:rounded-[2.5rem] md:px-12 md:pt-20">
        <div className="relative mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">Impact lab</p>
          <h2 className="mt-3 text-[1.65rem] font-semibold tracking-tight text-balance sm:mt-4 sm:text-4xl md:text-6xl">
            Glass breaks. <span className="text-muted">Your screen doesn&apos;t.</span>
          </h2>
          <p className="mt-3 text-sm text-muted sm:mt-4 sm:text-base">
            HYDRA&apos;s sacrificial layer absorbs and spreads impact energy — so the protector takes the hit, not your display.
          </p>
        </div>

        <ImpactPhone3D className="mt-4 sm:mt-6" />

        <div className="relative mx-auto mt-2 grid max-w-3xl grid-cols-3 gap-2 border-t border-line pt-6 text-center sm:gap-6 sm:pt-8 md:gap-10">
          {dropStats.map(({ value, label }) => (
            <div key={label} className="min-w-0 px-0.5">
              <p className="font-mono text-lg font-semibold tracking-tight sm:text-2xl md:text-3xl">{value}</p>
              <p className="mt-1 text-[10px] leading-snug text-muted sm:text-xs md:text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const videoTint = ["from-accent/30 via-accent/5", "from-white/15 via-white/[0.03]", "from-accent/20 via-accent/[0.03]"];

const FALLBACK_VIDEOS: ShowcaseVideoItem[] = [
  {
    title: "Bubble-free install in 2 minutes",
    caption: "The alignment frame does the work — no skill needed.",
    duration: "Guide · 2 min",
    poster: "/products/glass-clear.jpg",
    videoUrl: "",
    href: "/installation",
  },
  {
    title: "Privacy glass, side by side",
    caption: "What your neighbour on the train sees — nothing.",
    duration: "Demo · 1 min",
    poster: "/products/glass-privacy.jpg",
    videoUrl: "",
    href: "/shop?category=privacy-glass",
  },
  {
    title: "Camera armor drop test",
    caption: "Sapphire-coated rings versus a 2-meter fall.",
    duration: "Lab · 90 sec",
    poster: "/products/camera-lens.jpg",
    videoUrl: "",
    href: "/shop?category=camera-armor",
  },
];

/** Temporarily disabled — was crashing homepage error boundary. */
export function VideoShowcase(_props: { content?: ShowcaseContent | null }) {
  return null;
}

function VideoPoster({
  video,
  tint,
  canPlay,
  onPlay,
}: {
  video: ShowcaseVideoItem;
  tint: string;
  canPlay: boolean;
  onPlay: () => void;
}) {
  const content = (
    <>
      <div className={cn("absolute inset-0 bg-gradient-to-b to-black", tint)} />
      <div className="bg-dots absolute inset-0 opacity-40" />
      <div className="absolute inset-x-0 top-[12%] bottom-[38%] transition-transform duration-700 group-hover:scale-105">
        <ProductImage src={video.poster} alt="" fill sizes="(min-width: 768px) 33vw, 18rem" className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]" />
      </div>
      <span className="absolute left-1/2 top-[40%] grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-black shadow-[0_0_0_10px_rgba(255,255,255,0.12)] transition-all duration-300 group-hover:scale-110 group-hover:bg-accent">
        <Play size={22} className="ml-1 fill-current" />
      </span>
      <div className="absolute inset-x-0 bottom-0 space-y-3 p-6 text-left">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">{video.duration}</p>
        <h3 className="text-2xl font-semibold leading-tight tracking-tight text-balance">{video.title}</h3>
        <p className="text-sm text-muted">{video.caption}</p>
      </div>
    </>
  );

  return canPlay ? (
    <button type="button" onClick={onPlay} className="absolute inset-0 overflow-hidden rounded-3xl" aria-label={`Play video: ${video.title}`}>
      {content}
    </button>
  ) : (
    <Link href={video.href} className="absolute inset-0 overflow-hidden rounded-3xl" aria-label={video.title}>
      {content}
    </Link>
  );
}

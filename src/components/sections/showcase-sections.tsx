"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Play } from "lucide-react";
import { animate, motion, useInView } from "motion/react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ProductImage } from "@/components/product/product-image";
import { SectionHeading } from "@/components/ui/primitives";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ImpactPhone3D } from "@/components/sections/impact-phone-3d";
import { showcaseVideos, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import type { NavigationData } from "@/server/queries/catalog";

const categoryArt: Record<string, string> = {
  "tempered-glass": "/products/glass-clear.svg",
  "privacy-glass": "/products/glass-privacy.svg",
  "matte-glass": "/products/glass-matte.svg",
  "camera-armor": "/products/camera-lens.svg",
  cases: "/products/case-clear.svg",
};

export function CollectionBento({ categories }: { categories: NavigationData["categories"] }) {
  return (
    <section className="container-page py-14 sm:py-20 md:py-24">
      <SectionHeading
        eyebrow="Shop by collection"
        title={
          <>
            Armor for every <span className="text-muted">device.</span>
          </>
        }
        action={
          <Link href="/shop" className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg">
            All products <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        }
      />
      <RevealGroup className="grid auto-rows-[13rem] gap-3 sm:auto-rows-[15rem] sm:gap-4 md:grid-cols-4 md:auto-rows-[17rem]" stagger={0.08}>
        {categories.slice(0, 5).map((c, i) => {
          const hero = i === 0;
          return (
            <RevealItem key={c.id} className={cn("h-full min-w-0", hero && "md:col-span-2 md:row-span-2")}>
              <SpotlightCard className="group h-full overflow-hidden">
                <Link href={`/shop?category=${c.slug}`} className="relative flex h-full flex-col justify-end p-4 sm:p-6 md:p-8">
                  {categoryArt[c.slug] && (
                    <div className={cn("absolute inset-x-0 top-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:scale-[1.03]", hero ? "bottom-20 sm:bottom-24" : "bottom-14 sm:bottom-16")}>
                      <ProductImage
                        src={categoryArt[c.slug]}
                        alt=""
                        fill
                        sizes={hero ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 100vw"}
                        className="object-contain p-3 opacity-90 sm:p-4"
                      />
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/75 to-transparent" />
                  <div className="relative flex items-end justify-between gap-3 sm:gap-4">
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-subtle">0{i + 1}</p>
                      <h3 className={cn("mt-1.5 font-semibold tracking-tight sm:mt-2", hero ? "text-3xl sm:text-4xl md:text-5xl" : "text-xl sm:text-2xl")}>{c.name}</h3>
                      {hero && c.description && <p className="mt-2 hidden max-w-sm text-sm text-muted sm:mt-3 sm:block">{c.description}</p>}
                    </div>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line-strong bg-white/5 transition-colors duration-300 group-hover:border-fg/40 group-hover:bg-fg group-hover:text-bg sm:size-10">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                </Link>
              </SpotlightCard>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
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
    <section className="relative overflow-hidden py-28">
      <div className="container-page relative text-center">
        <motion.p
          className="font-mono text-[11px] uppercase tracking-[0.3em] text-subtle"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Protected across Bangladesh
        </motion.p>
        <p className="mt-4 text-[clamp(4rem,15vw,12rem)] font-semibold leading-none tracking-[-0.06em]">
          <CountUp to={50000} className="text-fg tabular-nums" />
          <span className="text-muted">+</span>
        </p>
        <motion.div
          className="mx-auto mt-8 max-w-2xl space-y-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Devices equipped by HYDRA.</h2>
          <p className="text-pretty text-muted">
            Built in Dhaka for the phones Bangladesh actually carries. Screen armor, cases, camera kits and more — cut per model, quality-checked and delivered to all 64
            districts — with real humans on support when you need them.
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
    <section className="container-page py-10 sm:py-14 md:py-16">
      <div className="relative overflow-hidden rounded-[1.5rem] border border-line bg-surface px-4 pb-8 pt-10 sm:rounded-[2rem] sm:px-6 sm:pb-12 sm:pt-16 md:rounded-[2.5rem] md:px-12 md:pt-20">
        <div className="relative mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">Impact lab</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:mt-4 sm:text-4xl md:text-6xl">
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

export function VideoShowcase() {
  const [playing, setPlaying] = useState<number | null>(null);

  return (
    <section className="container-page py-14 sm:py-20 md:py-24">
      <SectionHeading
        eyebrow="Watch & learn"
        title={
          <>
            See HYDRA <span className="text-muted">in action.</span>
          </>
        }
        action={
          <a
            href={siteConfig.social.youtube}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-line-strong bg-white/5 px-5 py-2.5 text-sm transition-all hover:border-danger/50 hover:bg-danger/10"
          >
            <Play size={14} className="fill-danger text-danger" /> YouTube channel
          </a>
        }
      />
      {/* One-by-one on scroll: staggerChildren reveals each card in sequence */}
      <RevealGroup
        className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:-mx-5 sm:gap-4 sm:px-5 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0"
        stagger={0.2}
      >
        {showcaseVideos.map((v, i) => (
          <RevealItem key={v.title} className="w-[78vw] max-w-[20rem] shrink-0 snap-start sm:w-72 md:w-auto md:max-w-none" y={44}>
            <SpotlightCard className="group aspect-[9/14] overflow-hidden">
              {playing === i && v.youtubeId ? (
                <iframe
                  className="absolute inset-0 h-full w-full rounded-3xl"
                  src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}?autoplay=1&rel=0`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <VideoPoster video={v} tint={videoTint[i % videoTint.length]} onPlay={() => setPlaying(i)} />
              )}
            </SpotlightCard>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

function VideoPoster({ video, tint, onPlay }: { video: (typeof showcaseVideos)[number]; tint: string; onPlay: () => void }) {
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

  return video.youtubeId ? (
    <button type="button" onClick={onPlay} className="absolute inset-0 overflow-hidden rounded-3xl" aria-label={`Play video: ${video.title}`}>
      {content}
    </button>
  ) : (
    <Link href={video.href} className="absolute inset-0 overflow-hidden rounded-3xl" aria-label={video.title}>
      {content}
    </Link>
  );
}

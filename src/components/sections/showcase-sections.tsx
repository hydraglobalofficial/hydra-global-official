"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Play, ShieldCheck, Zap, Gem } from "lucide-react";
import { animate, motion, useInView } from "motion/react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ProductImage } from "@/components/product/product-image";
import { SectionHeading } from "@/components/ui/primitives";
import { SpotlightCard } from "@/components/ui/spotlight-card";
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

const categoryGlow = ["bg-accent/25", "bg-accent-3/20", "bg-accent-2/25", "bg-accent/20", "bg-accent-2/20"];

export function CollectionBento({ categories }: { categories: NavigationData["categories"] }) {
  return (
    <section className="container-page py-24">
      <SectionHeading
        eyebrow="Shop by collection"
        title={
          <>
            Armor for every <span className="text-gradient">surface.</span>
          </>
        }
        action={
          <Link href="/shop" className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg">
            All products <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        }
      />
      <RevealGroup className="grid auto-rows-[15rem] gap-4 md:grid-cols-4 md:auto-rows-[17rem]" stagger={0.08}>
        {categories.slice(0, 5).map((c, i) => {
          const hero = i === 0;
          return (
            <RevealItem key={c.id} className={cn("h-full", hero && "md:col-span-2 md:row-span-2")}>
              <SpotlightCard className="group h-full overflow-hidden">
                <Link href={`/shop?category=${c.slug}`} className="relative flex h-full flex-col justify-end p-6 md:p-8">
                  <div className="bg-dots pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_75%)]" />
                  <div className={cn("pointer-events-none absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[70px] transition-all duration-700 group-hover:scale-125", categoryGlow[i], hero ? "size-80" : "size-44")} />
                  {categoryArt[c.slug] && (
                    <div className={cn("absolute inset-x-0 top-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2 group-hover:scale-[1.06]", hero ? "bottom-24" : "bottom-16")}>
                      <ProductImage
                        src={categoryArt[c.slug]}
                        alt=""
                        fill
                        sizes={hero ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 100vw"}
                        className="object-contain p-4 drop-shadow-[0_24px_40px_rgba(61,227,255,0.22)]"
                      />
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/70 to-transparent" />
                  <div className="relative flex items-end justify-between gap-4">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">Collection 0{i + 1}</p>
                      <h3 className={cn("mt-2 font-semibold tracking-tight", hero ? "text-4xl md:text-5xl" : "text-2xl")}>{c.name}</h3>
                      {hero && c.description && <p className="mt-3 max-w-sm text-sm text-muted">{c.description}</p>}
                    </div>
                    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line-strong bg-white/5 transition-all duration-300 group-hover:border-accent/50 group-hover:bg-accent group-hover:text-black">
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
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[60rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" />
      <div className="container-page relative text-center">
        <motion.p
          className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Protected across Bangladesh
        </motion.p>
        <p className="mt-4 text-[clamp(4rem,15vw,12rem)] font-semibold leading-none tracking-[-0.06em]">
          <CountUp to={50000} className="text-gradient-soft tabular-nums" />
          <span className="text-gradient">+</span>
        </p>
        <motion.div
          className="mx-auto mt-8 max-w-2xl space-y-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Devices armored by HYDRA.</h2>
          <p className="text-pretty text-muted">
            Built in Dhaka for the phones Bangladesh actually carries. Every protector is laser-cut per model, quality-checked batch by batch and delivered to all 64
            districts — with real humans on support when you need them.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

const shards = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2 + (i % 2 ? 0.18 : -0.12);
  const distance = 170 + ((i * 37) % 90);
  return {
    x: Math.round(Math.cos(angle) * distance * 1.6),
    y: Math.round(Math.sin(angle) * distance * 0.9),
    rotate: ((i * 53) % 160) - 80,
    size: 22 + ((i * 29) % 36),
    shape: i % 3,
  };
});

const shardClip = ["polygon(50% 0, 100% 80%, 0 100%)", "polygon(0 0, 100% 20%, 70% 100%, 10% 70%)", "polygon(20% 0, 100% 40%, 60% 100%, 0 60%)"];

const dropStats = [
  { icon: Zap, value: "2 m", label: "drop-tested onto granite" },
  { icon: Gem, value: "9H+", label: "surface hardness" },
  { icon: ShieldCheck, value: "3.2×", label: "stronger than standard glass" },
];

export function DropTest() {
  return (
    <section className="container-page py-16">
      <div className="card-premium relative overflow-hidden rounded-[2.5rem] px-6 pb-12 pt-16 md:px-12 md:pt-20">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute left-1/2 top-[55%] size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-2/20 blur-[120px]" />

        <div className="relative mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">Impact lab</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-balance md:text-6xl">
            Glass breaks. <span className="text-gradient">Your screen doesn&apos;t.</span>
          </h2>
          <p className="mt-4 text-muted">HYDRA&apos;s sacrificial layer absorbs and spreads impact energy — so the protector takes the hit, not your display.</p>
        </div>

        <div className="relative mx-auto mt-10 grid h-[26rem] max-w-4xl place-items-center md:h-[30rem]">
          <motion.div
            aria-hidden
            className="absolute size-40 rounded-full border border-accent/50"
            animate={{ scale: [0.6, 2.6], opacity: [0.7, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            aria-hidden
            className="absolute size-40 rounded-full border border-accent-2/50"
            animate={{ scale: [0.6, 2.6], opacity: [0.7, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 1.2 }}
          />

          {shards.map((s, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute border border-white/30 bg-gradient-to-br from-white/40 via-accent/15 to-accent-2/25 shadow-[0_0_20px_rgba(61,227,255,0.35)] backdrop-blur-sm"
              style={{ width: s.size, height: s.size * 1.3, clipPath: shardClip[s.shape] }}
              initial={{ x: 0, y: 0, opacity: 0, rotate: 0, scale: 0.3 }}
              whileInView={{ x: s.x, y: s.y, opacity: 1, rotate: s.rotate, scale: 1 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ type: "spring", stiffness: 60, damping: 14, delay: 0.15 + (i % 5) * 0.03 }}
            />
          ))}

          <motion.div
            className="relative"
            initial={{ y: -120, opacity: 0, rotate: -8 }}
            whileInView={{ y: 0, opacity: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
          >
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
              <svg viewBox="0 0 200 400" className="h-72 w-auto md:h-80" aria-hidden>
                <defs>
                  <linearGradient id="dt-frame" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#4a4a56" />
                    <stop offset="0.5" stopColor="#15151b" />
                    <stop offset="1" stopColor="#34343e" />
                  </linearGradient>
                  <linearGradient id="dt-screen" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#0b3a4a" />
                    <stop offset="0.5" stopColor="#0a0a14" />
                    <stop offset="1" stopColor="#2a1352" />
                  </linearGradient>
                  <linearGradient id="dt-edge" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#3de3ff" />
                    <stop offset="1" stopColor="#7b61ff" />
                  </linearGradient>
                </defs>
                <rect x="5" y="5" width="190" height="390" rx="36" fill="url(#dt-frame)" />
                <rect x="12" y="12" width="176" height="376" rx="30" fill="url(#dt-screen)" />
                <rect x="73" y="24" width="54" height="15" rx="7.5" fill="#000" />
                <text x="100" y="120" textAnchor="middle" fill="#fff" fontSize="46" fontWeight="600" fontFamily="ui-monospace, monospace">
                  09:41
                </text>
                <g stroke="#fff" strokeOpacity="0.55" strokeWidth="1" fill="none">
                  <path d="M100 230 L60 180 L40 150" />
                  <path d="M100 230 L150 200 L175 190" />
                  <path d="M100 230 L120 290 L110 340" />
                  <path d="M100 230 L55 260 L25 300" />
                  <path d="M100 230 L140 250" />
                </g>
                <circle cx="100" cy="230" r="5" fill="#fff" fillOpacity="0.9" />
                <rect x="3" y="3" width="194" height="394" rx="38" fill="none" stroke="url(#dt-edge)" strokeWidth="1.5" />
              </svg>
            </motion.div>
            <motion.div
              className="glass absolute -right-4 top-1/2 hidden translate-x-full rounded-2xl px-4 py-3 sm:block"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Display</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-success">
                <ShieldCheck size={14} /> 0 damage
              </p>
            </motion.div>
            <motion.div
              className="glass absolute -left-4 top-[30%] hidden -translate-x-full rounded-2xl px-4 py-3 sm:block"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.95, duration: 0.5 }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Protector</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-accent">
                <Zap size={14} /> took the hit
              </p>
            </motion.div>
          </motion.div>
        </div>

        <RevealGroup className="relative grid gap-3 sm:grid-cols-3" stagger={0.1}>
          {dropStats.map(({ icon: Icon, value, label }) => (
            <RevealItem key={label}>
              <div className="glass flex items-center gap-4 rounded-2xl p-5">
                <span className="grid size-11 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="font-mono text-2xl font-semibold">{value}</p>
                  <p className="text-xs text-muted">{label}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

const videoTint = ["from-accent/40 via-accent/5", "from-accent-2/45 via-accent-2/5", "from-accent-3/35 via-accent-3/5"];

export function VideoShowcase() {
  const [playing, setPlaying] = useState<number | null>(null);

  return (
    <section className="container-page py-24">
      <SectionHeading
        eyebrow="Watch & learn"
        title={
          <>
            See HYDRA <span className="text-gradient">in action.</span>
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
      <RevealGroup className="no-scrollbar -mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:px-0" stagger={0.1}>
        {showcaseVideos.map((v, i) => (
          <RevealItem key={v.title} className="w-72 shrink-0 snap-start md:w-auto">
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

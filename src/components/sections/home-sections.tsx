"use client";

import Link from "next/link";
import { ArrowRight, Droplets, Fingerprint, Layers, PackageCheck, ScanLine, ShoppingBag, Sparkles, Truck, Wrench, Zap } from "lucide-react";
import { motion } from "motion/react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/primitives";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { brands } from "@/config/site";
import type { HowItWorksContent, NewsletterContent } from "@/content/site-sections";
import type { NavigationData } from "@/server/queries/catalog";

function DeviceArt({ slug }: { slug: "iphone" | "samsung" }) {
  const iphone = slug === "iphone";
  return (
    <svg viewBox="0 0 220 300" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`da-screen-${slug}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={iphone ? "#0b3a4f" : "#16202c"} />
          <stop offset="0.6" stopColor="#07070c" />
          <stop offset="1" stopColor={iphone ? "#10233a" : "#0c1f33"} />
        </linearGradient>
        <linearGradient id={`da-edge-${slug}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1e40af" stopOpacity="0.9" />
          <stop offset="1" stopColor="#e4e4e7" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <g transform="translate(60 20) rotate(8 50 130)">
        <rect width="100" height="220" rx={iphone ? 22 : 14} fill="#101016" stroke="rgba(255,255,255,0.14)" />
      </g>
      <g transform="translate(40 30)">
        <rect width="120" height="250" rx={iphone ? 26 : 16} fill="#0c0c12" stroke="rgba(255,255,255,0.2)" />
        <rect x="5" y="5" width="110" height="240" rx={iphone ? 22 : 13} fill={`url(#da-screen-${slug})`} />
        {iphone ? <rect x="42" y="14" width="36" height="10" rx="5" fill="#000" /> : <circle cx="60" cy="18" r="4" fill="#000" />}
        <rect x="-3" y="-3" width="126" height="256" rx={iphone ? 28 : 18} fill="none" stroke={`url(#da-edge-${slug})`} strokeWidth="1.2" opacity="0.8" />
        <path d="M14 20 L52 20 L14 110 Z" fill="#fff" opacity="0.06" />
        <text x="60" y="140" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600" letterSpacing="4">HYDRA</text>
      </g>
    </svg>
  );
}

export function ShopByDevice({ devices }: { devices: NavigationData["devices"] }) {
  const cards = [
    { slug: "iphone" as const, glow: "bg-accent/25", count: devices.filter((d) => d.brand === "APPLE").length, models: devices.filter((d) => d.brand === "APPLE").slice(0, 4) },
    { slug: "samsung" as const, glow: "bg-white/10", count: devices.filter((d) => d.brand === "SAMSUNG").length, models: devices.filter((d) => d.brand === "SAMSUNG").slice(0, 4) },
  ];
  return (
    <section className="container-page py-24">
      <SectionHeading eyebrow="Shop by device" title={<>Pick your <span className="text-muted">platform.</span></>} />
      <RevealGroup className="grid gap-5 md:grid-cols-2" stagger={0.12}>
        {cards.map((card) => (
          <RevealItem key={card.slug}>
            <SpotlightCard className="group h-full overflow-hidden">
              <Link href={`/shop/${card.slug}`} className="relative grid min-h-96 grid-cols-[1fr_auto] gap-4 p-8 md:p-10">
                <div className={`pointer-events-none absolute -right-20 -top-20 size-80 rounded-full ${card.glow} blur-[100px] opacity-50 transition-opacity duration-700 group-hover:opacity-90`} />
                <div className="bg-dots pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
                <div className="relative flex flex-col justify-between">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">{card.count} models supported</p>
                    <h3 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">{brands[card.slug].label}</h3>
                    <p className="mt-3 max-w-xs text-muted">{brands[card.slug].blurb}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {card.models.map((m) => (
                        <span key={m.slug} className="rounded-full border border-line bg-white/[0.03] px-3 py-1 text-xs text-muted">
                          {m.model}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-line-strong bg-white/5 px-5 py-2.5 text-sm font-medium transition-all group-hover:border-accent/40 group-hover:bg-accent/10">
                    Shop {brands[card.slug].label}
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
                <div className="relative hidden w-44 transition-transform duration-700 group-hover:-translate-y-2 group-hover:rotate-[-2deg] sm:block md:w-52">
                  <DeviceArt slug={card.slug} />
                </div>
              </Link>
            </SpotlightCard>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

const tech = [
  { icon: Layers, title: "5-layer construction", text: "Anti-shatter film, tempered core, optical adhesive, AR coat and oleophobic top layer.", stat: "5 layers" },
  { icon: Zap, title: "Impact absorption", text: "Drop-tested from 2 meters onto granite. Glass sacrifices itself — your screen doesn't.", stat: "2 m drop" },
  { icon: Fingerprint, title: "Ultrasonic ready", text: "Certified with in-display fingerprint readers on Galaxy S and iPhone Face ID sensors.", stat: "100% touch" },
  { icon: Droplets, title: "Hydrophobic coat", text: "Water and oil bead off. Wipes clean with a single swipe.", stat: "110° contact" },
  { icon: ScanLine, title: "Laser-cut precision", text: "±0.05mm tolerance ensures full coverage without case conflicts.", stat: "±0.05 mm" },
  { icon: Sparkles, title: "Dust-free install", text: "Alignment frame and clean-room kit included in every box.", stat: "2 min fit" },
];

export function TechGrid() {
  return (
    <section className="relative overflow-hidden py-24 md:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-72 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(30,64,175,0.12),transparent_65%)]" />
      <div className="container-page relative">
        <SectionHeading align="center" eyebrow="Engineering" title={<>Protection, <span className="text-muted">re-engineered.</span></>} description="Every HYDRA protector is designed in-house and quality-checked batch by batch." />
        <RevealGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {tech.map(({ icon: Icon, title, text, stat }) => (
            <RevealItem key={title} className="h-full">
              <SpotlightCard className="group h-full overflow-hidden p-8">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="flex items-start justify-between">
                  <span className="relative grid size-12 place-items-center rounded-2xl border border-accent/25 bg-accent/10 text-accent">
                    <span className="absolute inset-0 rounded-2xl bg-accent/20 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
                    <Icon className="relative transition-transform duration-500 group-hover:scale-110" size={22} />
                  </span>
                  <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-subtle transition-colors group-hover:border-accent/30 group-hover:text-accent">{stat}</span>
                </div>
                <h3 className="mt-8 text-lg font-medium">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </SpotlightCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

const stepIcons = [ShoppingBag, Truck, Wrench, PackageCheck];

export function HowItWorks({ content }: { content: HowItWorksContent }) {
  return (
    <section className="relative overflow-hidden py-24 md:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-16 h-56 w-[40rem] -translate-x-1/2 rounded-full bg-accent/[0.08] blur-[120px]" />
      <div className="container-page relative">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={
            <>
              {content.title} <span className="text-muted">{content.titleMuted}</span>
            </>
          }
        />
        <RevealGroup className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          <div aria-hidden className="divider-glow absolute left-8 right-8 top-[3.25rem] hidden lg:block" />
          {content.steps.map(({ title, text }, i) => {
            const Icon = stepIcons[i % stepIcons.length];
            return (
              <RevealItem key={title} className="relative h-full">
                <SpotlightCard className="group h-full overflow-hidden p-7">
                  <div className="pointer-events-none absolute -right-6 -top-6 font-mono text-6xl font-semibold text-white/[0.03] transition-colors group-hover:text-accent/[0.1]">
                    0{i + 1}
                  </div>
                  <div className="relative flex items-center gap-4">
                    <span className="relative grid size-12 place-items-center rounded-full border border-accent/30 bg-accent/10 text-accent shadow-[0_0_0_6px_rgba(0,0,0,0.85),0_0_28px_-6px_rgba(30,64,175,0.7)] transition-transform duration-500 group-hover:scale-105">
                      <Icon size={20} />
                    </span>
                    <span className="font-mono text-xs tracking-[0.2em] text-subtle">STEP 0{i + 1}</span>
                  </div>
                  <h3 className="relative mt-6 text-lg font-medium">{title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted">{text}</p>
                </SpotlightCard>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}

export function NewsletterBlock({ content }: { content: NewsletterContent }) {
  return (
    <section className="container-page py-16">
      <div className="card-premium relative overflow-hidden rounded-[2rem] px-6 py-16 text-center md:py-24">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-70" />
        <motion.div
          className="pointer-events-none absolute left-1/2 top-0 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-accent/25 blur-[90px]"
          animate={{ opacity: [0.45, 0.9, 0.45], scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full bg-white/[0.05] blur-[90px]" />
        <motion.div
          className="relative mx-auto max-w-xl space-y-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">{content.eyebrow}</p>
          <h2 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            {content.title} <span className="text-accent">{content.titleAccent}</span> list.
          </h2>
          <p className="text-muted">{content.description}</p>
          <NewsletterForm className="mx-auto max-w-md text-left" />
        </motion.div>
      </div>
    </section>
  );
}

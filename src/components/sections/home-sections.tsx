import Link from "next/link";
import { ArrowRight, Droplets, Fingerprint, Layers, QrCode, ScanLine, Sparkles, Zap } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Rating, SectionHeading } from "@/components/ui/primitives";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { brands } from "@/config/site";
import type { NavigationData } from "@/server/queries/catalog";

export function ShopByDevice({ devices }: { devices: NavigationData["devices"] }) {
  const cards = [
    { slug: "iphone" as const, gradient: "from-accent/25 via-accent/5", count: devices.filter((d) => d.brand === "APPLE").length },
    { slug: "samsung" as const, gradient: "from-accent-2/30 via-accent-2/5", count: devices.filter((d) => d.brand === "SAMSUNG").length },
  ];
  return (
    <section className="container-page py-24">
      <SectionHeading eyebrow="Shop by device" title="Pick your platform." />
      <div className="grid gap-5 md:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.slug}
            href={`/shop/${card.slug}`}
            className="group relative flex min-h-80 flex-col justify-between overflow-hidden rounded-3xl border border-line bg-surface p-8 transition-all hover:border-line-strong md:p-10"
          >
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.gradient} to-transparent opacity-60 transition-opacity group-hover:opacity-100`} />
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
            <div className="relative">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">{card.count} models supported</p>
              <h3 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">{brands[card.slug].label}</h3>
              <p className="mt-3 max-w-sm text-muted">{brands[card.slug].blurb}</p>
            </div>
            <span className="relative flex items-center gap-2 text-sm font-medium">
              Shop {brands[card.slug].label}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </span>
            <svg viewBox="0 0 120 240" className="absolute -bottom-10 right-8 h-64 opacity-70 transition-transform duration-700 group-hover:-translate-y-3 md:h-72" aria-hidden>
              <rect x="2" y="2" width="116" height="236" rx="24" fill="#0b0b10" stroke="rgba(255,255,255,0.18)" />
              <rect x="8" y="8" width="104" height="224" rx="19" fill={`url(#sbd-${card.slug})`} />
              <defs>
                <linearGradient id={`sbd-${card.slug}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor={card.slug === "iphone" ? "#0a3440" : "#1d1240"} />
                  <stop offset="1" stopColor="#050507" />
                </linearGradient>
              </defs>
              {card.slug === "iphone" ? <rect x="44" y="16" width="32" height="10" rx="5" fill="#000" /> : <circle cx="60" cy="20" r="4" fill="#000" />}
            </svg>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function CategoryShowcase({ categories }: { categories: NavigationData["categories"] }) {
  return (
    <section className="container-page py-12">
      <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-5 md:px-0">
        {categories.map((c, i) => (
          <Link
            key={c.id}
            href={`/shop?category=${c.slug}`}
            className="group glass min-w-52 shrink-0 rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:border-accent/30"
          >
            <p className="font-mono text-[10px] text-subtle">0{i + 1}</p>
            <p className="mt-6 font-medium group-hover:text-accent">{c.name}</p>
            <p className="mt-1 line-clamp-2 text-xs text-muted">{c.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

const tech = [
  { icon: Layers, title: "5-layer construction", text: "Anti-shatter film, tempered core, optical adhesive, AR coat and oleophobic top layer." },
  { icon: Zap, title: "Impact absorption", text: "Drop-tested from 2 meters onto granite. Glass sacrifices itself — your screen doesn't." },
  { icon: Fingerprint, title: "Ultrasonic ready", text: "Certified with in-display fingerprint readers on Galaxy S and iPhone Face ID sensors." },
  { icon: Droplets, title: "Hydrophobic coat", text: "Water and oil bead off. Wipes clean with a single swipe." },
  { icon: ScanLine, title: "Laser-cut precision", text: "±0.05mm tolerance ensures full coverage without case conflicts." },
  { icon: Sparkles, title: "Dust-free install", text: "Alignment frame and clean-room kit included in every box." },
];

export function TechGrid() {
  return (
    <section className="relative py-24">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[120px]" />
      <div className="container-page relative">
        <SectionHeading align="center" eyebrow="Engineering" title={<>Protection, <span className="text-gradient">re-engineered.</span></>} description="Every HYDRA protector is designed in-house and quality-checked batch by batch." />
        <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {tech.map(({ icon: Icon, title, text }) => (
            <div key={title} className="group bg-surface p-8 transition-colors hover:bg-surface-2">
              <Icon className="text-accent transition-transform duration-500 group-hover:scale-110" size={24} />
              <h3 className="mt-6 text-lg font-medium">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function VerifyBanner() {
  return (
    <section className="container-page py-12">
      <div className="relative overflow-hidden rounded-3xl border border-line bg-[linear-gradient(120deg,#021a21,#050508_45%,#130a2a)] p-8 md:p-14">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">Anti-counterfeit</p>
            <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-5xl">Fakes look alike. Ours can prove it.</h2>
            <p className="max-w-lg text-muted">
              Scratch the label inside your box to reveal a unique code, or scan the QR. We&apos;ll confirm instantly if your HYDRA is genuine.
            </p>
            <ButtonLink href="/verify" size="lg">
              Verify your product <ArrowRight size={18} />
            </ButtonLink>
          </div>
          <div className="relative mx-auto grid size-52 place-items-center rounded-3xl border border-accent/30 bg-black/50 md:size-60">
            <QrCode size={120} className="text-fg" strokeWidth={1} />
            <div className="pointer-events-none absolute inset-4 overflow-hidden rounded-2xl">
              <div className="h-1/2 w-full bg-gradient-to-b from-transparent via-accent/40 to-transparent animate-scan" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  { name: "Tahmid R.", device: "iPhone 17 Pro Max", text: "Honestly can't tell there's a protector on it. Dropped it on the stairs last week — glass cracked, screen perfect.", rating: 5 },
  { name: "Nusrat J.", device: "Galaxy S25 Ultra", text: "First protector that actually works with the ultrasonic fingerprint. The install kit made it idiot-proof.", rating: 5 },
  { name: "Arif H.", device: "iPhone 16 Pro", text: "Privacy glass is a game changer on the metro. Verified mine on the site in 5 seconds.", rating: 4.5 },
];

export function Testimonials() {
  return (
    <section className="container-page py-24">
      <SectionHeading eyebrow="Reviews" title="Loved by thousands." description={<span className="flex items-center gap-3"><Rating value={4.8} size={16} /> 4.8 average from verified buyers</span>} />
      <div className="grid gap-5 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure key={t.name} className="glass flex flex-col justify-between gap-8 rounded-3xl p-7">
            <blockquote className="text-pretty leading-relaxed">&ldquo;{t.text}&rdquo;</blockquote>
            <figcaption className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted">{t.device} · Verified buyer</p>
              </div>
              <Rating value={t.rating} size={12} />
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function NewsletterBlock() {
  return (
    <section className="container-page py-12">
      <div className="border-gradient relative overflow-hidden rounded-3xl px-6 py-14 text-center md:py-20">
        <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-96 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative mx-auto max-w-xl space-y-5">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Join the HYDRA list.</h2>
          <p className="text-muted">Launch drops, member pricing and 10% off your first order. No spam, ever.</p>
          <NewsletterForm className="mx-auto max-w-md text-left" />
        </div>
      </div>
    </section>
  );
}

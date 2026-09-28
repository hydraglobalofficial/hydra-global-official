import { ArrowRight, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow, Rating } from "@/components/ui/primitives";
import { PhoneVisual } from "./phone-visual";

const stats = [
  { value: "9H+", label: "Surface hardness" },
  { value: "0.33mm", label: "Ultra-thin glass" },
  { value: "99.9%", label: "HD clarity" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-32 left-1/4 h-[32rem] w-[32rem] rounded-full bg-accent/15 blur-[140px]" />
      <div className="pointer-events-none absolute right-0 top-20 h-[28rem] w-[28rem] rounded-full bg-accent-2/15 blur-[140px]" />

      <div className="container-page relative grid items-center gap-12 pb-20 pt-14 md:pt-20 lg:grid-cols-2 lg:gap-8 lg:pb-28">
        <div className="space-y-8 animate-fade-up">
          <Eyebrow>Next-gen screen armor · 2026</Eyebrow>
          <h1 className="text-5xl font-semibold leading-[1.02] tracking-tight text-balance md:text-7xl">
            Invisible strength. <span className="text-gradient">Engineered</span> for flagships.
          </h1>
          <p className="max-w-lg text-lg text-pretty text-muted">
            Aerospace-grade tempered glass, privacy filters and camera armor — laser-cut for iPhone and Samsung Galaxy, with
            authenticity you can verify in seconds.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink href="/shop" size="lg">
              Shop the collection <ArrowRight size={18} />
            </ButtonLink>
            <ButtonLink href="/verify" size="lg" variant="outline">
              <ShieldCheck size={18} /> Verify product
            </ButtonLink>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <div className="flex -space-x-2">
              {["#3de3ff", "#7b61ff", "#00ffa3", "#ffffff"].map((c) => (
                <span key={c} className="size-8 rounded-full border-2 border-black" style={{ background: `linear-gradient(135deg, ${c}, #111)` }} />
              ))}
            </div>
            <div>
              <Rating value={4.8} size={13} />
              <p className="mt-0.5 text-xs text-muted">Trusted by 50,000+ phone owners in Bangladesh</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <PhoneVisual />
          <div className="glass absolute -left-2 bottom-16 hidden rounded-2xl p-4 animate-float sm:block lg:-left-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Impact test</p>
            <p className="mt-1 text-2xl font-semibold text-accent">3.2×</p>
            <p className="text-xs text-muted">stronger than standard glass</p>
          </div>
          <div className="glass absolute -right-2 top-16 hidden rounded-2xl p-4 animate-float [animation-delay:1.5s] sm:block lg:right-0">
            <p className="flex items-center gap-2 text-xs"><span className="size-2 rounded-full bg-success" /> Authenticity verified</p>
            <p className="mt-1 font-mono text-sm tracking-widest text-muted">HYD-7K2Q-9XA4</p>
          </div>
        </div>
      </div>

      <div className="container-page relative">
        <dl className="grid grid-cols-3 divide-x divide-line rounded-3xl border border-line bg-surface/60 backdrop-blur">
          {stats.map((s) => (
            <div key={s.label} className="px-4 py-6 text-center md:py-8">
              <dt className="order-2 mt-1 text-xs text-muted md:text-sm">{s.label}</dt>
              <dd className="font-mono text-2xl font-semibold tracking-tight md:text-4xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

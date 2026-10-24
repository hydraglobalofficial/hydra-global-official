"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { SectionHeading } from "@/components/ui/primitives";
import { useLocalLockScreen } from "@/hooks/use-local-lock-screen";
import type { ClarityContent } from "@/content/site-sections";
import { CompareSlider } from "./compare-slider";

function Scene({ damaged }: { damaged?: boolean }) {
  const clock = useLocalLockScreen();

  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`sky-${damaged ? "d" : "c"}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#020617" />
          <stop offset="0.45" stopColor="#0a1628" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <radialGradient id={`sun-${damaged ? "d" : "c"}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#1e40af" />
          <stop offset="1" stopColor="#1e3a8a" stopOpacity="0" />
        </radialGradient>
        <filter id="dull">
          <feGaussianBlur stdDeviation="2.2" />
          <feColorMatrix type="saturate" values="0.35" />
        </filter>
      </defs>
      <g filter={damaged ? "url(#dull)" : undefined}>
        <rect width="800" height="500" fill={`url(#sky-${damaged ? "d" : "c"})`} />
        <circle cx="560" cy="170" r="150" fill={`url(#sun-${damaged ? "d" : "c"})`} opacity="0.6" />
        <circle cx="560" cy="170" r="54" fill="#1e3a8a" />
        <path d="M0 380 L140 270 L250 340 L380 220 L520 330 L640 260 L800 350 L800 500 L0 500 Z" fill="#0d1119" />
        <path d="M0 430 L180 340 L320 410 L470 320 L620 400 L800 360 L800 500 L0 500 Z" fill="#06060f" />
        <text
          x="60"
          y="120"
          fill="#fff"
          fontSize="46"
          fontWeight="600"
          letterSpacing="2"
          style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontVariantNumeric: "tabular-nums" }}
        >
          {clock.time}
        </text>
        <text x="62" y="152" fill="#9aa" fontSize="15" letterSpacing="3" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
          {clock.label}
        </text>
      </g>
      {damaged && (
        <g>
          <rect width="800" height="500" fill="#fff" opacity="0.07" />
          <path d="M-50 500 L400 -50" stroke="#fff" strokeOpacity="0.18" strokeWidth="90" />
          <g stroke="#fff" strokeOpacity="0.35" strokeWidth="1.2" fill="none">
            <path d="M120 80 L300 260 L340 250" />
            <path d="M520 60 L470 180 L610 330" />
            <path d="M200 400 L380 360" />
            <path d="M650 420 L720 280" />
            <path d="M60 300 L180 280 L240 320" />
          </g>
          <g fill="#fff" fillOpacity="0.12">
            <circle cx="300" cy="200" r="22" />
            <circle cx="460" cy="120" r="16" />
            <circle cx="620" cy="380" r="26" />
            <circle cx="160" cy="360" r="14" />
          </g>
        </g>
      )}
    </svg>
  );
}

function CustomPhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-full w-full">
      <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
    </div>
  );
}

export function ClarityCompare({ content }: { content?: ClarityContent }) {
  const beforeLabel = content?.beforeLabel || "Ordinary glass";
  const afterLabel = content?.afterLabel || "HYDRA armor";
  return (
    <section className="container-page py-14 sm:py-20 md:py-24">
      <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div className="min-w-0">
          <SectionHeading
            eyebrow="See the difference"
            title="Clarity you can feel."
            description="Drag the slider. Ordinary glass scatters light, holds fingerprints and scratches in weeks. HYDRA's nano-coated glass stays optically pure."
          />
          <ul className="-mt-2 space-y-3 sm:-mt-4">
            {["Oleophobic nano-coating repels smudges", "Anti-glare optical layer", "Touch sensitivity preserved at 100%", "Bubble-free adhesive, full-edge coverage"].map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-muted">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                  <Check size={12} />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative min-w-0">
          <div aria-hidden className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-accent/20 via-transparent to-white/[0.06] blur-2xl sm:-inset-6 sm:rounded-[2.5rem]" />
          <div className="card-premium relative rounded-[1.25rem] p-1.5 sm:rounded-[2rem] sm:p-2">
            <CompareSlider
              before={
                content?.beforeImage ? (
                  <CustomPhoto src={content.beforeImage} alt={beforeLabel} />
                ) : (
                  <Scene damaged />
                )
              }
              after={content?.afterImage ? <CustomPhoto src={content.afterImage} alt={afterLabel} /> : <Scene />}
              beforeLabel={beforeLabel}
              afterLabel={afterLabel}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

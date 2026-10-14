"use client";

import { ImpactPhone3D } from "@/components/sections/impact-phone-3d";

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

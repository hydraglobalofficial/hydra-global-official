"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";

const VIDEO_SRC = "/brand/hydra-animation.mp4";

const HEAD_LABELS = [
  { label: "Protection", left: "50%", top: "5%" },
  { label: "Precision", left: "27%", top: "17%" },
  { label: "Progression", left: "73%", top: "17%" },
] as const;

/** Brand story — HYDRA mp4 + the three head labels. */
export function HydraRise() {
  return (
    <section className="relative overflow-x-clip py-20 sm:py-24 md:py-28" aria-label="The HYDRA story">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,rgba(30,58,138,0.18),transparent_55%)]" />

      <div className="container-page relative grid w-full items-center gap-10 md:grid-cols-[1fr_1.15fr] md:gap-12">
        <div className="relative order-2 max-w-lg md:order-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">Unleashed</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
            Meet the <span className="text-muted">HYDRA.</span>
          </h2>
          <p className="mt-4 text-sm text-muted sm:text-base">
            {siteConfig.slogan}. Accessories for iPhone and Samsung Galaxy, shipped worldwide.
          </p>
          <Link href="/shop" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-fg transition hover:text-accent">
            Shop accessories <ArrowRight size={16} />
          </Link>
        </div>

        <div className="relative order-1 mx-auto w-[min(100%,22rem)] overflow-visible px-1 pt-11 sm:w-full sm:max-w-[24rem] sm:pt-12 md:order-2 md:max-w-[34rem] md:pt-14">
          <div className="pointer-events-none absolute inset-[10%] rounded-full bg-[#1e3a8a]/20 blur-[80px]" />
          <div className="relative mx-auto w-full">
            <video
              src={VIDEO_SRC}
              className="relative mx-auto h-auto w-full object-contain"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="HYDRA animation"
            />
            {HEAD_LABELS.map(({ label, left, top }) => (
              <div
                key={label}
                className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[110%] text-center"
                style={{ left, top }}
              >
                <p className="whitespace-nowrap rounded-full border border-white/12 bg-black/90 px-2 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-[0.16em] text-zinc-100 shadow-[0_6px_18px_rgba(0,0,0,0.55)] backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[10px] sm:tracking-[0.2em]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

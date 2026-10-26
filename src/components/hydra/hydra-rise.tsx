"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { HydraVideo } from "@/components/hydra/hydra-video";

/** Brand story — the HYDRA film beside the intro copy. */
export function HydraRise() {
  return (
    <section className="hydra-film-block relative overflow-x-clip bg-black py-5 text-white sm:py-6 md:py-7" aria-label="The HYDRA story">
      <div className="container-page relative grid w-full items-center gap-10 md:grid-cols-[1fr_1.15fr] md:gap-12">
        <div className="relative order-2 max-w-lg md:order-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">Unleashed</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl md:text-5xl">
            Meet the <span className="text-white/65">HYDRA.</span>
          </h2>
          <p className="mt-4 text-sm text-white/70 sm:text-base">
            {siteConfig.slogan}. Accessories for iPhone and Samsung Galaxy, shipped worldwide.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-sm font-medium text-white transition hover:border-white"
          >
            Shop accessories <ArrowRight size={16} />
          </Link>
        </div>

        <div className="relative order-1 mx-auto w-full max-w-[34rem] bg-black md:order-2">
          <HydraVideo loop startAt={2} className="aspect-square w-full bg-black object-contain" />
        </div>
      </div>
    </section>
  );
}

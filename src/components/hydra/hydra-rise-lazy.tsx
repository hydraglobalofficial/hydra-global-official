"use client";

import dynamic from "next/dynamic";

/** Heavy crest motion — load after hero paints. */
export const HydraRise = dynamic(
  () => import("@/components/hydra/hydra-rise").then((m) => m.HydraRise),
  { ssr: false, loading: () => <div className="min-h-[22rem] sm:min-h-[26rem]" aria-hidden /> },
);

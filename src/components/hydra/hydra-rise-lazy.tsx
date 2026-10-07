"use client";

import dynamic from "next/dynamic";

/** Brand video block — defer until after critical homepage content. */
export const HydraRise = dynamic(
  () => import("@/components/hydra/hydra-rise").then((m) => m.HydraRise),
  { ssr: false, loading: () => <div className="min-h-[28rem]" aria-hidden /> },
);

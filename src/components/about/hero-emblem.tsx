"use client";

import { HydraVideo } from "@/components/hydra/hydra-video";

/** About hero — the same HYDRA film, looping. */
export function HeroEmblem() {
  return (
    <div className="relative mx-auto w-full max-w-lg overflow-hidden rounded-[1.75rem] bg-black">
      <HydraVideo loop className="aspect-square w-full object-contain" />
    </div>
  );
}

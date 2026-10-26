"use client";

import { HydraVideo } from "@/components/hydra/hydra-video";

/** About hero — the same HYDRA film, looping. */
export function HeroEmblem() {
  return (
    <div className="relative mx-auto w-full max-w-lg overflow-hidden rounded-[1.75rem] bg-black">
      <HydraVideo loop startAt={2} className="aspect-square w-full bg-black object-contain" />
    </div>
  );
}

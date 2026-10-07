"use client";

const VIDEO_SRC = "/brand/hydra-animation.mp4";

/** About hero mark — same simple HYDRA mp4 (no SVG draw-on). */
export function HeroEmblem() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-lg">
      <div className="pointer-events-none absolute inset-[12%] rounded-full bg-accent/12 blur-[70px]" />
      <video
        src={VIDEO_SRC}
        className="relative h-full w-full object-contain"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="HYDRA"
      />
    </div>
  );
}

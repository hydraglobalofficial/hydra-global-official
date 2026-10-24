"use client";

export const HYDRA_VIDEO_SRC = "/brand/hydra-video.mp4";

export function HydraVideo({
  className,
  loop = false,
  onEnded,
}: {
  className?: string;
  loop?: boolean;
  onEnded?: () => void;
}) {
  return (
    <video
      className={className}
      src={HYDRA_VIDEO_SRC}
      autoPlay
      muted
      playsInline
      loop={loop}
      preload="auto"
      onEnded={onEnded}
    />
  );
}

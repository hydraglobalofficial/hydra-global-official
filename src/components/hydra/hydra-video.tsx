"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const HYDRA_VIDEO_SRC = "/brand/hydra-video.mp4";

export function HydraVideo({
  className,
  loop = false,
  onEnded,
  startAt = 0,
}: {
  className?: string;
  loop?: boolean;
  onEnded?: () => void;
  /** Skip a baked-in opening plate and begin on this timestamp (seconds). */
  startAt?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(startAt <= 0);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const play = () => {
      void video.play().catch(() => {});
    };

    const jump = () => {
      if (startAt > 0 && video.currentTime < startAt) video.currentTime = startAt;
      play();
    };
    const onSeeked = () => {
      setArmed(true);
      play();
    };
    const onTime = () => {
      if (startAt > 0 && video.currentTime + 0.05 < startAt) video.currentTime = startAt;
    };
    const onEnd = () => {
      if (startAt > 0) {
        video.currentTime = startAt;
        play();
      }
      onEnded?.();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) play();
      },
      { threshold: 0.15 },
    );
    io.observe(video);

    video.addEventListener("loadedmetadata", jump);
    video.addEventListener("canplay", play);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("ended", onEnd);
    jump();
    const reveal = window.setTimeout(() => setArmed(true), 400);
    const kick = window.setTimeout(play, 80);

    return () => {
      window.clearTimeout(reveal);
      window.clearTimeout(kick);
      io.disconnect();
      video.removeEventListener("loadedmetadata", jump);
      video.removeEventListener("canplay", play);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("ended", onEnd);
    };
  }, [onEnded, startAt]);

  return (
    <video
      ref={ref}
      className={cn(className, startAt > 0 && !armed && "opacity-0")}
      src={HYDRA_VIDEO_SRC}
      autoPlay
      muted
      playsInline
      loop={startAt > 0 ? false : loop}
      preload="auto"
      onEnded={startAt > 0 ? undefined : onEnded}
    />
  );
}

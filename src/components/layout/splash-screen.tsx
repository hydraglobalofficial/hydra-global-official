"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const SEEN_KEY = "hydra-splash-seen";
const VIDEO_SRC = "/brand/hydra-animation.mp4";
/** Hard cap so splash never feels slow even if the file is longer. */
const MAX_MS = 900;
const EXIT_MS = 220;
/** Speed up playback — “super fast” intro. */
const PLAYBACK_RATE = 1.75;

type Phase = "play" | "exit" | "done";

/**
 * Fast page-load intro: plays the HYDRA animation MP4, then fades into the site.
 */
export function SplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>("play");
  const videoRef = useRef<HTMLVideoElement>(null);
  const finished = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (reduced || sessionStorage.getItem(SEEN_KEY) === "1") {
      setPhase("done");
      return;
    }
    document.documentElement.dataset.splash = "playing";
  }, [mounted, reduced]);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    setPhase("exit");
  };

  useEffect(() => {
    if (!mounted || phase !== "play" || reduced) return;

    const video = videoRef.current;
    if (video) {
      video.playbackRate = PLAYBACK_RATE;
      video.muted = true;
      void video.play().catch(() => {
        /* autoplay blocked — still exit on timeout */
      });
    }

    const cap = window.setTimeout(finish, MAX_MS);
    return () => window.clearTimeout(cap);
  }, [mounted, phase, reduced]);

  useEffect(() => {
    if (phase !== "exit") return;
    const done = window.setTimeout(() => {
      sessionStorage.setItem(SEEN_KEY, "1");
      document.documentElement.dataset.splash = "seen";
      setPhase("done");
    }, EXIT_MS);
    return () => window.clearTimeout(done);
  }, [phase]);

  if (!mounted || phase === "done") return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-black transition-opacity duration-200 ease-out",
        phase === "exit" && "pointer-events-none opacity-0",
      )}
      onClick={finish}
      role="presentation"
      aria-hidden
    >
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        className="h-full w-full max-h-[min(100dvh,40rem)] max-w-[min(100vw,40rem)] object-contain"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={finish}
        onError={finish}
      />
    </div>
  );
}

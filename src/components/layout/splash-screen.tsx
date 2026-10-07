"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const SEEN_KEY = "hydra-splash-seen";
const VIDEO_SRC = "/brand/hydra-animation.mp4";

/**
 * Simple welcome: black screen + your HYDRA mp4, then enter the site.
 * No loading bars, no creature morph — just the video you provided.
 */
export function SplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const done = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (reduced || sessionStorage.getItem(SEEN_KEY) === "1") {
      setShow(false);
      return;
    }
    document.documentElement.dataset.splash = "playing";
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.playbackRate = 1;
    void video.play().catch(() => close());
  }, [mounted, reduced]);

  function close() {
    if (done.current) return;
    done.current = true;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    document.documentElement.dataset.splash = "seen";
    setShow(false);
  }

  if (!mounted || !show) return null;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black"
      onClick={close}
      role="presentation"
      aria-hidden
    >
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        className="h-auto w-auto max-h-full max-w-full object-contain"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={close}
        onError={close}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Fixed scroll-up control — sits left of the WhatsApp float.
 * All geometry is inline: Tailwind arbitrary position/size can compile to 0
 * and leave the control stuck at the viewport origin.
 */
export function ScrollTopButton() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  if (!ready) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="touch-target z-40 grid place-items-center rounded-full border border-white/35 bg-zinc-900 text-white shadow-[0_10px_28px_rgba(0,0,0,0.55)] transition hover:border-accent/60 hover:bg-accent hover:text-black"
      style={{
        position: "fixed",
        top: "auto",
        left: "auto",
        width: 48,
        height: 48,
        bottom: 28,
        // Clear the ~120px WhatsApp staff float + gap
        right: 148,
        zIndex: 40,
        color: "#fff",
      }}
      aria-label="Scroll to top"
    >
      <ArrowUp size={22} strokeWidth={2.5} className="shrink-0" aria-hidden />
    </button>
  );
}

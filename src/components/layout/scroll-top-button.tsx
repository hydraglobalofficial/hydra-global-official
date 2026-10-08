"use client";

import { useEffect, useState } from "react";

/** Scroll-up — left of WhatsApp float. Inline geometry only (Tailwind arbitrary can compile to 0). */
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
      aria-label="Scroll to top"
      style={{
        position: "fixed",
        top: "auto",
        left: "auto",
        right: 148,
        bottom: 28,
        zIndex: 50,
        width: 48,
        height: 48,
        display: "grid",
        placeItems: "center",
        borderRadius: 9999,
        border: "1.5px solid rgba(255,255,255,0.4)",
        background: "#18181b",
        color: "#ffffff",
        boxShadow: "0 10px 28px rgba(0,0,0,0.55)",
        cursor: "pointer",
        padding: 0,
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        style={{ display: "block", flexShrink: 0 }}
      >
        <path
          d="M12 19V5M5 12l7-7 7 7"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

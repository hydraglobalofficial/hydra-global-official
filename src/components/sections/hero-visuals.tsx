"use client";

import { motion } from "motion/react";

/** Angled flagship with a tempered-glass sheet hovering above it. Pure SVG + motion. */
export function GlassLiftVisual() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[30rem]">
      <div className="absolute inset-x-12 bottom-6 h-12 rounded-[50%] bg-accent/20 blur-3xl" />

      <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="gl-frame" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4a4a56" />
            <stop offset="0.5" stopColor="#15151b" />
            <stop offset="1" stopColor="#34343e" />
          </linearGradient>
          <linearGradient id="gl-wall" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0b3a4a" />
            <stop offset="0.45" stopColor="#0c1824" />
            <stop offset="1" stopColor="#10141c" />
          </linearGradient>
          <radialGradient id="gl-orb" cx="0.3" cy="0.75" r="0.6">
            <stop offset="0" stopColor="#38bdf8" stopOpacity="0.55" />
            <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g transform="translate(200 260) rotate(14) translate(-95 -200)">
          <rect width="190" height="400" rx="38" fill="url(#gl-frame)" />
          <rect x="7" y="7" width="176" height="386" rx="32" fill="url(#gl-wall)" />
          <rect x="7" y="7" width="176" height="386" rx="32" fill="url(#gl-orb)" />
          <path d="M7 300 C 60 250, 120 330, 183 270 L183 361 Q183 393 151 393 L39 393 Q7 393 7 361 Z" fill="#ffffff" fillOpacity="0.06" />
          <path d="M7 330 C 70 290, 110 360, 183 320 L183 361 Q183 393 151 393 L39 393 Q7 393 7 361 Z" fill="#38bdf8" fillOpacity="0.18" />
          <rect x="68" y="20" width="54" height="16" rx="8" fill="#000" />
          <text x="95" y="74" textAnchor="middle" fill="#fff" fillOpacity="0.6" fontSize="10" letterSpacing="2">MONDAY · DHAKA</text>
          <text x="95" y="140" textAnchor="middle" fill="#fff" fontSize="64" fontWeight="600" fontFamily="ui-monospace, monospace" letterSpacing="-2">
            09:41
          </text>
        </g>
      </svg>

      <motion.div
        className="absolute inset-0"
        animate={{ y: [-26, -44, -26], rotate: [0, -1.2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 400 500" className="h-full w-full" aria-hidden>
          <defs>
            <linearGradient id="gl-glass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.32" />
              <stop offset="0.35" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="0.7" stopColor="#38bdf8" stopOpacity="0.1" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0.14" />
            </linearGradient>
            <linearGradient id="gl-edge" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#38bdf8" />
              <stop offset="1" stopColor="#e4e4e7" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <g transform="translate(222 222) rotate(8) translate(-95 -200)" style={{ mixBlendMode: "screen" }}>
            <rect width="190" height="400" rx="36" fill="url(#gl-glass)" stroke="url(#gl-edge)" strokeWidth="1.4" />
            <path d="M20 26 L78 26 L20 170 Z" fill="#fff" fillOpacity="0.1" />
            <rect x="68" y="14" width="54" height="16" rx="8" fill="none" stroke="#38bdf8" strokeOpacity="0.7" />
          </g>
        </svg>
      </motion.div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:radial-gradient(closest-side,#000,transparent)]">
        <motion.div
          className="absolute -inset-y-10 w-24 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          animate={{ x: ["-30%", "520%"] }}
          transition={{ duration: 3.6, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

/** Phone with a privacy louver that blacks out as the viewing angle sweeps. */
export function PrivacyVisual() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[30rem]">
      <div className="absolute inset-x-12 bottom-6 h-12 rounded-[50%] bg-accent/15 blur-3xl" />

      <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="pr-frame" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3a3a44" />
            <stop offset="0.5" stopColor="#141419" />
            <stop offset="1" stopColor="#2c2c34" />
          </linearGradient>
          <linearGradient id="pr-cone" x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0" stopColor="#38bdf8" stopOpacity="0.28" />
            <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
          <clipPath id="pr-screen">
            <rect x="112" y="57" width="176" height="386" rx="32" />
          </clipPath>
        </defs>

        <path d="M200 470 L90 20 L310 20 Z" fill="url(#pr-cone)" />
        <g stroke="#ff5c7a" strokeOpacity="0.5" strokeDasharray="4 6">
          <path d="M200 470 L20 150" />
          <path d="M200 470 L380 150" />
        </g>
        <text x="40" y="140" fill="#ff5c7a" fillOpacity="0.8" fontSize="11" fontFamily="ui-monospace, monospace" letterSpacing="2">
          BLOCKED
        </text>
        <text x="306" y="140" fill="#ff5c7a" fillOpacity="0.8" fontSize="11" fontFamily="ui-monospace, monospace" letterSpacing="2">
          BLOCKED
        </text>

        <rect x="105" y="50" width="190" height="400" rx="38" fill="url(#pr-frame)" />
        <g clipPath="url(#pr-screen)">
          <rect x="112" y="57" width="176" height="386" fill="#0a0f16" />
          <g fill="#ffffff">
            <rect x="130" y="110" width="90" height="10" rx="5" fillOpacity="0.8" />
            <rect x="130" y="130" width="130" height="6" rx="3" fillOpacity="0.25" />
            <rect x="130" y="176" width="140" height="64" rx="14" fill="#38bdf8" fillOpacity="0.14" />
            <text x="146" y="206" fill="#38bdf8" fontSize="11" letterSpacing="1.5">BALANCE</text>
            <text x="146" y="228" fill="#fff" fontSize="16" fontWeight="600" fontFamily="ui-monospace, monospace">৳ 84,250</text>
            {[262, 290, 318, 346].map((y) => (
              <g key={y}>
                <circle cx="142" cy={y + 6} r="8" fillOpacity="0.12" />
                <rect x="158" y={y} width="70" height="6" rx="3" fillOpacity="0.4" />
                <rect x="158" y={y + 9} width="44" height="4" rx="2" fillOpacity="0.15" />
              </g>
            ))}
          </g>
        </g>
        <rect x="173" y="70" width="54" height="16" rx="8" fill="#000" />
      </svg>

      <div className="pointer-events-none absolute inset-y-[10%] left-[28%] right-[28%] overflow-hidden rounded-[2.1rem]">
        <motion.div
          className="absolute inset-0 bg-black"
          animate={{ opacity: [0, 0, 0.94, 0.94, 0] }}
          transition={{ duration: 6, repeat: Infinity, times: [0, 0.35, 0.5, 0.85, 1], ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0_3px,rgba(0,0,0,0.35)_3px_4px)]" />
      </div>
    </div>
  );
}

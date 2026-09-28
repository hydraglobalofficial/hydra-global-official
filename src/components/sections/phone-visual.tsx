/** Stylized flagship phone with a floating glass layer and scan line. Pure SVG + CSS. */
export function PhoneVisual() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[30rem]">
      <div className="absolute inset-x-10 bottom-4 h-12 rounded-[50%] bg-accent/30 blur-3xl" />

      <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="pv-frame" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3a3a44" />
            <stop offset="0.5" stopColor="#15151a" />
            <stop offset="1" stopColor="#2c2c34" />
          </linearGradient>
          <linearGradient id="pv-screen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#051a22" />
            <stop offset="0.55" stopColor="#07070d" />
            <stop offset="1" stopColor="#150b2e" />
          </linearGradient>
          <linearGradient id="pv-glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="0.35" stopColor="#ffffff" stopOpacity="0.04" />
            <stop offset="0.7" stopColor="#3de3ff" stopOpacity="0.08" />
            <stop offset="1" stopColor="#7b61ff" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="pv-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3de3ff" />
            <stop offset="1" stopColor="#7b61ff" />
          </linearGradient>
          <radialGradient id="pv-orb" cx="0.5" cy="0.45" r="0.5">
            <stop offset="0" stopColor="#3de3ff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#3de3ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Phone body */}
        <g transform="translate(95 40)">
          <rect width="190" height="400" rx="38" fill="url(#pv-frame)" />
          <rect x="7" y="7" width="176" height="386" rx="32" fill="url(#pv-screen)" />
          <rect x="68" y="20" width="54" height="16" rx="8" fill="#000" />
          <circle cx="95" cy="170" r="70" fill="url(#pv-orb)" />
          <g fill="none" stroke="#3de3ff" strokeOpacity="0.5">
            <circle cx="95" cy="170" r="34" />
            <circle cx="95" cy="170" r="52" strokeOpacity="0.25" />
          </g>
          <path d="M83 170l8 8 16-18" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text x="95" y="270" textAnchor="middle" fill="#fff" fontSize="15" fontWeight="600" letterSpacing="5">HYDRA</text>
          <text x="95" y="290" textAnchor="middle" fill="#8b8b96" fontSize="9" letterSpacing="2">ARMOR ACTIVE</text>
          <rect x="30" y="320" width="130" height="4" rx="2" fill="#ffffff" fillOpacity="0.08" />
          <rect x="30" y="320" width="96" height="4" rx="2" fill="url(#pv-edge)" />
        </g>

        {/* Floating tempered glass layer */}
        <g transform="translate(120 20) rotate(-7 95 200)" style={{ mixBlendMode: "screen" }}>
          <rect width="190" height="400" rx="36" fill="url(#pv-glass)" stroke="url(#pv-edge)" strokeOpacity="0.8" strokeWidth="1.2" />
          <path d="M22 30 L70 30 L20 150 Z" fill="#fff" fillOpacity="0.07" />
        </g>
      </svg>

      <div className="pointer-events-none absolute inset-x-[24%] inset-y-[8%] overflow-hidden rounded-[2.2rem]">
        <div className="h-1/3 w-full bg-gradient-to-b from-transparent via-accent/25 to-transparent animate-scan" />
      </div>
    </div>
  );
}

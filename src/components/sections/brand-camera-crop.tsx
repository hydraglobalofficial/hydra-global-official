"use client";

import { cn } from "@/lib/utils";

type Family = "iphone" | "samsung" | "pixel" | "generic";

function familyFromSlug(slug: string, code?: string): Family {
  const s = `${slug} ${code ?? ""}`.toLowerCase();
  if (s.includes("iphone") || s.includes("apple")) return "iphone";
  if (s.includes("samsung") || s.includes("galaxy")) return "samsung";
  if (s.includes("pixel") || s.includes("google")) return "pixel";
  return "generic";
}

function Lens({ cx, cy, r, glass }: { cx: number; cy: number; r: number; glass: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 2.4} fill="#1a1a22" />
      <circle cx={cx} cy={cy} r={r} fill={glass} stroke="rgba(255,255,255,0.22)" strokeWidth="0.7" />
      <circle cx={cx - r * 0.28} cy={cy - r * 0.28} r={r * 0.22} fill="rgba(255,255,255,0.4)" />
      <circle cx={cx} cy={cy} r={r * 0.3} fill="#050508" opacity="0.9" />
    </g>
  );
}

/** Square camera-island crop — Spigen / Apple “Shop by Device” style. */
export function BrandCameraCrop({
  slug,
  code,
  className,
}: {
  slug: string;
  code?: string;
  className?: string;
}) {
  const family = familyFromSlug(slug, code);
  const uid = `crop-${slug.replace(/[^a-z0-9]/gi, "") || "brand"}`;
  const lens = `url(#lens-${uid})`;

  return (
    <div className={cn("relative aspect-square w-full overflow-hidden rounded-2xl sm:rounded-[1.35rem]", className)} aria-hidden>
      <svg viewBox="0 0 160 160" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`lens-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1e3a5f" />
            <stop offset="0.55" stopColor="#0b1220" />
            <stop offset="1" stopColor="#243b55" />
          </linearGradient>
          <linearGradient id={`body-iphone-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6b4a5c" />
            <stop offset="0.4" stopColor="#4a3344" />
            <stop offset="1" stopColor="#2a1c28" />
          </linearGradient>
          <linearGradient id={`island-iphone-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3a3038" />
            <stop offset="1" stopColor="#161218" />
          </linearGradient>
          <linearGradient id={`body-samsung-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#c4b8d4" />
            <stop offset="0.4" stopColor="#9a8bb0" />
            <stop offset="1" stopColor="#6b5f80" />
          </linearGradient>
          <radialGradient id={`island-samsung-${uid}`} cx="45%" cy="40%" r="70%">
            <stop offset="0" stopColor="#3a3448" />
            <stop offset="1" stopColor="#14121a" />
          </radialGradient>
          <linearGradient id={`body-pixel-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7eb8e8" />
            <stop offset="0.5" stopColor="#4a90c8" />
            <stop offset="1" stopColor="#2a6498" />
          </linearGradient>
          <linearGradient id={`island-pixel-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#1a1f28" />
            <stop offset="1" stopColor="#0a0c10" />
          </linearGradient>
          <linearGradient id={`body-generic-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#475569" />
            <stop offset="1" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id={`island-generic-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1e293b" />
            <stop offset="1" stopColor="#020617" />
          </linearGradient>
          <linearGradient id={`shine-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {family === "iphone" && (
          <g>
            <rect width="160" height="160" fill={`url(#body-iphone-${uid})`} />
            <ellipse cx="40" cy="50" rx="70" ry="90" fill={`url(#shine-${uid})`} />
            <rect x="18" y="22" width="98" height="98" rx="24" fill={`url(#island-iphone-${uid})`} stroke="rgba(255,255,255,0.14)" />
            <rect x="22" y="26" width="90" height="90" rx="20" fill="#0a080c" opacity="0.5" />
            <Lens cx={48} cy={52} r={15} glass={lens} />
            <Lens cx={96} cy={52} r={15} glass={lens} />
            <Lens cx={48} cy={100} r={15} glass={lens} />
            <circle cx={96} cy={100} r={9} fill="#1a1a22" stroke="rgba(255,255,255,0.18)" />
            <circle cx={96} cy={100} r={4.5} fill="#f5c542" opacity="0.95" />
          </g>
        )}

        {family === "samsung" && (
          <g>
            <rect width="160" height="160" fill={`url(#body-samsung-${uid})`} />
            <ellipse cx="36" cy="48" rx="60" ry="80" fill={`url(#shine-${uid})`} opacity="0.55" />
            <circle cx="78" cy="78" r="58" fill={`url(#island-samsung-${uid})`} stroke="rgba(255,255,255,0.16)" strokeWidth="1.2" />
            <circle cx="78" cy="78" r="50" fill="#0c0a12" opacity="0.4" />
            <Lens cx={62} cy={60} r={13.5} glass={lens} />
            <Lens cx={94} cy={60} r={13.5} glass={lens} />
            <Lens cx={62} cy={94} r={12} glass={lens} />
            <Lens cx={94} cy={94} r={12} glass={lens} />
            <circle cx={78} cy={77} r={6} fill="#1a2030" stroke="rgba(160,190,255,0.45)" />
          </g>
        )}

        {family === "pixel" && (
          <g>
            <rect width="160" height="160" fill={`url(#body-pixel-${uid})`} />
            <ellipse cx="40" cy="40" rx="70" ry="80" fill={`url(#shine-${uid})`} />
            <rect x="12" y="48" width="136" height="52" rx="26" fill={`url(#island-pixel-${uid})`} stroke="rgba(255,255,255,0.14)" />
            <Lens cx={48} cy={74} r={15} glass={lens} />
            <Lens cx={88} cy={74} r={12} glass={lens} />
            <circle cx={124} cy={74} r={7} fill="#f0c14a" opacity="0.95" />
          </g>
        )}

        {family === "generic" && (
          <g>
            <rect width="160" height="160" fill={`url(#body-generic-${uid})`} />
            <ellipse cx="40" cy="48" rx="70" ry="90" fill={`url(#shine-${uid})`} />
            <rect x="24" y="36" width="112" height="72" rx="22" fill={`url(#island-generic-${uid})`} stroke="rgba(255,255,255,0.14)" />
            <Lens cx={58} cy={72} r={15} glass={lens} />
            <Lens cx={102} cy={72} r={15} glass={lens} />
          </g>
        )}
      </svg>
    </div>
  );
}

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

function CameraLens({
  cx,
  cy,
  r,
  glass,
}: {
  cx: number;
  cy: number;
  r: number;
  glass: string;
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 2.2} fill="#2a2a32" />
      <circle cx={cx} cy={cy} r={r} fill={glass} stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
      <circle cx={cx - r * 0.28} cy={cy - r * 0.28} r={r * 0.22} fill="rgba(255,255,255,0.35)" />
      <circle cx={cx} cy={cy} r={r * 0.28} fill="#0a0a10" opacity="0.85" />
    </g>
  );
}

/** Trending-flagship phone backside — brand-specific camera island, glass + metal. */
export function BrandPhoneBack({
  slug,
  code,
  className,
}: {
  slug: string;
  code?: string;
  className?: string;
}) {
  const family = familyFromSlug(slug, code);
  const uid = slug.replace(/[^a-z0-9]/gi, "") || "brand";
  const edge = `url(#edge-metal-${uid})`;
  const lens = `url(#lens-glass-${uid})`;
  const shine = `url(#shine-${uid})`;
  const ghost = `url(#ghost-fill-${uid})`;
  const rxGhost = family === "samsung" ? 16 : family === "iphone" ? 26 : 22;

  return (
    <div className={cn("relative aspect-[3/4] w-full select-none", className)} aria-hidden>
      <div className="pointer-events-none absolute inset-x-[12%] bottom-[0%] h-9 rounded-[100%] bg-black/30 blur-2xl light:bg-black/12" />

      <svg viewBox="0 0 200 300" className="relative h-full w-full">
        <defs>
          <linearGradient id={`edge-metal-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#9aa0ad" />
            <stop offset="0.45" stopColor="#e8eaef" />
            <stop offset="1" stopColor="#6b7280" />
          </linearGradient>
          <linearGradient id={`lens-glass-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1e3a5f" />
            <stop offset="0.55" stopColor="#0b1220" />
            <stop offset="1" stopColor="#243b55" />
          </linearGradient>
          <linearGradient id={`ghost-fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a1a22" />
            <stop offset="1" stopColor="#0c0c10" />
          </linearGradient>
          <linearGradient id={`shine-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.24" />
            <stop offset="0.4" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.07" />
          </linearGradient>

          <linearGradient id={`body-iphone-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a8adb8" />
            <stop offset="0.4" stopColor="#6b7280" />
            <stop offset="1" stopColor="#3f4552" />
          </linearGradient>
          <linearGradient id={`glass-iphone-${uid}`} x1="0.1" y1="0" x2="0.95" y2="1">
            <stop offset="0" stopColor="#8b919c" />
            <stop offset="0.3" stopColor="#4b5160" />
            <stop offset="0.7" stopColor="#2a2f3a" />
            <stop offset="1" stopColor="#1a1e28" />
          </linearGradient>
          <linearGradient id={`island-iphone-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6a7080" />
            <stop offset="1" stopColor="#2a303c" />
          </linearGradient>

          <linearGradient id={`body-samsung-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7a8aa0" />
            <stop offset="0.45" stopColor="#3d4f66" />
            <stop offset="1" stopColor="#1e2a3c" />
          </linearGradient>
          <linearGradient id={`glass-samsung-${uid}`} x1="0.1" y1="0" x2="0.9" y2="1">
            <stop offset="0" stopColor="#5a6d86" />
            <stop offset="0.4" stopColor="#2a3a50" />
            <stop offset="1" stopColor="#121c2a" />
          </linearGradient>
          <radialGradient id={`island-samsung-${uid}`} cx="42%" cy="38%" r="72%">
            <stop offset="0" stopColor="#4a5e78" />
            <stop offset="1" stopColor="#152030" />
          </radialGradient>

          <linearGradient id={`body-pixel-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4a5568" />
            <stop offset="1" stopColor="#1a202c" />
          </linearGradient>
          <linearGradient id={`glass-pixel-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2d3748" />
            <stop offset="1" stopColor="#0f141c" />
          </linearGradient>
          <linearGradient id={`island-pixel-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#1a1f2a" />
            <stop offset="1" stopColor="#0c1018" />
          </linearGradient>

          <linearGradient id={`body-generic-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#334155" />
            <stop offset="1" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id={`glass-generic-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1e293b" />
            <stop offset="1" stopColor="#020617" />
          </linearGradient>
          <linearGradient id={`island-generic-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1e293b" />
            <stop offset="1" stopColor="#0b1220" />
          </linearGradient>
        </defs>

        {/* Ghost phone behind — subtle depth only */}
        <g transform="translate(18 -4) rotate(7 100 150)" opacity="0.18">
          <rect x="48" y="28" width="110" height="236" rx={rxGhost} fill="#64748b" />
        </g>

        <g transform="translate(0 6)">
          {family === "iphone" && (
            <g>
              <rect x="38" y="18" width="124" height="264" rx="28" fill={`url(#body-iphone-${uid})`} stroke={edge} strokeWidth="1.4" />
              <rect x="42" y="22" width="116" height="256" rx="24" fill={`url(#glass-iphone-${uid})`} />
              <ellipse cx="78" cy="110" rx="42" ry="70" fill={shine} opacity="0.55" />
              <rect x="52" y="36" width="72" height="72" rx="18" fill={`url(#island-iphone-${uid})`} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              <rect x="54" y="38" width="68" height="68" rx="16" fill="#0c0c10" opacity="0.45" />
              <CameraLens cx={70} cy={54} r={11} glass={lens} />
              <CameraLens cx={106} cy={54} r={11} glass={lens} />
              <CameraLens cx={70} cy={90} r={11} glass={lens} />
              <circle cx={106} cy={90} r={6.5} fill="#1a1a22" stroke="rgba(255,255,255,0.15)" />
              <circle cx={106} cy={90} r={3.2} fill="#f5c542" opacity="0.9" />
              <path
                d="M92 168c4.5-5.5 3.4-13.2-1.2-16.9-3.9 2.4-6.3 6.7-5.9 11.6 4.6.4 5.9 3.2 7.1 5.3zm6.4 3c-3.8-2.2-8.8-2-12.2 1.5-4.9 5.2-3.9 14.3 1.5 19.8 2.7 2.7 5.9 5.9 10.1 5.7 4-.1 5.5-2.5 10.2-2.5s6 2.5 10.2 2.5c4.2-.1 6.9-2.8 9.5-5.6 10.6-11.6 8.8-26.4 3.7-32.8-5.1-6.4-13.3-6.6-16.5-3.4-3 3-6.9 3.3-9.3 1.8-2.2-1.4-5.1-2.7-7.2 0z"
                fill="rgba(255,255,255,0.12)"
              />
              <rect x="33.5" y="88" width="3" height="28" rx="1.5" fill={edge} />
              <rect x="162.5" y="72" width="3" height="18" rx="1.5" fill={edge} />
              <rect x="162.5" y="98" width="3" height="36" rx="1.5" fill={edge} />
            </g>
          )}

          {family === "samsung" && (
            <g>
              {/* S25 Ultra-style: boxy frame + vertical camera stack */}
              <rect x="38" y="18" width="124" height="264" rx="14" fill={`url(#body-samsung-${uid})`} stroke={edge} strokeWidth="1.4" />
              <rect x="42" y="22" width="116" height="256" rx="10" fill={`url(#glass-samsung-${uid})`} />
              <ellipse cx="78" cy="120" rx="40" ry="72" fill={shine} opacity="0.4" />
              <CameraLens cx={64} cy={48} r={12} glass={lens} />
              <CameraLens cx={64} cy={78} r={12} glass={lens} />
              <CameraLens cx={64} cy={108} r={12} glass={lens} />
              <circle cx={88} cy={48} r={7} fill="#1a2030" stroke="rgba(255,255,255,0.16)" strokeWidth="0.8" />
              <circle cx={88} cy={78} r={5.5} fill="#f5f0e6" opacity="0.92" />
              <text x="100" y="196" textAnchor="middle" fill="rgba(255,255,255,0.16)" fontSize="8" fontWeight="600" letterSpacing="2.8">
                SAMSUNG
              </text>
              <rect x="33.5" y="92" width="3" height="42" rx="1.2" fill={edge} />
              <rect x="162.5" y="78" width="3" height="22" rx="1.2" fill={edge} />
              <rect x="162.5" y="108" width="3" height="34" rx="1.2" fill={edge} />
            </g>
          )}

          {family === "pixel" && (
            <g>
              <rect x="38" y="18" width="124" height="264" rx="26" fill={`url(#body-pixel-${uid})`} stroke={edge} strokeWidth="1.4" />
              <rect x="42" y="22" width="116" height="256" rx="22" fill={`url(#glass-pixel-${uid})`} />
              <ellipse cx="80" cy="118" rx="38" ry="68" fill={shine} opacity="0.5" />
              <rect x="48" y="40" width="104" height="38" rx="19" fill={`url(#island-pixel-${uid})`} stroke="rgba(255,255,255,0.12)" />
              <CameraLens cx={70} cy={59} r={11} glass={lens} />
              <CameraLens cx={100} cy={59} r={9} glass={lens} />
              <circle cx={128} cy={59} r={5} fill="#f0c14a" opacity="0.9" />
              <text x="100" y="178" textAnchor="middle" fill="rgba(255,255,255,0.16)" fontSize="12" fontWeight="500">
                G
              </text>
            </g>
          )}

          {family === "generic" && (
            <g>
              <rect x="38" y="18" width="124" height="264" rx="24" fill={`url(#body-generic-${uid})`} stroke={edge} strokeWidth="1.4" />
              <rect x="42" y="22" width="116" height="256" rx="20" fill={`url(#glass-generic-${uid})`} />
              <ellipse cx="78" cy="118" rx="40" ry="70" fill={shine} opacity="0.45" />
              <rect x="56" y="40" width="88" height="52" rx="16" fill={`url(#island-generic-${uid})`} stroke="rgba(255,255,255,0.12)" />
              <CameraLens cx={78} cy={66} r={11} glass={lens} />
              <CameraLens cx={110} cy={66} r={11} glass={lens} />
              <circle cx={94} cy={66} r={4} fill="#e8e8ec" opacity="0.3" />
              <text x="100" y="178" textAnchor="middle" fill="rgba(255,255,255,0.12)" fontSize="9" fontWeight="600" letterSpacing="3.5">
                HYDRA
              </text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}

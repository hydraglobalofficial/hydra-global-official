"use client";

import { Clock, MapPin, Navigation } from "lucide-react";
import { motion } from "motion/react";
import { SocialLinks } from "@/components/ui/social-links";
import { siteConfig } from "@/config/site";
import { useBusinessStatus } from "./live-status";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEK = [6, 0, 1, 2, 3, 4, 5];

/** Stylised Gulshan map: roads, lake and a pulsing HQ pin. Pure SVG. */
function OfficeMap() {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-[#05070b]">
      <svg viewBox="0 0 320 200" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id="om-dots" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.7" fill="#fff" fillOpacity="0.08" />
          </pattern>
          <linearGradient id="om-route" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="0.5" stopColor="#38bdf8" />
            <stop offset="1" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <rect width="320" height="200" fill="url(#om-dots)" />
        <path d="M40 150 C 70 120, 60 90, 95 70 S 150 60, 160 30 L 175 32 C 168 70, 120 80, 108 100 S 90 150, 60 165 Z" fill="#38bdf8" fillOpacity="0.08" stroke="#38bdf8" strokeOpacity="0.25" />
        <g stroke="#fff" strokeOpacity="0.1" strokeWidth="6" fill="none" strokeLinecap="round">
          <path d="M0 110 L320 95" />
          <path d="M200 0 L215 200" />
          <path d="M0 40 C 120 60, 200 40, 320 60" />
        </g>
        <g stroke="#fff" strokeOpacity="0.06" strokeWidth="2" fill="none">
          <path d="M120 0 L140 200" />
          <path d="M260 0 L250 200" />
          <path d="M0 170 L320 150" />
          <path d="M150 120 L320 130" />
        </g>
        <motion.path
          d="M20 185 C 90 170, 120 130, 180 118 S 205 104, 213 100"
          stroke="url(#om-route)"
          strokeWidth="2.5"
          fill="none"
          strokeDasharray="4 6"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <text x="30" y="128" fill="#38bdf8" fillOpacity="0.5" fontSize="7" letterSpacing="2" fontFamily="ui-monospace, monospace">GULSHAN LAKE</text>
        <text x="238" y="112" fill="#fff" fillOpacity="0.35" fontSize="6.5" letterSpacing="1.5" fontFamily="ui-monospace, monospace">GULSHAN AVE</text>
      </svg>

      <div className="absolute left-[66.5%] top-[50%] -translate-x-1/2 -translate-y-full">
        <span className="absolute left-1/2 top-full size-10 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-accent/30" />
        <div className="relative flex flex-col items-center">
          <span className="whitespace-nowrap rounded-full border border-accent/40 bg-black/80 px-2.5 py-1 font-mono text-[10px] tracking-wider text-accent backdrop-blur">HYDRA HQ</span>
          <span className="mt-1 grid size-7 place-items-center rounded-full bg-accent text-black shadow-[0_0_24px_rgba(56,189,248,0.8)]">
            <MapPin size={14} />
          </span>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    </div>
  );
}

export function OfficeCard() {
  const status = useBusinessStatus();
  const today = status?.day ?? null;
  const { open, close } = siteConfig.businessHours;
  const days: readonly number[] = siteConfig.businessHours.days;

  return (
    <div className="card-premium space-y-6 rounded-[2rem] p-5 md:p-6">
      <OfficeMap />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-subtle">Head office</p>
          <p className="mt-2 text-sm leading-relaxed">{siteConfig.address}</p>
        </div>
        <a
          href={siteConfig.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-2 text-xs transition-colors hover:border-accent/50 hover:text-accent"
        >
          <Navigation size={12} /> Directions
        </a>
      </div>

      <div>
        <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-subtle">
          <Clock size={12} /> Support hours · Dhaka
        </p>
        <ul className="grid grid-cols-7 gap-1.5">
          {WEEK.map((d) => {
            const working = days.includes(d);
            const isToday = d === today;
            return (
              <li
                key={d}
                className={`rounded-lg border py-2 text-center text-[11px] ${
                  isToday ? "border-accent/50 bg-accent/10 text-fg" : working ? "border-line text-muted" : "border-transparent text-subtle line-through"
                }`}
              >
                {DAYS[d]}
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs text-muted">
          {String(open).padStart(2, "0")}:00 – {close}:00
          {WEEK.some((d) => !days.includes(d)) && ` · ${WEEK.filter((d) => !days.includes(d)).map((d) => DAYS[d]).join(", ")} closed`}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-line pt-5">
        <p className="text-xs text-muted">Follow the lab</p>
        <SocialLinks itemClassName="size-9 rounded-xl" />
      </div>
    </div>
  );
}

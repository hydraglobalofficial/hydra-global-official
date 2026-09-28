import { Check } from "lucide-react";
import { SectionHeading } from "@/components/ui/primitives";
import { CompareSlider } from "./compare-slider";

function Scene({ damaged }: { damaged?: boolean }) {
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`sky-${damaged ? "d" : "c"}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#031c26" />
          <stop offset="0.5" stopColor="#0a0d14" />
          <stop offset="1" stopColor="#111827" />
        </linearGradient>
        <radialGradient id={`sun-${damaged ? "d" : "c"}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>
        <filter id="dull">
          <feGaussianBlur stdDeviation="2.2" />
          <feColorMatrix type="saturate" values="0.35" />
        </filter>
      </defs>
      <g filter={damaged ? "url(#dull)" : undefined}>
        <rect width="800" height="500" fill={`url(#sky-${damaged ? "d" : "c"})`} />
        <circle cx="560" cy="170" r="150" fill={`url(#sun-${damaged ? "d" : "c"})`} opacity="0.6" />
        <circle cx="560" cy="170" r="54" fill="#e0f2fe" />
        <path d="M0 380 L140 270 L250 340 L380 220 L520 330 L640 260 L800 350 L800 500 L0 500 Z" fill="#0d1119" />
        <path d="M0 430 L180 340 L320 410 L470 320 L620 400 L800 360 L800 500 L0 500 Z" fill="#06060f" />
        <text x="60" y="120" fill="#fff" fontSize="46" fontWeight="600" letterSpacing="2">12:45</text>
        <text x="62" y="152" fill="#9aa" fontSize="16" letterSpacing="3">MONDAY · DHAKA</text>
      </g>
      {damaged && (
        <g>
          <rect width="800" height="500" fill="#fff" opacity="0.07" />
          <path d="M-50 500 L400 -50" stroke="#fff" strokeOpacity="0.18" strokeWidth="90" />
          <g stroke="#fff" strokeOpacity="0.35" strokeWidth="1.2" fill="none">
            <path d="M120 80 L300 260 L340 250" />
            <path d="M520 60 L470 180 L610 330" />
            <path d="M200 400 L380 360" />
            <path d="M650 420 L720 280" />
            <path d="M60 300 L180 280 L240 320" />
          </g>
          <g fill="#fff" fillOpacity="0.12">
            <circle cx="300" cy="200" r="22" />
            <circle cx="460" cy="120" r="16" />
            <circle cx="620" cy="380" r="26" />
            <circle cx="160" cy="360" r="14" />
          </g>
        </g>
      )}
    </svg>
  );
}

export function ClarityCompare() {
  return (
    <section className="container-page py-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHeading
            eyebrow="See the difference"
            title="Clarity you can feel."
            description="Drag the slider. Ordinary glass scatters light, holds fingerprints and scratches in weeks. HYDRA's nano-coated glass stays optically pure."
          />
          <ul className="-mt-4 space-y-3">
            {["Oleophobic nano-coating repels smudges", "Anti-glare optical layer", "Touch sensitivity preserved at 100%", "Bubble-free adhesive, full-edge coverage"].map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-muted">
                <span className="grid size-5 place-items-center rounded-full bg-accent/15 text-accent">
                  <Check size={12} />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div aria-hidden className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-accent/20 via-transparent to-white/[0.06] blur-2xl" />
          <div className="card-premium relative rounded-[2rem] p-2">
            <CompareSlider before={<Scene damaged />} after={<Scene />} beforeLabel="Ordinary glass" afterLabel="HYDRA armor" />
          </div>
        </div>
      </div>
    </section>
  );
}

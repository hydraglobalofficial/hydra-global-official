import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-7", className)} aria-hidden>
      <defs>
        <linearGradient id="hydra-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <path d="M16 2 29 9.5v13L16 30 3 22.5v-13Z" fill="none" stroke="url(#hydra-mark)" strokeWidth="1.6" />
      <path d="M10.5 10v12M21.5 10v12M10.5 16h11" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-2.5", className)} aria-label="HYDRA home">
      <LogoMark className="transition-transform duration-500 group-hover:rotate-[30deg]" />
      <span className="text-lg font-semibold tracking-[0.32em]">HYDRA</span>
    </Link>
  );
}

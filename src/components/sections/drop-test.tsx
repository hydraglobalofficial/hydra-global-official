"use client";

import { motion } from "motion/react";
import { defaultImpactLabContent, type ImpactLabContent } from "@/content/site-sections";

function DropMark() {
  return (
    <svg viewBox="0 0 120 72" className="h-16 w-full sm:h-[4.5rem]" aria-hidden>
      <line x1="60" y1="8" x2="60" y2="58" stroke="#1e3a8a" strokeOpacity="0.35" strokeDasharray="2 3" />
      <rect x="50" y="14" width="20" height="34" rx="4" fill="white" stroke="#1e3a8a" strokeWidth="1.4" />
      <rect x="56" y="18" width="8" height="2" rx="1" fill="#1e3a8a" fillOpacity="0.45" />
      <path d="M28 60 H92" stroke="#1e3a8a" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M34 64 H86" stroke="#C5E0F3" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function HardnessMark() {
  const ticks = ["6H", "7H", "8H", "9H"];
  return (
    <div className="flex h-16 items-end justify-center gap-2.5 px-3 sm:h-[4.5rem]" aria-hidden>
      {ticks.map((tick, i) => {
        const top = i === ticks.length - 1;
        return (
          <div key={tick} className="flex flex-col items-center gap-1.5">
            <div
              className="w-5 rounded-sm sm:w-6"
              style={{
                height: 16 + i * 8,
                background: top ? "#1e3a8a" : "#d7ebf8",
              }}
            />
            <span className={`font-mono text-[9px] tracking-wide ${top ? "text-[#1e3a8a]" : "text-muted"}`}>{tick}</span>
          </div>
        );
      })}
    </div>
  );
}

function StrengthMark() {
  return (
    <div className="flex h-16 items-end justify-center gap-7 px-4 sm:h-[4.5rem]" aria-hidden>
      <div className="flex flex-col items-center gap-1.5">
        <div className="h-5 w-8 rounded-sm bg-[#d7ebf8]" />
        <span className="font-mono text-[9px] tracking-wide text-muted">Glass</span>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <div className="h-12 w-8 rounded-sm bg-[#1e3a8a]" />
        <span className="font-mono text-[9px] tracking-wide text-[#1e3a8a]">HYDRA</span>
      </div>
    </div>
  );
}

function TouchMark() {
  return (
    <svg viewBox="0 0 72 72" className="mx-auto h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]" aria-hidden>
      <circle cx="36" cy="36" r="22" fill="none" stroke="#d7ebf8" strokeWidth="4" />
      <circle cx="36" cy="36" r="22" fill="none" stroke="#1e3a8a" strokeWidth="4" strokeLinecap="round" strokeDasharray="138" strokeDashoffset="0" transform="rotate(-90 36 36)" />
      <circle cx="36" cy="36" r="3" fill="#1e3a8a" />
    </svg>
  );
}

const MARKS = [DropMark, HardnessMark, StrengthMark, TouchMark];

export function DropTest({ content }: { content?: ImpactLabContent }) {
  const section = content?.cards?.length ? content : defaultImpactLabContent;
  const cards = section.cards.slice(0, 4);

  return (
    <section className="container-page py-8 sm:py-14 md:py-16">
      <div className="relative overflow-hidden rounded-[1.25rem] border border-line bg-surface px-3 pb-6 pt-8 sm:rounded-[2rem] sm:px-6 sm:pb-10 sm:pt-14 md:rounded-[2.5rem] md:px-12 md:pt-16 light:border-[#C5E0F3] light:bg-white">
        <div className="relative mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">{section.eyebrow}</p>
          <h2 className="mt-3 text-[1.65rem] font-semibold tracking-tight text-balance sm:mt-4 sm:text-4xl md:text-5xl">
            {section.title} <span className="text-muted">{section.titleMuted}</span>
          </h2>
          <p className="mt-3 text-sm text-muted sm:mt-4 sm:text-base">{section.text}</p>
        </div>

        <div className="relative mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-3 sm:mt-10 sm:gap-4 lg:grid-cols-4">
          {cards.map((card, i) => {
            const Mark = MARKS[i] ?? TouchMark;
            return (
              <motion.article
                key={`${card.value}-${card.label}-${i}`}
                className="flex min-w-0 flex-col overflow-hidden rounded-[1.2rem] border border-line bg-bg shadow-[0_18px_40px_-30px_rgba(15,23,42,0.35)] sm:rounded-[1.35rem] light:border-[#C5E0F3] light:bg-white"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="grid place-items-center border-b border-line bg-[#f4f9fd] px-3 py-3 light:border-[#C5E0F3]">
                  <Mark />
                </div>
                <div className="flex flex-1 flex-col px-3 pb-4 pt-3.5 text-center sm:px-4 sm:pb-5 sm:pt-4">
                  <p className="font-mono text-[1.65rem] font-semibold leading-none tracking-tight text-fg sm:text-3xl">{card.value}</p>
                  <p className="mt-2 text-[11px] leading-snug text-muted sm:text-sm">{card.label}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

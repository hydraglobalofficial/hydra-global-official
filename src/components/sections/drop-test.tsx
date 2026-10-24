"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ImpactPhone3D } from "@/components/sections/impact-phone-3d";
import { defaultImpactLabContent, type ImpactLabContent } from "@/content/site-sections";

export function DropTest({ content }: { content?: ImpactLabContent }) {
  const section = content?.cards?.length ? content : defaultImpactLabContent;
  const cards = section.cards.slice(0, 4);

  return (
    <section className="container-page py-8 sm:py-14 md:py-16">
      <div className="relative overflow-hidden rounded-[1.25rem] border border-line bg-surface px-3 pb-7 pt-8 sm:rounded-[2rem] sm:px-6 sm:pb-12 sm:pt-16 md:rounded-[2.5rem] md:px-12 md:pt-20">
        <div className="relative mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">{section.eyebrow}</p>
          <h2 className="mt-3 text-[1.65rem] font-semibold tracking-tight text-balance sm:mt-4 sm:text-4xl md:text-6xl">
            {section.title} <span className="text-muted">{section.titleMuted}</span>
          </h2>
          <p className="mt-3 text-sm text-muted sm:mt-4 sm:text-base">{section.text}</p>
        </div>

        <ImpactPhone3D className="mt-4 sm:mt-6" />

        <div className="relative mx-auto mt-2 grid max-w-5xl grid-cols-2 gap-3 border-t border-line pt-6 sm:gap-4 sm:pt-8 lg:grid-cols-4">
          {cards.map((card, i) => (
            <motion.article
              key={`${card.value}-${card.label}-${i}`}
              className="relative min-w-0 overflow-hidden rounded-2xl border border-line bg-bg px-3 py-4 text-center shadow-[0_16px_40px_-28px_rgba(15,17,23,0.45)] sm:rounded-3xl sm:px-4 sm:py-6"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-accent/35 to-transparent"
                initial={{ x: "-130%" }}
                whileInView={{ x: "260%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.05, delay: 0.25 + i * 0.12, ease: "easeInOut" }}
              />
              {card.image ? (
                <div className="relative mx-auto mb-3 h-14 w-14 overflow-hidden rounded-xl sm:h-16 sm:w-16">
                  <Image src={card.image} alt="" fill sizes="64px" className="object-cover" />
                </div>
              ) : null}
              <p className="relative font-mono text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">{card.value}</p>
              <p className="relative mt-1 text-[11px] leading-snug text-muted sm:text-sm">{card.label}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

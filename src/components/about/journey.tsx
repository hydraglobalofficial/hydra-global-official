"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { interpolate } from "@/lib/interpolate";
import { cn } from "@/lib/utils";

const milestones = [
  { year: "2023", title: "Founded in Dhaka", text: "Born out of too many cracked screens and too many fake accessories. HYDRA starts as a mobile accessories brand for Bangladesh." },
  { year: "2024", title: "First iPhone line", text: "Tempered glass and early accessory kits for iPhone launch — 10,000 units in the first six months, mostly by word of mouth." },
  { year: "2025", title: "Samsung & authenticity codes", text: "Galaxy S and Z series join the lineup, and every box ships sealed with a unique authenticity code." },
  { year: "2026", title: "50,000+ devices equipped", text: "Screen armor, camera armor, cases and nationwide delivery to all 64 districts — with 24-hour dispatch inside Dhaka." },
  { year: "Next", title: "Full accessories range", text: "Retail partner network and new categories — everyday essentials beyond the screen, engineered for flagships.", future: true },
] as const;

/** Company timeline whose spine fills with light as the visitor scrolls through it. */
export function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 55%"] });
  const fill = useTransform(scrollYProgress, (v) => interpolate(v, [0, 1], [0, 1]));

  return (
    <div ref={ref} className="relative mx-auto max-w-5xl">
      <div className="absolute bottom-0 left-4 top-0 w-px bg-line md:left-1/2" aria-hidden />
      <motion.div
        className="absolute bottom-0 left-4 top-0 w-px origin-top bg-gradient-to-b from-accent via-accent/50 to-white/10 shadow-[0_0_10px_rgb(30_64_175/0.45)] md:left-1/2"
        style={{ scaleY: fill }}
        aria-hidden
      />
      <ol className="relative">
        {milestones.map((m, i) => {
          const right = i % 2 === 1;
          return (
            <li key={m.year} className="relative grid pb-14 pl-12 last:pb-0 md:grid-cols-2 md:pl-0">
              <motion.span
                className={cn(
                  "absolute left-4 top-1.5 size-3.5 -translate-x-1/2 rounded-full border-2 border-black md:left-1/2",
                  "future" in m ? "bg-subtle" : "bg-accent",
                )}
                initial={{ scale: 0, boxShadow: "0 0 0 0 rgba(30,64,175,0)" }}
                whileInView={{ scale: 1, boxShadow: "0 0 0 6px rgba(30,64,175,0.15)" }}
                viewport={{ once: true, margin: "0px 0px -35% 0px" }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              />
              <motion.div
                className={cn(right ? "md:col-start-2 md:pl-14" : "md:pr-14 md:text-right")}
                initial={{ opacity: 0, x: right ? 40 : -40, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "0px 0px -30% 0px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className={cn("font-mono text-sm", "future" in m ? "text-subtle" : "text-accent")}>{m.year}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">{m.title}</h3>
                <p className="mt-2 text-pretty text-muted">{m.text}</p>
              </motion.div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

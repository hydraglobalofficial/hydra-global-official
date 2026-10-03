"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { AboutContent } from "@/content/site-sections";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { interpolate } from "@/lib/interpolate";
import { cn } from "@/lib/utils";

type Milestone = AboutContent["journey"][number];

/** Company timeline whose spine fills with light as the visitor scrolls through it. */
export function Journey({ milestones }: { milestones: Milestone[] }) {
  const mounted = useHasMounted();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 55%"] });
  const fill = useTransform(scrollYProgress, (v) => interpolate(v, [0, 1], [0, 1]));

  return (
    <div ref={ref} className="relative mx-auto max-w-5xl">
      <div className="absolute bottom-0 left-4 top-0 w-px bg-line md:left-1/2" aria-hidden />
      {mounted ? (
        <motion.div
          className="absolute bottom-0 left-4 top-0 w-px origin-top bg-gradient-to-b from-accent via-accent/50 to-white/10 shadow-[0_0_14px_rgb(30_64_175/0.55)] md:left-1/2"
          style={{ scaleY: fill }}
          aria-hidden
        />
      ) : (
        <div
          className="absolute bottom-0 left-4 top-0 w-px origin-top scale-y-0 bg-gradient-to-b from-accent via-accent/50 to-white/10 shadow-[0_0_14px_rgb(30_64_175/0.55)] md:left-1/2"
          aria-hidden
        />
      )}
      <ol className="relative">
        {milestones.map((m, i) => {
          const right = i % 2 === 1;
          const future = Boolean(m.future);
          const card = (
            <div
              className={cn(
                "card-premium inline-block w-full max-w-md overflow-hidden rounded-2xl p-5 text-left sm:p-6",
                !right && "md:ml-auto md:text-right",
              )}
            >
              <p className={cn("font-mono text-sm", future ? "text-subtle" : "text-accent")}>{m.year}</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-muted sm:text-[15px]">{m.text}</p>
            </div>
          );
          const dotClass = cn(
            "absolute left-4 top-1.5 size-3.5 -translate-x-1/2 rounded-full border-2 border-black md:left-1/2",
            future ? "bg-subtle" : "bg-accent",
          );
          const colClass = cn(right ? "md:col-start-2 md:pl-14" : "md:pr-14 md:text-right");

          return (
            <li key={`${m.year}-${m.title}`} className="relative grid pb-14 pl-12 last:pb-0 md:grid-cols-2 md:pl-0">
              {mounted ? (
                <>
                  <motion.span
                    className={dotClass}
                    initial={{ scale: 0, boxShadow: "0 0 0 0 rgba(30,64,175,0)" }}
                    whileInView={{ scale: 1, boxShadow: "0 0 0 8px rgba(30,64,175,0.18)" }}
                    viewport={{ once: true, margin: "0px 0px -35% 0px" }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  />
                  <motion.div
                    className={colClass}
                    initial={{ opacity: 0, x: right ? 40 : -40, filter: "blur(6px)" }}
                    whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "0px 0px -30% 0px" }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {card}
                  </motion.div>
                </>
              ) : (
                <>
                  <span className={cn(dotClass, "scale-0")} />
                  <div className={cn(colClass, "opacity-0 blur-[6px]", right ? "translate-x-10" : "-translate-x-10")}>
                    {card}
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

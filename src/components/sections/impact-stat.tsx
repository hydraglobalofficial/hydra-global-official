"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "motion/react";

function CountUp({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 2.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString("en-US")}
    </span>
  );
}

export function ImpactStat() {
  return (
    <section className="relative overflow-x-clip py-20 sm:py-28 md:py-40">
      <div className="container-page relative text-center">
        <motion.p
          className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted sm:text-xs"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Protected worldwide
        </motion.p>
        <motion.p
          className="mt-5 font-semibold leading-[0.9] tracking-[-0.07em] text-fg sm:mt-7"
          style={{ fontSize: "clamp(4.75rem, 20vw, 13rem)" }}
          initial={{ opacity: 0, scale: 0.88, y: 24 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <CountUp to={50000} className="tabular-nums" />
          <span>+</span>
        </motion.p>
        <motion.div
          className="mx-auto mt-7 max-w-xl space-y-3 sm:mt-10 sm:space-y-4"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl md:text-4xl">
            Devices equipped by HYDRA.
          </h2>
          <p className="text-sm text-pretty text-muted sm:text-base md:text-lg">
            Engineered for the flagship phones people actually carry. Screen armor, cases, camera kits and more — cut per
            model, quality-checked and shipped worldwide.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

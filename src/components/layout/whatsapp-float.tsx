"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { WhatsappWidgetContent } from "@/content/site-sections";
import { cn } from "@/lib/utils";

/** Admin staff faces only — never product catalog images. */
function liveStaff(staff: WhatsappWidgetContent["staff"]) {
  return staff.filter((s) => {
    const image = s.image?.trim();
    if (!image || image === "#" || image === "/") return false;
    if (image.startsWith("/products/")) return false;
    return true;
  });
}

/**
 * Bottom-right WhatsApp shortcut:
 * staff circular photo (soft glow) + “Contact with [name]”.
 * Click opens WhatsApp. Rotates admin CMS staff only.
 */
export function WhatsappFloat({ content }: { content: WhatsappWidgetContent }) {
  const staff = liveStaff(content.staff);
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const preferReduced = useReducedMotion();
  // Keep SSR + first client paint identical; enable motion only after mount.
  const reduceMotion = !mounted || !!preferReduced;

  useEffect(() => {
    setMounted(true);
  }, []);

  const rotateCount = staff.length > 0 ? staff.length : 1;

  useEffect(() => {
    setIndex(0);
  }, [rotateCount]);

  useEffect(() => {
    if (rotateCount < 2) return;
    const ms = Math.min(8, Math.max(2, content.rotateSeconds)) * 1000;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % rotateCount);
    }, ms);
    return () => window.clearInterval(id);
  }, [rotateCount, content.rotateSeconds]);

  if (!content.enabled || !content.phone) return null;

  const href = `https://wa.me/${content.phone}?text=${encodeURIComponent(content.message || "Hi HYDRA!")}`;
  const hasStaff = staff.length > 0;
  const active = hasStaff ? staff[index % staff.length]! : null;
  const agentName = active?.name?.trim() || "HYDRA";
  const a11y = `Contact with ${agentName} on WhatsApp`;
  const initial = agentName.slice(0, 1).toUpperCase();

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={a11y}
      title={a11y}
      data-whatsapp-float
      initial={false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "group fixed z-[60] flex flex-col items-end gap-2 sm:gap-2.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/55 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
      )}
      style={{
        bottom: "max(1rem, calc(env(safe-area-inset-bottom, 0px) + 0.75rem))",
        right: "max(0.75rem, env(safe-area-inset-right, 0px))",
      }}
    >
      <motion.span
        animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
        transition={
          reduceMotion ? undefined : { duration: 3.6, repeat: Infinity, ease: "easeInOut" }
        }
        className={cn(
          "pointer-events-none relative z-10",
          "max-w-[min(12.5rem,calc(100vw-5rem))] sm:max-w-[13.5rem]",
          "rounded-2xl border border-line-strong bg-bg px-3 py-2 sm:px-3.5 sm:py-2.5",
          "shadow-[0_12px_32px_rgba(0,0,0,0.55)] light:shadow-[0_12px_28px_rgba(0,0,0,0.12)]",
          "transition-colors duration-300 group-hover:border-emerald-400/45",
        )}
      >
        <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-600 light:text-emerald-700">
          Contact with
        </span>
        <span className="relative mt-0.5 block min-h-[1.25rem] overflow-hidden">
          {mounted ? (
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={agentName}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="block truncate text-[13px] font-semibold leading-tight tracking-tight text-fg sm:text-[14px]"
              >
                {agentName}
              </motion.span>
            </AnimatePresence>
          ) : (
            <span className="block truncate text-[13px] font-semibold leading-tight tracking-tight text-fg sm:text-[14px]">
              {agentName}
            </span>
          )}
        </span>
        <span
          aria-hidden
          className="absolute -bottom-1.5 right-6 size-3 rotate-45 border-b border-r border-line-strong bg-bg"
        />
      </motion.span>

      <motion.span
        className="relative z-10 block"
        style={{ width: 68, height: 68 }}
        whileHover={reduceMotion ? undefined : { scale: 1.06 }}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
        transition={{ type: "spring", stiffness: 420, damping: 24 }}
      >
        <span
          className={cn(
            "relative block size-full overflow-hidden rounded-full bg-surface-3",
            "ring-2 ring-white/30 light:ring-black/15",
            "shadow-[0_10px_24px_rgba(0,0,0,0.35)] light:shadow-[0_8px_20px_rgba(0,0,0,0.12)]",
            "transition-[box-shadow,ring-color] duration-300",
            "group-hover:ring-emerald-300/50",
          )}
        >
          {active?.image ? (
            mounted ? (
              <AnimatePresence mode="wait" initial={false}>
                {/* eslint-disable-next-line @next/next/no-img-element -- CMS/R2 staff avatars */}
                <motion.img
                  key={`${active.image}-${index}`}
                  src={active.image}
                  alt=""
                  initial={reduceMotion ? false : { opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 size-full object-cover object-center"
                  draggable={false}
                />
              </AnimatePresence>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- CMS/R2 staff avatars
              <img
                src={active.image}
                alt=""
                className="absolute inset-0 size-full object-cover object-center"
                draggable={false}
              />
            )
          ) : (
            <span className="grid size-full place-items-center bg-gradient-to-br from-emerald-500/30 to-surface-3 text-lg font-semibold text-fg">
              {initial}
            </span>
          )}
        </span>

        <span
          aria-hidden
          className="absolute bottom-0.5 right-0.5 size-3.5 rounded-full border-2 border-bg bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]"
        />
      </motion.span>
    </motion.a>
  );
}

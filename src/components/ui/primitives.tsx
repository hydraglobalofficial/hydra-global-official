"use client";

import type { ReactNode } from "react";
import { Star } from "lucide-react";
import { motion } from "motion/react";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: "default" | "accent" | "success" | "warning" | "danger";
  className?: string;
}) {
  const tones = {
    default: "border-line-strong bg-white/5 text-fg",
    accent: "border-accent/30 bg-accent/10 text-accent",
    success: "border-success/30 bg-success/10 text-success",
    warning: "border-warning/30 bg-warning/10 text-warning",
    danger: "border-danger/30 bg-danger/10 text-danger",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-accent", className)}>
      <span className="size-1.5 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
}) {
  const mounted = useHasMounted();
  const layout = cn(
    "mb-10 flex flex-col gap-4 md:mb-14",
    align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
  );
  const body = (
    <>
      <div className={cn("max-w-2xl space-y-4", align === "center" && "mx-auto")}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-5xl">{title}</h2>
        {description && <div className="text-base text-pretty text-muted md:text-lg">{description}</div>}
      </div>
      {action}
    </>
  );

  if (!mounted) {
    return <div className={cn(layout, "translate-y-[18px] opacity-0")}>{body}</div>;
  }

  return (
    <motion.div
      className={layout}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {body}
    </motion.div>
  );
}

export function Rating({ value, count, size = 14 }: { value: number; count?: number; size?: number }) {
  return (
    <div className="flex items-center gap-2" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
      <div className="flex">
        {Array.from({ length: 5 }, (_, i) => {
          const fill = Math.min(1, Math.max(0, value - i));
          return (
            <span key={i} className="relative" style={{ width: size, height: size }}>
              <Star className="absolute inset-0 text-white/15" size={size} fill="currentColor" strokeWidth={0} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className="text-accent" size={size} fill="currentColor" strokeWidth={0} />
              </span>
            </span>
          );
        })}
      </div>
      {count !== undefined && <span className="text-xs text-muted">({count.toLocaleString()})</span>}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  const mounted = useHasMounted();
  const content = (
    <>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-6xl">{title}</h1>
      {description && <div className="max-w-2xl text-lg text-pretty text-muted">{description}</div>}
      {children}
    </>
  );

  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-white/[0.05] blur-[100px]" />
      <div aria-hidden className="divider-glow absolute inset-x-0 bottom-0" />
      <div className="container-page relative py-16 md:py-24">
        {mounted ? (
          <motion.div
            className="max-w-3xl space-y-5"
            initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {content}
          </motion.div>
        ) : (
          <div className="max-w-3xl translate-y-[22px] space-y-5 opacity-0 blur-[6px]">{content}</div>
        )}
      </div>
    </section>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="glass flex flex-col items-center gap-4 rounded-3xl px-6 py-16 text-center">
      <div className="size-12 rounded-2xl border border-line bg-gradient-to-br from-accent/20 to-white/[0.04]" />
      <h3 className="text-lg font-medium">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action}
    </div>
  );
}

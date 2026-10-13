import type { ReactNode } from "react";
import { Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export function AdminHeader({
  title,
  description,
  eyebrow,
  action,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3.5 sm:mb-8 sm:gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0 space-y-2 sm:space-y-2.5">
        {eyebrow && (
          <p className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-accent sm:text-[11px]">
            <span className="size-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent)]" aria-hidden />
            {eyebrow}
          </p>
        )}
        <h1 className="text-balance text-xl font-semibold tracking-tight text-fg sm:text-3xl lg:text-[2.25rem] lg:leading-tight">
          {title}
        </h1>
        {description && <p className="max-w-xl text-[13px] leading-relaxed text-muted sm:text-[15px]">{description}</p>}
      </div>
      {action ? (
        <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto">{action}</div>
      ) : null}
    </div>
  );
}

export function Card({ children, className, glow }: { children: ReactNode; className?: string; glow?: boolean }) {
  return (
    <div
      className={cn(
        "admin-card relative overflow-hidden rounded-2xl",
        glow && "before:pointer-events-none before:absolute before:-right-8 before:-top-10 before:size-36 before:rounded-full before:bg-accent/20 before:blur-2xl before:content-['']",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  tone?: "default" | "accent" | "warning" | "success";
}) {
  const tones = {
    default: {
      icon: "text-muted border-line bg-surface-2",
      bar: "from-line-strong to-transparent",
      glow: false as boolean,
    },
    accent: {
      icon: "text-accent border-accent/30 bg-accent/10",
      bar: "from-accent/70 to-transparent",
      glow: true,
    },
    warning: {
      icon: "text-warning border-warning/25 bg-warning/10",
      bar: "from-warning/60 to-transparent",
      glow: false,
    },
    success: {
      icon: "text-success border-success/25 bg-success/10",
      bar: "from-success/60 to-transparent",
      glow: false,
    },
  };
  const t = tones[tone];
  return (
    <Card className="group p-4 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-line-strong sm:p-5" glow={t.glow}>
      <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r", t.bar)} />
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-subtle sm:text-xs sm:tracking-[0.14em]">{label}</p>
        <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl border transition-transform duration-300 group-hover:scale-105 sm:size-10", t.icon)}>
          {icon}
        </span>
      </div>
      <p className="mt-3 break-words font-mono text-xl font-semibold tracking-tight tabular-nums text-fg sm:mt-4 sm:text-3xl">{value}</p>
      {hint && <p className="mt-1.5 text-xs text-subtle">{hint}</p>}
    </Card>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
  icon,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface-2/50 px-3.5 py-3 sm:gap-3 sm:px-5 sm:py-4">
        <h2 className="flex min-w-0 items-center gap-2.5 text-sm font-medium tracking-tight text-fg sm:text-[15px]">
          {icon ? (
            <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-line bg-surface-2 text-muted">{icon}</span>
          ) : null}
          <span className="truncate">{title}</span>
        </h2>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </Card>
  );
}

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-px overflow-x-auto">
      <table className="w-full min-w-[36rem] text-left text-sm text-fg [&_td]:px-4 [&_td]:py-3.5 sm:[&_td]:px-5 [&_th]:bg-surface-2/60 [&_th]:px-4 [&_th]:py-3 sm:[&_th]:px-5 [&_th]:text-[10px] [&_th]:font-medium [&_th]:uppercase [&_th]:tracking-[0.14em] [&_th]:text-subtle [&_thead]:border-b [&_thead]:border-line [&_tbody_tr]:border-b [&_tbody_tr]:border-line last:[&_tbody_tr]:border-0 [&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-surface-2/70">
        {children}
      </table>
    </div>
  );
}

const statusTones: Record<string, "default" | "accent" | "success" | "warning" | "danger"> = {
  PENDING: "warning",
  CONFIRMED: "accent",
  PROCESSING: "accent",
  SHIPPED: "accent",
  DELIVERED: "success",
  CANCELLED: "danger",
  RETURNED: "danger",
  UNPAID: "warning",
  PAID: "success",
  REFUNDED: "default",
  FAILED: "danger",
  NEW: "warning",
  IN_PROGRESS: "accent",
  RESOLVED: "success",
  ACTIVE: "success",
  DRAFT: "default",
  ARCHIVED: "danger",
  APPROVED: "success",
  REJECTED: "danger",
  CONTACT: "accent",
  SUPPORT: "accent",
  WARRANTY: "warning",
  RETURN: "danger",
  OWNER: "accent",
  STAFF: "success",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={statusTones[status] ?? "default"}>{status.replace(/_/g, " ").toLowerCase()}</Badge>;
}

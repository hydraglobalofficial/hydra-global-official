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
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0 space-y-2">
        {eyebrow && (
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent sm:text-[11px]">{eyebrow}</p>
        )}
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-fg sm:text-3xl lg:text-[2.15rem] lg:leading-tight">
          {title}
        </h1>
        {description && <p className="max-w-xl text-sm leading-relaxed text-muted sm:text-[15px]">{description}</p>}
      </div>
      {action ? <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div> : null}
    </div>
  );
}

export function Card({ children, className, glow }: { children: ReactNode; className?: string; glow?: boolean }) {
  return (
    <div
      className={cn(
        "card-premium relative overflow-hidden rounded-2xl backdrop-blur-md",
        glow && "before:pointer-events-none before:absolute before:-right-10 before:-top-12 before:size-44 before:rounded-full before:bg-accent/25 before:blur-3xl before:content-['']",
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
    default: "text-muted",
    accent: "text-accent",
    warning: "text-warning",
    success: "text-success",
  };
  return (
    <Card className="group p-4 transition-[border-color,transform] duration-300 hover:border-white/14 sm:p-5" glow={tone === "accent"}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-subtle sm:text-xs sm:tracking-[0.14em]">{label}</p>
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-xl border border-white/8 bg-white/[0.03] transition-colors group-hover:border-white/14 sm:size-9",
            tones[tone],
          )}
        >
          {icon}
        </span>
      </div>
      <p className="mt-3 font-mono text-2xl font-semibold tracking-tight tabular-nums text-fg sm:mt-4 sm:text-3xl">{value}</p>
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
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3.5 sm:px-5 sm:py-4">
        <h2 className="flex items-center gap-2 text-sm font-medium tracking-tight sm:text-[15px]">
          {icon}
          {title}
        </h2>
        {action}
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </Card>
  );
}

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-px overflow-x-auto">
      <table className="w-full min-w-[36rem] text-left text-sm [&_td]:px-4 [&_td]:py-3.5 sm:[&_td]:px-5 [&_th]:px-4 [&_th]:py-3 sm:[&_th]:px-5 [&_th]:text-[10px] [&_th]:font-medium [&_th]:uppercase [&_th]:tracking-[0.14em] [&_th]:text-subtle [&_thead]:border-b [&_thead]:border-white/[0.06] [&_tbody_tr]:border-b [&_tbody_tr]:border-white/[0.05] last:[&_tbody_tr]:border-0 [&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-white/[0.025]">
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
  VOID: "danger",
  APPROVED: "success",
  REJECTED: "danger",
  GENUINE: "success",
  ALREADY_VERIFIED: "warning",
  NOT_FOUND: "danger",
  CONTACT: "accent",
  SUPPORT: "accent",
  WARRANTY: "warning",
  RETURN: "danger",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={statusTones[status] ?? "default"}>{status.replace(/_/g, " ").toLowerCase()}</Badge>;
}

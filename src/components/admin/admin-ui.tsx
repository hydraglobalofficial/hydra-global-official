import type { ReactNode } from "react";
import { Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export function AdminHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-line bg-surface", className)}>{children}</div>;
}

export function StatCard({ label, value, hint, icon }: { label: string; value: ReactNode; hint?: string; icon?: ReactNode }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between text-muted">
        <p className="text-xs uppercase tracking-[0.14em]">{label}</p>
        {icon}
      </div>
      <p className="mt-3 font-mono text-3xl font-semibold tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-subtle">{hint}</p>}
    </Card>
  );
}

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full text-left text-sm [&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-3 [&_th]:text-xs [&_th]:font-medium [&_th]:uppercase [&_th]:tracking-[0.12em] [&_th]:text-subtle [&_thead]:border-b [&_thead]:border-line [&_tbody_tr]:border-b [&_tbody_tr]:border-line last:[&_tbody_tr]:border-0 [&_tbody_tr:hover]:bg-white/[0.02]">
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
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={statusTones[status] ?? "default"}>{status.replace(/_/g, " ").toLowerCase()}</Badge>;
}

"use client";

import { useMemo, useSyncExternalStore } from "react";
import { getBusinessStatus, type BusinessStatus } from "@/lib/business-hours";
import { cn } from "@/lib/utils";

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 30_000);
  return () => clearInterval(id);
}

const snapshot = () => JSON.stringify(getBusinessStatus());
const serverSnapshot = () => null;

export function useBusinessStatus(): BusinessStatus | null {
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return useMemo(() => (raw ? (JSON.parse(raw) as BusinessStatus) : null), [raw]);
}

export function LiveStatus({ className }: { className?: string }) {
  const status = useBusinessStatus();

  return (
    <div className={cn("inline-flex items-center gap-3 rounded-full border border-line bg-white/[0.03] py-1.5 pl-3 pr-4 text-xs backdrop-blur-md", className)}>
      <span className="relative flex size-2.5">
        {status?.open && <span className="absolute inset-0 animate-ping rounded-full bg-success/70" />}
        <span className={cn("relative size-2.5 rounded-full", !status ? "bg-subtle" : status.open ? "bg-success" : "bg-warning")} />
      </span>
      {status ? (
        <span>
          <span className="font-medium">{status.open ? "Support is online" : "We're offline"}</span>
          <span className="text-muted">
            {" "}
            · {status.open ? status.localTime : status.nextOpen ? `back ${status.nextOpen}` : status.localTime}
          </span>
        </span>
      ) : (
        <span className="text-muted">Checking availability…</span>
      )}
    </div>
  );
}

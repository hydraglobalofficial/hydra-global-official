"use client";

import { useEffect, useState } from "react";
import { Database, RefreshCw, Zap } from "lucide-react";
import { purgeAdminCache } from "@/server/actions/admin";
import type { AdminCacheStatus } from "@/lib/admin-cache";
import { cn } from "@/lib/utils";

export function AdminCacheBadge({
  status,
  hit,
  className,
}: {
  status: AdminCacheStatus;
  hit?: boolean;
  className?: string;
}) {
  const redis = status.backend === "redis";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ring-1",
        redis
          ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/25"
          : "bg-amber-500/10 text-amber-200 ring-amber-500/25",
        className,
      )}
      title={
        redis
          ? "Admin data is cached in Upstash Redis across instances"
          : "UPSTASH_REDIS_* not set — using process memory (fine for local)"
      }
    >
      {redis ? <Zap size={11} /> : <Database size={11} />}
      {status.label}
      {typeof hit === "boolean" && (
        <span className="normal-case tracking-normal text-zinc-400">· {hit ? "hit" : "miss"}</span>
      )}
    </span>
  );
}

export function AdminCachePanel({
  status,
  hit,
  cachedAt,
}: {
  status: AdminCacheStatus;
  hit: boolean;
  cachedAt: string;
}) {
  const [ageLabel, setAgeLabel] = useState("...");
  useEffect(() => {
    const tick = () => {
      const ageSec = Math.max(0, Math.round((Date.now() - new Date(cachedAt).getTime()) / 1000));
      setAgeLabel(ageSec < 5 ? "just now" : `${ageSec}s ago`);
    };
    tick();
    const id = window.setInterval(tick, 5000);
    return () => window.clearInterval(id);
  }, [cachedAt]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface-2 px-3 py-3 sm:px-4">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-medium text-fg">Admin cache</p>
          <AdminCacheBadge status={status} hit={hit} />
        </div>
        <p className="text-[11px] text-subtle">
          Version v{status.version}
          <span className="mx-1.5 text-muted">·</span>
          Snapshot {ageLabel}
          <span className="mx-1.5 text-muted">·</span>
          Tags: nav · dashboard
        </p>
      </div>
      <form action={purgeAdminCache}>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent/40 hover:text-fg"
        >
          <RefreshCw size={12} /> Purge cache
        </button>
      </form>
    </div>
  );
}

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
  const ageSec = Math.max(0, Math.round((Date.now() - new Date(cachedAt).getTime()) / 1000));
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-medium text-zinc-200">Admin cache</p>
          <AdminCacheBadge status={status} hit={hit} />
        </div>
        <p className="text-[11px] text-zinc-500">
          Version v{status.version}
          <span className="mx-1.5 text-zinc-700">·</span>
          Snapshot {ageSec < 5 ? "just now" : `${ageSec}s ago`}
          <span className="mx-1.5 text-zinc-700">·</span>
          Tags: nav · dashboard
        </p>
      </div>
      <form action={purgeAdminCache}>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-accent/40 hover:text-fg"
        >
          <RefreshCw size={12} /> Purge cache
        </button>
      </form>
    </div>
  );
}

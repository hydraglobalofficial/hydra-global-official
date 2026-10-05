import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ExternalLink, LogOut } from "lucide-react";
import { AdminCacheBadge } from "@/components/admin/cache-status";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminRoutePrefetch } from "@/components/admin/admin-prefetch";
import { getAdminCacheStatus } from "@/lib/admin-cache";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminNavBadges } from "@/server/queries/admin";
import { logout } from "@/server/actions/auth";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · HYDRA Admin" },
  robots: { index: false, follow: false },
};

function AdminBrand() {
  return (
    <Link href="/admin" prefetch className="inline-flex items-center gap-2.5" aria-label="HYDRA Admin">
      <span className="grid size-9 place-items-center rounded-lg bg-accent/20 font-mono text-[11px] font-bold tracking-wider text-blue-100 ring-1 ring-accent/30">
        H
      </span>
      <span className="hidden min-w-0 sm:block">
        <span className="block text-[15px] font-semibold tracking-tight text-fg">HYDRA</span>
        <span className="block text-[10px] uppercase tracking-[0.18em] text-zinc-500">Admin</span>
      </span>
    </Link>
  );
}

async function AdminNavShell() {
  const [badgesRaw, cacheStatus] = await Promise.all([
    getAdminNavBadges(),
    Promise.resolve(getAdminCacheStatus()),
  ]);

  const badges = {
    "/admin/orders": badgesRaw.pendingOrders,
    "/admin/inquiries": badgesRaw.newInquiries,
    "/admin/reviews": badgesRaw.pendingReviews,
  };
  const attention =
    badgesRaw.pendingOrders + badgesRaw.newInquiries + badgesRaw.pendingReviews;

  return (
    <>
      <div className="mt-3 hidden items-center justify-between gap-2 px-4 sm:px-5 lg:flex lg:px-4">
        <p className="min-w-0 truncate text-[11px] text-zinc-500">
          {attention > 0 ? (
            <span className="text-amber-300/90">{attention} need attention</span>
          ) : (
            <span className="text-emerald-300/85">All clear</span>
          )}
        </p>
        <AdminCacheBadge status={cacheStatus} />
      </div>
      <div className="px-3 pb-3 pt-3 sm:px-4 lg:flex-1 lg:overflow-y-auto lg:px-3 lg:pb-4 lg:pt-2">
        <AdminNav badges={badges} />
      </div>
    </>
  );
}

function AdminNavFallback() {
  return (
    <>
      <div className="mt-3 hidden h-5 items-center justify-between gap-2 px-4 lg:flex lg:px-4">
        <div className="h-3 w-24 animate-pulse rounded bg-white/[0.06]" />
        <div className="h-5 w-16 animate-pulse rounded-full bg-white/[0.05]" />
      </div>
      <div className="px-3 pb-3 pt-3 sm:px-4 lg:flex-1 lg:px-3 lg:pb-4 lg:pt-2">
        <AdminNav badges={{}} />
      </div>
    </>
  );
}

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const session = await requireAdmin();
  const initials = session.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="relative min-h-dvh overflow-x-clip bg-[#05070e] text-fg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_0%_0%,rgba(30,64,175,0.22),transparent_55%)]" />

      <div className="relative mx-auto flex min-h-dvh max-w-[1600px] flex-col lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#05070e]/95 lg:flex lg:h-dvh lg:flex-col lg:border-b-0 lg:border-r lg:border-white/[0.05]">
          <div className="px-4 py-3.5 sm:px-5 lg:px-4 lg:pb-2 lg:pt-5">
            <div className="flex items-center justify-between gap-3">
              <AdminBrand />
              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-full bg-accent/15 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-blue-200 ring-1 ring-accent/25">
                  {session.role}
                </span>
                <form action={logout} className="lg:hidden">
                  <button
                    type="submit"
                    className="grid size-9 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-400 transition-colors hover:border-white/15 hover:text-fg"
                    aria-label="Sign out"
                  >
                    <LogOut size={15} />
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <Suspense fallback={<AdminNavFallback />}>
              <AdminNavShell />
            </Suspense>
          </div>

          <div className="mt-auto hidden border-t border-white/[0.05] p-3 lg:block">
            <Link
              href="/"
              target="_blank"
              prefetch={false}
              className="mb-2 flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-zinc-500 transition-colors hover:bg-white/[0.03] hover:text-zinc-200"
            >
              <ExternalLink size={14} />
              View store
            </Link>

            <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-2 pl-2.5">
              <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent/20 font-mono text-[11px] font-semibold tracking-wide text-blue-100">
                {initials || "AD"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-zinc-100">{session.name}</p>
                <p className="truncate text-[11px] capitalize text-zinc-500">{session.role.toLowerCase()}</p>
              </div>
              <form action={logout}>
                <button
                  type="submit"
                  className="grid size-8 shrink-0 place-items-center rounded-lg text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-zinc-200"
                  aria-label="Sign out"
                >
                  <LogOut size={15} />
                </button>
              </form>
            </div>
          </div>
        </aside>

        <main className="relative min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-8 lg:py-8">
          <AdminRoutePrefetch />
          <div className="relative mx-auto w-full max-w-6xl xl:max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

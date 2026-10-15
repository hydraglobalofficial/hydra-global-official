import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { ExternalLink, LogOut } from "lucide-react";
import { AdminCacheBadge } from "@/components/admin/cache-status";
import { AdminMobileChrome } from "@/components/admin/admin-mobile-chrome";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminRoutePrefetch } from "@/components/admin/admin-prefetch";
import { LogoMark } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { MoneyProvider } from "@/components/money/money-provider";
import { getAdminCacheStatus } from "@/lib/admin-cache";
import { requireAdmin } from "@/lib/auth/session";
import { bindMoneyFormat } from "@/lib/money";
import { getAdminNavBadges } from "@/server/queries/admin";
import { getCurrencyContent } from "@/server/queries/content";
import { logout } from "@/server/actions/auth";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · HYDRA Admin" },
  robots: { index: false, follow: false },
};

function AdminBrand() {
  return (
    <Link href="/admin" prefetch className="inline-flex min-w-0 items-center gap-2.5" aria-label="HYDRA Admin">
      <LogoMark className="size-9 rounded-lg ring-1 ring-line sm:size-9 md:size-9" sizes="36px" priority />
      <span className="min-w-0">
        <span className="block text-[15px] font-semibold tracking-tight text-fg">HYDRA</span>
        <span className="block text-[10px] uppercase tracking-[0.18em] text-subtle">Admin</span>
      </span>
    </Link>
  );
}

function UserChip({
  initials,
  name,
  role,
}: {
  initials: string;
  name: string;
  role: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-2 p-2 pl-2.5">
      <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent/20 font-mono text-[11px] font-semibold tracking-wide text-accent">
        {initials || "AD"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-fg">{name}</p>
        <p className="truncate text-[11px] capitalize text-subtle">{role.toLowerCase()}</p>
      </div>
      <form action={logout}>
        <button
          type="submit"
          className="grid size-8 shrink-0 place-items-center rounded-lg text-subtle transition-colors hover:bg-surface-3 hover:text-fg"
          aria-label="Sign out"
        >
          <LogOut size={15} />
        </button>
      </form>
    </div>
  );
}

async function AdminNavData({
  children,
}: {
  children: (data: {
    badges: Record<string, number>;
    attention: number;
    cacheStatus: ReturnType<typeof getAdminCacheStatus>;
  }) => ReactNode;
}) {
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

  return <>{children({ badges, attention, cacheStatus })}</>;
}

function AttentionLabel({ attention }: { attention: number }) {
  return attention > 0 ? (
    <span className="text-warning">{attention} need attention</span>
  ) : (
    <span className="text-success">All clear</span>
  );
}

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const [session, currency] = await Promise.all([requireAdmin(), getCurrencyContent()]);
  bindMoneyFormat(currency);
  const initials = session.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const userFooter = (
    <UserChip initials={initials} name={session.name} role={session.role} />
  );

  return (
    <MoneyProvider format={currency}>
    <div className="relative min-h-dvh bg-bg text-fg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_0%_0%,rgba(30,64,175,0.22),transparent_55%)] light:bg-[radial-gradient(ellipse_80%_45%_at_0%_0%,rgba(30,64,175,0.1),transparent_55%)]" />

      <div className="relative mx-auto flex min-h-dvh max-w-[1600px] flex-col lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)]">
        <Suspense
          fallback={
            <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-bg/95 px-3 py-2.5 lg:hidden">
              <AdminBrand />
              <span className="size-9 rounded-lg border border-line bg-surface" />
            </div>
          }
        >
          <AdminNavData>
            {({ badges, attention }) => (
              <AdminMobileChrome
                brand={<AdminBrand />}
                role={session.role}
                badges={badges}
                attention={<AttentionLabel attention={attention} />}
                userFooter={userFooter}
                logoutAction={logout}
              />
            )}
          </AdminNavData>
        </Suspense>

        <aside className="sticky top-0 z-30 hidden h-dvh flex-col border-r border-line bg-bg max-lg:hidden lg:flex">
          <div className="px-4 pb-2 pt-5">
            <div className="flex items-center justify-between gap-3">
              <AdminBrand />
              <div className="flex shrink-0 items-center gap-1.5">
                <ThemeToggle />
                <span className="rounded-full bg-accent/15 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-blue-200 ring-1 ring-accent/25 light:text-accent">
                  {session.role}
                </span>
              </div>
            </div>
          </div>

          <Suspense
            fallback={
              <>
                <div className="mt-3 flex h-5 items-center justify-between gap-2 px-4">
                  <div className="h-3 w-24 animate-pulse rounded bg-white/[0.06]" />
                  <div className="h-5 w-16 animate-pulse rounded-full bg-white/[0.05]" />
                </div>
                <div className="flex-1 px-3 pb-4 pt-2">
                  <AdminNav badges={{}} />
                </div>
              </>
            }
          >
            <AdminNavData>
              {({ badges, attention, cacheStatus }) => (
                <>
                  <div className="mt-3 flex items-center justify-between gap-2 px-4">
                    <p className="min-w-0 truncate text-[11px] text-subtle">
                      <AttentionLabel attention={attention} />
                    </p>
                    <AdminCacheBadge status={cacheStatus} />
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-2">
                    <AdminNav badges={badges} />
                  </div>
                </>
              )}
            </AdminNavData>
          </Suspense>

          <div className="mt-auto border-t border-line p-3">
            <Link
              href="/"
              target="_blank"
              prefetch={false}
              className="mb-2 flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-muted transition-colors hover:bg-white/[0.03] hover:text-fg light:hover:bg-black/[0.04]"
            >
              <ExternalLink size={14} />
              View store
            </Link>
            {userFooter}
          </div>
        </aside>

        <main className="relative min-w-0 flex-1 overflow-x-clip px-3 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
          <AdminRoutePrefetch />
          <div className="relative mx-auto w-full max-w-6xl xl:max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
    </MoneyProvider>
  );
}

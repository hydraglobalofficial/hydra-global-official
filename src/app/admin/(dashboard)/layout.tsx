import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { Logo } from "@/components/layout/logo";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { logout } from "@/server/actions/auth";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · HYDRA Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const session = await requireAdmin();
  const [pendingOrders, newInquiries, pendingReviews] = await Promise.all([
    db.order.count({ where: { status: "PENDING" } }),
    db.inquiry.count({ where: { status: "NEW" } }),
    db.review.count({ where: { status: "PENDING" } }),
  ]);

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="border-b border-line bg-surface p-4 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:border-b-0 lg:border-r lg:p-5">
        <div className="mb-6 flex items-center justify-between lg:mb-10">
          <Logo />
          <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-muted">ADMIN</span>
        </div>
        <AdminNav badges={{ "/admin/orders": pendingOrders, "/admin/inquiries": newInquiries, "/admin/reviews": pendingReviews }} />
        <div className="mt-auto hidden space-y-3 border-t border-line pt-5 lg:block">
          <Link href="/" target="_blank" className="flex items-center gap-2 text-sm text-muted hover:text-fg">
            <ExternalLink size={14} /> View store
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">{session.name}</p>
              <p className="text-xs text-subtle">{session.role.toLowerCase()}</p>
            </div>
            <form action={logout}>
              <button type="submit" className="rounded-full p-2 text-muted hover:bg-white/5 hover:text-fg" aria-label="Sign out">
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
      </aside>
      <main className="min-w-0 p-5 md:p-8 lg:p-10">{children}</main>
    </div>
  );
}

import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Banknote,
  FileText,
  Inbox,
  Package,
  PackagePlus,
  ShoppingCart,
  Sparkles,
  Star,
} from "lucide-react";
import { AdminHeader, Card, Panel, StatCard, StatusBadge, Table } from "@/components/admin/admin-ui";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";

export const metadata = { title: "Overview" };

const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

const quickActions = [
  { href: "/admin/orders", label: "Orders", hint: "Confirm & fulfill", icon: ShoppingCart },
  { href: "/admin/products/new", label: "Add product", hint: "List new armor", icon: PackagePlus },
  { href: "/admin/reviews", label: "Reviews", hint: "Moderate feedback", icon: Star },
  { href: "/admin/content", label: "Edit content", hint: "About & site copy", icon: FileText },
];

export default async function AdminOverviewPage() {
  const session = await requireAdmin();
  const since = daysAgo(30);
  const firstName = session.name.split(" ")[0] ?? session.name;

  const [revenue, orders30, pending, lowStock, recentOrders, recentInquiries, newInquiryCount, pendingReviews] =
    await Promise.all([
      db.order.aggregate({
        where: { createdAt: { gte: since }, status: { notIn: ["CANCELLED", "RETURNED"] } },
        _sum: { total: true },
      }),
      db.order.count({ where: { createdAt: { gte: since } } }),
      db.order.count({ where: { status: "PENDING" } }),
      db.product.findMany({
        where: { status: "ACTIVE", stock: { lt: 15 } },
        select: { id: true, name: true, stock: true },
        orderBy: { stock: "asc" },
        take: 6,
      }),
      db.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: { id: true, number: true, customerName: true, total: true, status: true, createdAt: true },
      }),
      db.inquiry.findMany({
        where: { status: "NEW" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, type: true, message: true, createdAt: true },
      }),
      db.inquiry.count({ where: { status: "NEW" } }),
      db.review.count({ where: { status: "PENDING" } }),
    ]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <Card className="overflow-hidden p-0" glow>
        <div className="relative px-5 py-7 sm:px-8 sm:py-9">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(30,64,175,0.32),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.04),transparent_45%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
          <div className="bg-dots pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
          <div className="relative">
            <AdminHeader
              eyebrow="Command overview"
              title={`Welcome back, ${firstName}`}
              description="Live pulse of the store — orders, stock, and customer signals from the last 30 days."
              action={
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-success">
                    <Sparkles size={11} /> Live
                  </span>
                  <Link
                    href="/admin/orders"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-2 text-sm text-fg transition-colors hover:border-accent/45 hover:bg-accent/15"
                  >
                    Review orders <ArrowUpRight size={14} />
                  </Link>
                </div>
              }
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                pending > 0 && `${pending} pending orders`,
                newInquiryCount > 0 && `${newInquiryCount} new inquiries`,
                pendingReviews > 0 && `${pendingReviews} reviews to approve`,
              ]
                .filter(Boolean)
                .map((item) => (
                  <span
                    key={String(item)}
                    className="rounded-full border border-warning/25 bg-warning/10 px-3 py-1 text-xs text-warning"
                  >
                    {item}
                  </span>
                ))}
              {pending === 0 && newInquiryCount === 0 && pendingReviews === 0 && (
                <span className="rounded-full border border-success/25 bg-success/10 px-3 py-1 text-xs text-success">
                  All queues clear
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Revenue (30d)" value={formatPrice(revenue._sum.total ?? 0)} icon={<Banknote size={16} />} tone="accent" />
        <StatCard label="Orders (30d)" value={orders30} icon={<ShoppingCart size={16} />} />
        <StatCard
          label="Pending orders"
          value={pending}
          hint="Awaiting confirmation"
          icon={<AlertTriangle size={16} />}
          tone="warning"
        />
        <StatCard label="New inquiries" value={newInquiryCount} icon={<Inbox size={16} />} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {quickActions.map(({ href, label, hint, icon: Icon }) => (
          <Link key={href} href={href} className="group">
            <Card className="h-full p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/35 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <span className="grid size-9 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-105">
                  <Icon size={16} />
                </span>
                <ArrowUpRight size={14} className="text-subtle transition-colors group-hover:text-accent" />
              </div>
              <p className="mt-4 text-sm font-medium">{label}</p>
              <p className="mt-1 text-xs text-subtle">{hint}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(17rem,0.85fr)]">
        <Panel
          title="Recent orders"
          action={
            <Link href="/admin/orders" className="text-xs text-muted transition-colors hover:text-accent sm:text-sm">
              View all →
            </Link>
          }
          icon={<ShoppingCart size={14} className="text-accent" />}
        >
          <ul className="divide-y divide-white/[0.05] sm:hidden">
            {recentOrders.map((o) => (
              <li key={o.id} className="px-4 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/admin/orders/${o.id}`} className="font-mono text-sm text-accent">
                      {o.number}
                    </Link>
                    <p className="mt-0.5 truncate text-sm text-fg">{o.customerName}</p>
                    <p className="mt-0.5 text-xs text-subtle">{formatDate(o.createdAt)}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <StatusBadge status={o.status} />
                    <p className="mt-2 font-mono text-sm tabular-nums">{formatPrice(o.total)}</p>
                  </div>
                </div>
              </li>
            ))}
            {recentOrders.length === 0 && <li className="px-4 py-8 text-center text-sm text-muted">No orders yet.</li>}
          </ul>

          <div className="hidden sm:block">
            <Table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link href={`/admin/orders/${o.id}`} className="font-mono text-accent transition-colors hover:text-fg">
                        {o.number}
                      </Link>
                      <p className="text-xs text-subtle">{formatDate(o.createdAt)}</p>
                    </td>
                    <td className="text-fg/90">{o.customerName}</td>
                    <td>
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="text-right font-mono tabular-nums">{formatPrice(o.total)}</td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-muted">
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Panel>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 xl:gap-6">
          <Panel title="Low stock" icon={<Package size={14} className="text-warning" />}>
            <ul className="divide-y divide-white/[0.05] px-1">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 px-3 py-3 sm:px-4">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="line-clamp-2 text-sm leading-snug transition-colors hover:text-accent"
                  >
                    {p.name}
                  </Link>
                  <span
                    className={
                      p.stock === 0
                        ? "shrink-0 rounded-lg bg-danger/10 px-2 py-1 font-mono text-xs tabular-nums text-danger"
                        : "shrink-0 rounded-lg bg-warning/10 px-2 py-1 font-mono text-xs tabular-nums text-warning"
                    }
                  >
                    {p.stock}
                  </span>
                </li>
              ))}
              {lowStock.length === 0 && <li className="px-4 py-6 text-sm text-muted">All products well stocked.</li>}
            </ul>
          </Panel>

          <Panel
            title="New inquiries"
            action={
              <Link href="/admin/inquiries" className="text-xs text-muted transition-colors hover:text-accent sm:text-sm">
                Inbox →
              </Link>
            }
            icon={<Inbox size={14} className="text-accent" />}
          >
            <ul className="divide-y divide-white/[0.05]">
              {recentInquiries.map((i) => (
                <li key={i.id} className="px-4 py-3.5 sm:px-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">{i.name}</span>
                    <StatusBadge status={i.type} />
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">{i.message}</p>
                </li>
              ))}
              {recentInquiries.length === 0 && <li className="px-4 py-6 text-sm text-muted">Inbox zero.</li>}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Banknote,
  BookOpen,
  FileText,
  FolderTree,
  Inbox,
  Package,
  PackagePlus,
  ShoppingCart,
  Star,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { AdminCachePanel } from "@/components/admin/cache-status";
import { AdminHeader, Card, Panel, StatCard, StatusBadge, Table } from "@/components/admin/admin-ui";
import { requireAdmin } from "@/lib/auth/session";
import { formatDate, formatPrice } from "@/lib/utils";
import { getAdminOverview } from "@/server/queries/admin";

export const metadata = { title: "Overview" };

const launchpad: {
  href: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  badgeKey?: "orders" | "inquiries" | "reviews";
}[] = [
  { href: "/admin/orders", label: "Orders", hint: "Confirm & fulfill", icon: ShoppingCart, badgeKey: "orders" },
  { href: "/admin/products", label: "Products", hint: "Catalog & stock", icon: Package },
  { href: "/admin/products/new", label: "Add product", hint: "One-click new SKU", icon: PackagePlus },
  { href: "/admin/catalog", label: "Categories", hint: "Devices & taxonomy", icon: FolderTree },
  { href: "/admin/inquiries", label: "Inquiries", hint: "Customer inbox", icon: Inbox, badgeKey: "inquiries" },
  { href: "/admin/reviews", label: "Reviews", hint: "Moderate feedback", icon: Star, badgeKey: "reviews" },
  { href: "/admin/about", label: "About", hint: "Company page CMS", icon: BookOpen },
  { href: "/admin/installation", label: "Installation", hint: "Guide · images · video", icon: Wrench },
  { href: "/admin/content", label: "Content", hint: "Hero · home · policies", icon: FileText },
  { href: "/admin/team", label: "Team", hint: "Staff accounts", icon: Users },
];

export default async function AdminOverviewPage() {
  const session = await requireAdmin();
  const firstName = session.name.split(" ")[0] ?? session.name;
  const { badges, revenueTotal, orders30, lowStock, recentOrders, recentInquiries, cache } =
    await getAdminOverview();
  const { pendingOrders: pending, newInquiries: newInquiryCount, pendingReviews } = badges;

  const badgeMap = {
    orders: pending,
    inquiries: newInquiryCount,
    reviews: pendingReviews,
  };

  return (
    <div className="space-y-6 sm:space-y-7">
      <AdminHeader
        eyebrow="Command overview"
        title={`Welcome back, ${firstName}`}
        description="One click to every desk. Queues, stock and site content — built to feel instant."
        action={
          <Link
            href="/admin/orders"
            prefetch
            className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-2 text-sm text-fg transition-colors hover:border-accent/45 hover:bg-accent/15"
          >
            Review orders <ArrowUpRight size={14} />
          </Link>
        }
      />

      <AdminCachePanel status={cache.status} hit={cache.hit} cachedAt={cache.cachedAt} />

      <div className="flex flex-wrap gap-2">
        {[
          pending > 0 && { href: "/admin/orders", text: `${pending} pending orders` },
          newInquiryCount > 0 && { href: "/admin/inquiries", text: `${newInquiryCount} new inquiries` },
          pendingReviews > 0 && { href: "/admin/reviews", text: `${pendingReviews} reviews to approve` },
        ]
          .filter((item): item is { href: string; text: string } => Boolean(item))
          .map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className="rounded-full border border-warning/25 bg-warning/10 px-3 py-1 text-xs text-warning transition hover:border-warning/50"
            >
              {item.text}
            </Link>
          ))}
        {pending === 0 && newInquiryCount === 0 && pendingReviews === 0 && (
          <span className="rounded-full border border-success/25 bg-success/10 px-3 py-1 text-xs text-success">
            All queues clear
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Revenue (30d)" value={formatPrice(revenueTotal)} icon={<Banknote size={16} />} tone="accent" />
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

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium tracking-tight">Go anywhere</h2>
            <p className="mt-0.5 text-xs text-subtle">One click — every admin screen, prefetched.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
          {launchpad.map(({ href, label, hint, icon: Icon, badgeKey }) => {
            const count = badgeKey ? badgeMap[badgeKey] : 0;
            return (
              <Link key={href} href={href} prefetch className="group">
                <Card className="relative h-full p-3.5 transition-colors hover:border-accent/40 hover:bg-accent/[0.06] sm:p-4">
                  {count > 0 ? (
                    <span className="absolute right-2.5 top-2.5 grid min-w-[1.25rem] place-items-center rounded-full bg-accent/35 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-blue-50">
                      {count}
                    </span>
                  ) : (
                    <ArrowUpRight
                      size={13}
                      className="absolute right-2.5 top-2.5 text-subtle opacity-0 transition group-hover:opacity-100 group-hover:text-accent"
                    />
                  )}
                  <span className="grid size-8 place-items-center rounded-lg border border-accent/25 bg-accent/10 text-accent">
                    <Icon size={15} />
                  </span>
                  <p className="mt-3 text-sm font-medium leading-tight">{label}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-subtle">{hint}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid gap-4 lg:gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(17rem,0.85fr)]">
        <Panel
          title="Recent orders"
          action={
            <Link href="/admin/orders" prefetch className="text-xs text-muted transition-colors hover:text-accent sm:text-sm">
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
                    <Link href={`/admin/orders/${o.id}`} prefetch className="font-mono text-sm text-accent">
                      {o.number}
                    </Link>
                    <p className="mt-0.5 truncate text-sm text-fg">{o.customerName}</p>
                    <p className="mt-0.5 text-xs text-subtle">{formatDate(new Date(o.createdAt))}</p>
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
                      <Link href={`/admin/orders/${o.id}`} prefetch className="font-mono text-accent transition-colors hover:text-fg">
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

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 xl:gap-5">
          <Panel title="Low stock" icon={<Package size={14} className="text-warning" />}>
            <ul className="divide-y divide-white/[0.05] px-1">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 px-3 py-3 sm:px-4">
                  <Link
                    href={`/admin/products/${p.id}`}
                    prefetch
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
              <Link href="/admin/inquiries" prefetch className="text-xs text-muted transition-colors hover:text-accent sm:text-sm">
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

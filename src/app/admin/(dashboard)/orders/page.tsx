import Link from "next/link";
import { Search } from "lucide-react";
import { AdminHeader, Card, Panel, StatusBadge, Table } from "@/components/admin/admin-ui";
import { ReportActions } from "@/components/admin/report-actions";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/generated/prisma/enums";

export const metadata = { title: "Orders" };

const statuses: (OrderStatus | "ALL")[] = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

export default async function AdminOrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  await requireAdmin();
  const { status, q } = await searchParams;
  const active = statuses.includes(status as OrderStatus) ? (status as OrderStatus | "ALL") : "ALL";
  const query = typeof q === "string" ? q.trim() : "";

  const orders = await db.order.findMany({
    where: {
      ...(active !== "ALL" && { status: active }),
      ...(query && {
        OR: [
          { number: { contains: query, mode: "insensitive" } },
          { phone: { contains: query } },
          { email: { contains: query, mode: "insensitive" } },
          { customerName: { contains: query, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      number: true,
      customerName: true,
      phone: true,
      city: true,
      total: true,
      status: true,
      paymentMethod: true,
      paymentStatus: true,
      createdAt: true,
      _count: { select: { items: true } },
    },
  });

  const reportQuery = new URLSearchParams();
  if (active !== "ALL") reportQuery.set("status", active);
  if (query) reportQuery.set("q", query);
  const qs = reportQuery.toString();
  const htmlHref = `/admin/reports/orders${qs ? `?${qs}` : ""}`;
  const csvHref = `/admin/reports/orders?${qs ? `${qs}&` : ""}format=csv`;

  const pageTotal = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      <AdminHeader
        eyebrow="Commerce"
        title="Orders"
        description="Confirm, fulfil and track customer orders. Download a company-style register anytime."
        action={<ReportActions htmlHref={htmlHref} csvHref={csvHref} label="Order statement" />}
      />

      <Card className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4 sm:gap-4 sm:p-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-subtle">Showing</p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">{orders.length}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-subtle">Page total</p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">{formatPrice(pageTotal)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-subtle">Filter</p>
          <p className="mt-2 text-sm capitalize text-fg">{active.toLowerCase()}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-subtle">Search</p>
          <p className="mt-2 truncate text-sm text-fg">{query || "—"}</p>
        </div>
      </Card>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-2xl border border-white/[0.06] bg-white/[0.02] p-1">
          {statuses.map((s) => (
            <Link
              key={s}
              href={s === "ALL" ? "/admin/orders" : `/admin/orders?status=${s}`}
              className={cn(
                "shrink-0 rounded-xl px-3 py-1.5 text-xs capitalize transition-colors",
                s === active ? "bg-accent/20 text-fg shadow-[inset_0_0_0_1px_rgba(30,64,175,0.35)]" : "text-muted hover:text-fg",
              )}
            >
              {s.toLowerCase()}
            </Link>
          ))}
        </div>
        <form className="relative">
          {active !== "ALL" && <input type="hidden" name="status" value={active} />}
          <Search size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
          <input
            name="q"
            defaultValue={query}
            placeholder="Order #, phone, email…"
            className="h-10 w-full rounded-xl border border-white/10 bg-black/30 py-2 pl-9 pr-4 text-sm focus:border-accent/50 focus:outline-none md:w-72"
          />
        </form>
      </div>

      <Panel title="Order register" icon={<span className="font-mono text-[10px] text-accent">USD</span>}>
        <ul className="divide-y divide-white/[0.05] sm:hidden">
          {orders.map((o) => (
            <li key={o.id} className="px-4 py-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/admin/orders/${o.id}`} className="font-mono text-sm text-accent">
                    {o.number}
                  </Link>
                  <p className="mt-0.5 truncate text-sm">{o.customerName}</p>
                  <p className="mt-0.5 text-xs text-subtle">
                    {formatDate(o.createdAt)} · {o.city}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <StatusBadge status={o.status} />
                  <p className="mt-2 font-mono text-sm tabular-nums">{formatPrice(o.total)}</p>
                </div>
              </div>
            </li>
          ))}
          {orders.length === 0 && <li className="px-4 py-10 text-center text-sm text-muted">No orders found.</li>}
        </ul>

        <div className="hidden sm:block">
          <Table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Payment</th>
                <th>Status</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link href={`/admin/orders/${o.id}`} className="font-mono text-accent transition-colors hover:text-fg">
                      {o.number}
                    </Link>
                    <p className="text-xs text-subtle">
                      {formatDate(o.createdAt)} · {o._count.items} item(s)
                    </p>
                  </td>
                  <td>
                    <p className="text-fg/90">{o.customerName}</p>
                    <p className="text-xs text-subtle">
                      {o.phone} · {o.city}
                    </p>
                  </td>
                  <td>
                    <p className="text-xs uppercase tracking-wide text-muted">{o.paymentMethod}</p>
                    <div className="mt-1">
                      <StatusBadge status={o.paymentStatus} />
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="text-right font-mono tabular-nums">{formatPrice(o.total)}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-muted">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Panel>
    </div>
  );
}

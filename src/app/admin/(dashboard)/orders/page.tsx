import Link from "next/link";
import { AdminHeader, StatusBadge, Table } from "@/components/admin/admin-ui";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/generated/prisma/enums";

export const metadata = { title: "Orders" };

const statuses: (OrderStatus | "ALL")[] = ["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];

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
    select: { id: true, number: true, customerName: true, phone: true, city: true, total: true, status: true, paymentMethod: true, paymentStatus: true, createdAt: true, _count: { select: { items: true } } },
  });

  return (
    <>
      <AdminHeader title="Orders" description="Confirm, fulfil and track customer orders." />
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="no-scrollbar flex gap-1 overflow-x-auto">
          {statuses.map((s) => (
            <Link
              key={s}
              href={s === "ALL" ? "/admin/orders" : `/admin/orders?status=${s}`}
              className={cn("shrink-0 rounded-full px-3 py-1.5 text-xs", s === active ? "bg-white/10 text-fg" : "text-muted hover:text-fg")}
            >
              {s.toLowerCase()}
            </Link>
          ))}
        </div>
        <form>
          {active !== "ALL" && <input type="hidden" name="status" value={active} />}
          <input name="q" defaultValue={query} placeholder="Order #, phone, email…" className="h-10 w-full rounded-xl border border-line bg-surface-2 px-4 text-sm focus:border-accent/60 focus:outline-none md:w-72" />
        </form>
      </div>
      <Table>
        <thead>
          <tr><th>Order</th><th>Customer</th><th>Payment</th><th>Status</th><th className="text-right">Total</th></tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>
                <Link href={`/admin/orders/${o.id}`} className="font-mono text-accent hover:underline">{o.number}</Link>
                <p className="text-xs text-subtle">{formatDate(o.createdAt)} · {o._count.items} item(s)</p>
              </td>
              <td>
                <p>{o.customerName}</p>
                <p className="text-xs text-subtle">{o.phone} · {o.city}</p>
              </td>
              <td>
                <p className="text-xs">{o.paymentMethod}</p>
                <StatusBadge status={o.paymentStatus} />
              </td>
              <td><StatusBadge status={o.status} /></td>
              <td className="text-right font-mono">{formatPrice(o.total)}</td>
            </tr>
          ))}
          {orders.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-muted">No orders found.</td></tr>}
        </tbody>
      </Table>
    </>
  );
}

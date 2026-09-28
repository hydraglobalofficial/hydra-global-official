import Link from "next/link";
import { AlertTriangle, Banknote, Inbox, ShoppingCart } from "lucide-react";
import { AdminHeader, Card, StatCard, StatusBadge, Table } from "@/components/admin/admin-ui";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";

export const metadata = { title: "Overview" };

export default async function AdminOverviewPage() {
  const session = await requireAdmin();
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [revenue, orders30, pending, lowStock, recentOrders, recentInquiries] = await Promise.all([
    db.order.aggregate({ where: { createdAt: { gte: since }, status: { notIn: ["CANCELLED", "RETURNED"] } }, _sum: { total: true } }),
    db.order.count({ where: { createdAt: { gte: since } } }),
    db.order.count({ where: { status: "PENDING" } }),
    db.product.findMany({ where: { status: "ACTIVE", stock: { lt: 15 } }, select: { id: true, name: true, stock: true }, orderBy: { stock: "asc" }, take: 6 }),
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 8, select: { id: true, number: true, customerName: true, total: true, status: true, createdAt: true } }),
    db.inquiry.findMany({ where: { status: "NEW" }, orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, type: true, message: true, createdAt: true } }),
  ]);

  return (
    <>
      <AdminHeader title={`Welcome back, ${session.name.split(" ")[0]}`} description="Here's what's happening in the last 30 days." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue (30d)" value={formatPrice(revenue._sum.total ?? 0)} icon={<Banknote size={16} />} />
        <StatCard label="Orders (30d)" value={orders30} icon={<ShoppingCart size={16} />} />
        <StatCard label="Pending orders" value={pending} hint="Awaiting confirmation" icon={<AlertTriangle size={16} />} />
        <StatCard label="New inquiries" value={recentInquiries.length} icon={<Inbox size={16} />} />
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_22rem]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-medium">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm text-muted hover:text-fg">View all →</Link>
          </div>
          <Table>
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Status</th><th className="text-right">Total</th></tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link href={`/admin/orders/${o.id}`} className="font-mono text-accent hover:underline">{o.number}</Link>
                    <p className="text-xs text-subtle">{formatDate(o.createdAt)}</p>
                  </td>
                  <td>{o.customerName}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td className="text-right font-mono">{formatPrice(o.total)}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={4} className="text-center text-muted">No orders yet.</td></tr>
              )}
            </tbody>
          </Table>
        </section>

        <div className="space-y-8">
          <Card className="p-5">
            <h2 className="mb-4 flex items-center gap-2 font-medium"><AlertTriangle size={16} className="text-warning" /> Low stock</h2>
            <ul className="space-y-3 text-sm">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-4">
                  <Link href={`/admin/products/${p.id}`} className="line-clamp-1 hover:text-accent">{p.name}</Link>
                  <span className={p.stock === 0 ? "font-mono text-danger" : "font-mono text-warning"}>{p.stock}</span>
                </li>
              ))}
              {lowStock.length === 0 && <li className="text-muted">All products well stocked.</li>}
            </ul>
          </Card>
          <Card className="p-5">
            <h2 className="mb-4 font-medium">New inquiries</h2>
            <ul className="space-y-4 text-sm">
              {recentInquiries.map((i) => (
                <li key={i.id}>
                  <div className="flex items-center justify-between">
                    <span>{i.name}</span>
                    <StatusBadge status={i.type} />
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted">{i.message}</p>
                </li>
              ))}
              {recentInquiries.length === 0 && <li className="text-muted">Inbox zero.</li>}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}

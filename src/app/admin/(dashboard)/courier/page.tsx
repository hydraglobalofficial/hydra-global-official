import Link from "next/link";
import { Package, RefreshCw, Truck } from "lucide-react";
import { AdminHeader, Card, Panel, StatusBadge, Table } from "@/components/admin/admin-ui";
import { BookCourierButton, RefreshCourierButton } from "@/components/admin/courier-actions";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { getActiveCourierProviderId, isCourierReady, pathaoConfigStatus } from "@/lib/courier";
import { isSmtpReady } from "@/lib/mail/smtp";
import { formatDate, formatPrice } from "@/lib/utils";

export const metadata = { title: "Courier" };

export default async function AdminCourierPage() {
  await requireAdmin();

  const provider = getActiveCourierProviderId();
  const pathao = pathaoConfigStatus();
  const courierOk = isCourierReady();
  const smtpOk = isSmtpReady();

  const [booked, awaiting] = await Promise.all([
    db.order.findMany({
      where: { courierConsignmentId: { not: null } },
      orderBy: { courierBookedAt: "desc" },
      take: 80,
      include: {
        items: { select: { name: true, quantity: true, variantName: true } },
      },
    }),
    db.order.findMany({
      where: {
        status: { in: ["CONFIRMED", "PROCESSING", "SHIPPED"] },
        courierConsignmentId: null,
      },
      orderBy: { createdAt: "desc" },
      take: 40,
      include: {
        items: { select: { name: true, quantity: true, variantName: true } },
      },
    }),
  ]);

  const statusCounts = booked.reduce<Record<string, number>>((acc, o) => {
    const key = o.courierStatus || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <AdminHeader
        eyebrow="Fulfillment"
        title="Courier"
        description="Pathao shipments · live parcel status · invoice track links for customers."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-4 sm:p-5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-subtle">Provider</p>
          <p className="mt-1 text-lg font-semibold capitalize">{provider || "not set"}</p>
          <p className={`mt-1 text-xs ${courierOk ? "text-emerald-500" : "text-amber-500"}`}>
            {courierOk ? "API ready" : "Credentials incomplete"}
          </p>
        </Card>
        <Card className="p-4 sm:p-5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-subtle">In transit board</p>
          <p className="mt-1 text-lg font-semibold tabular-nums">{booked.length}</p>
          <p className="mt-1 text-xs text-muted">Booked with Pathao</p>
        </Card>
        <Card className="p-4 sm:p-5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-subtle">Needs booking</p>
          <p className="mt-1 text-lg font-semibold tabular-nums">{awaiting.length}</p>
          <p className="mt-1 text-xs text-muted">Confirmed, no consignment yet</p>
        </Card>
        <Card className="p-4 sm:p-5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-subtle">Invoice email</p>
          <p className={`mt-1 text-lg font-semibold ${smtpOk ? "text-emerald-500" : "text-amber-500"}`}>
            {smtpOk ? "SMTP ready" : "SMTP missing"}
          </p>
          <p className="mt-1 text-xs text-muted">Sent on order confirm</p>
        </Card>
      </div>

      {provider === "pathao" ? (
        <Card className="p-4 sm:p-5">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">Pathao setup</p>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Client ID", pathao.clientId],
              ["Client secret", pathao.clientSecret],
              ["Username (merchant email)", pathao.username],
              ["Password", pathao.password],
              ["Store ID", pathao.storeId],
              ["API host", true],
            ].map(([label, ok]) => (
              <li key={String(label)} className="flex items-center gap-2 text-sm">
                <span
                  className={`size-2 shrink-0 rounded-full ${ok ? "bg-emerald-500" : "bg-amber-500"}`}
                  aria-hidden
                />
                <span className="text-muted">{label}</span>
                <span className="ml-auto font-mono text-[11px] text-subtle">
                  {label === "API host" ? pathao.baseUrl.replace("https://", "") : ok ? "set" : "needed"}
                </span>
              </li>
            ))}
          </ul>
          {!pathao.username || !pathao.password ? (
            <p className="mt-3 text-sm text-amber-600 light:text-amber-700">
              Add <code className="font-mono text-xs">PATHAO_USERNAME</code> and{" "}
              <code className="font-mono text-xs">PATHAO_PASSWORD</code> (merchant panel login) plus{" "}
              <code className="font-mono text-xs">PATHAO_STORE_ID</code> in env, then restart the server.
            </p>
          ) : null}
        </Card>
      ) : null}

      {Object.keys(statusCounts).length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusCounts).map(([status, count]) => (
            <span
              key={status}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-xs"
            >
              <Truck size={12} className="text-accent" />
              {status}
              <span className="font-mono tabular-nums text-muted">{count}</span>
            </span>
          ))}
        </div>
      ) : null}

      <Panel title="Awaiting Pathao booking">
        {awaiting.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted">All confirmed orders are booked — nice.</p>
        ) : (
          <ul className="divide-y divide-line">
            {awaiting.map((o) => (
              <li key={o.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <Link href={`/admin/orders/${o.id}`} className="font-mono text-sm text-accent hover:text-fg">
                    {o.number}
                  </Link>
                  <p className="mt-1 text-sm text-muted">
                    {o.customerName} · {o.city} · {formatPrice(o.total)}
                  </p>
                  <p className="mt-1 truncate text-xs text-subtle">
                    {o.items.map((i) => `${i.name} ×${i.quantity}`).join(" · ")}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <StatusBadge status={o.status} />
                  <BookCourierButton orderId={o.id} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Courier board">
        {booked.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted">
            Confirm an order to book Pathao — consignments will show up here.
          </p>
        ) : (
          <>
            <ul className="divide-y divide-line sm:hidden">
              {booked.map((o) => (
                <li key={o.id} className="space-y-3 px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/admin/orders/${o.id}`} className="font-mono text-sm text-accent">
                        {o.number}
                      </Link>
                      <p className="mt-1 text-sm">{o.customerName}</p>
                      <p className="mt-0.5 text-xs text-muted">{o.city}</p>
                    </div>
                    <StatusBadge status={o.courierStatus || o.status} />
                  </div>
                  <p className="font-mono text-[11px] text-subtle">
                    {o.courierConsignmentId}
                    {o.courierLastSyncAt ? ` · synced ${formatDate(o.courierLastSyncAt)}` : ""}
                  </p>
                  <p className="text-xs text-muted">
                    <Package size={12} className="mr-1 inline" />
                    {o.items.map((i) => `${i.name} ×${i.quantity}`).join(" · ")}
                  </p>
                  <RefreshCourierButton orderId={o.id} />
                </li>
              ))}
            </ul>
            <div className="hidden sm:block">
              <Table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Products</th>
                    <th>Consignment</th>
                    <th>Courier status</th>
                    <th className="text-right">Sync</th>
                  </tr>
                </thead>
                <tbody>
                  {booked.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <Link href={`/admin/orders/${o.id}`} className="font-mono text-accent hover:text-fg">
                          {o.number}
                        </Link>
                        <p className="mt-0.5 text-[11px] text-subtle">{formatPrice(o.total)}</p>
                      </td>
                      <td>
                        <p className="text-sm">{o.customerName}</p>
                        <p className="text-xs text-muted">{o.city}</p>
                      </td>
                      <td className="max-w-[14rem] truncate text-xs text-muted">
                        {o.items.map((i) => `${i.name} ×${i.quantity}`).join(" · ")}
                      </td>
                      <td className="font-mono text-xs">{o.courierConsignmentId}</td>
                      <td>
                        <StatusBadge status={o.courierStatus || "—"} />
                      </td>
                      <td className="text-right">
                        <RefreshCourierButton orderId={o.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </>
        )}
      </Panel>

      <p className="flex items-center gap-2 text-xs text-subtle">
        <RefreshCw size={12} />
        Customers track via <code className="font-mono">/track?order=INVOICE_ID</code> from the invoice email.
      </p>
    </div>
  );
}

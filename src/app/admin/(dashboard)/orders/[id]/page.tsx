import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import { AdminHeader, Card, Panel, StatusBadge, Table } from "@/components/admin/admin-ui";
import { ReportActions } from "@/components/admin/report-actions";
import { OrderUpdateForm } from "@/components/admin/order-update-form";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";

export const metadata = { title: "Order" };

export default async function AdminOrderPage({ params }: PageProps<"/admin/orders/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: { items: { include: { product: { select: { slug: true } } } } },
  });
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
        <ArrowLeft size={14} /> Orders
      </Link>
      <AdminHeader
        eyebrow="Order detail"
        title={order.number}
        description={`Placed ${formatDate(order.createdAt)} · ${order.paymentMethod}`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={order.status} />
            <StatusBadge status={order.paymentStatus} />
            <ReportActions htmlHref={`/admin/reports/orders/${order.id}`} label="Invoice / statement" />
          </div>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_22rem] xl:gap-8">
        <div className="space-y-6">
          <Panel title="Line items">
            <Table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>SKU</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((i) => (
                  <tr key={i.id}>
                    <td>
                      <Link href={`/product/${i.product.slug}`} target="_blank" className="hover:text-accent">
                        {i.name}
                      </Link>
                      {i.variantName && <p className="text-xs text-subtle">{i.variantName}</p>}
                    </td>
                    <td className="font-mono text-xs text-muted">{i.sku}</td>
                    <td className="text-right font-mono tabular-nums">{i.quantity}</td>
                    <td className="text-right font-mono tabular-nums">{formatPrice(i.unitPrice)}</td>
                    <td className="text-right font-mono tabular-nums">{formatPrice(i.unitPrice * i.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Panel>

          <Card className="ml-auto max-w-sm space-y-2 p-5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="font-mono tabular-nums">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Shipping</span>
              <span className="font-mono tabular-nums">{formatPrice(order.shippingFee)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted">Discount</span>
                <span className="font-mono tabular-nums">-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-white/[0.08] pt-2 text-base">
              <span>Total</span>
              <span className="font-mono tabular-nums">{formatPrice(order.total)}</span>
            </div>
          </Card>

          <Card className="grid gap-4 p-5 text-sm md:grid-cols-3">
            <p className="flex items-start gap-2">
              <Phone size={14} className="mt-0.5 text-accent" />
              <a href={`tel:${order.phone}`}>{order.phone}</a>
            </p>
            <p className="flex items-start gap-2">
              <Mail size={14} className="mt-0.5 text-accent" />
              <a href={`mailto:${order.email}`} className="break-all">
                {order.email}
              </a>
            </p>
            <p className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0 text-accent" />
              {order.customerName}, {order.address}
              {order.area && `, ${order.area}`}, {order.city}
            </p>
            {order.notes && <p className="text-muted md:col-span-3">Note: {order.notes}</p>}
          </Card>
        </div>
        <Card className="h-fit p-5">
          <OrderUpdateForm
            id={order.id}
            status={order.status}
            paymentStatus={order.paymentStatus}
            fulfillmentNote={order.fulfillmentNote}
          />
        </Card>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { PackageSearch, Truck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/primitives";
import { db } from "@/lib/db";
import { trackCourierShipment } from "@/lib/courier";
import { formatDate, formatPrice } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Track order",
  description: "Check your HYDRA order status with your invoice ID (order number).",
  alternates: { canonical: "/track" },
  robots: { index: false },
};

const STATUS_STEPS = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Awaiting confirmation",
  CONFIRMED: "Confirmed",
  PROCESSING: "Preparing shipment",
  SHIPPED: "On the way",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
};

function stepIndex(status: string) {
  if (status === "CANCELLED" || status === "RETURNED") return -1;
  const i = STATUS_STEPS.indexOf(status as (typeof STATUS_STEPS)[number]);
  return i >= 0 ? i : 0;
}

export default async function TrackOrderPage({ searchParams }: PageProps<"/track">) {
  const params = await searchParams;
  const raw = typeof params.order === "string" ? params.order.trim() : "";
  const query = raw.toUpperCase();

  const order = query
    ? await db.order.findUnique({
        where: { number: query },
        select: {
          id: true,
          number: true,
          status: true,
          paymentMethod: true,
          paymentStatus: true,
          customerName: true,
          city: true,
          country: true,
          total: true,
          createdAt: true,
          fulfillmentNote: true,
          courierProvider: true,
          courierConsignmentId: true,
          courierStatus: true,
          courierBookedAt: true,
          courierLastSyncAt: true,
          items: { select: { name: true, variantName: true, quantity: true, unitPrice: true } },
        },
      })
    : null;

  let liveCourierStatus = order?.courierStatus ?? null;
  if (order?.courierConsignmentId) {
    const tracked = await trackCourierShipment(order.courierConsignmentId, order.courierProvider);
    if (!("error" in tracked)) {
      liveCourierStatus = tracked.status;
      if (tracked.status !== order.courierStatus) {
        await db.order.update({
          where: { id: order.id },
          data: { courierStatus: tracked.status, courierLastSyncAt: new Date() },
        });
      }
    }
  }

  const active = order ? stepIndex(order.status) : -1;
  const firstName = order?.customerName.trim().split(/\s+/)[0] || "there";

  return (
    <>
      <PageHeader
        eyebrow="Order tracking"
        title="Track your order"
        description="Enter the invoice ID from your confirmation email. Same ID is used for Pathao courier when we ship."
      />

      <section className="container-page max-w-2xl pb-16 sm:pb-20">
        <form action="/track" method="get" className="glass rounded-2xl p-5 sm:rounded-3xl sm:p-7">
          <label htmlFor="order" className="text-xs uppercase tracking-[0.18em] text-muted">
            Invoice ID / order number
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              id="order"
              name="order"
              defaultValue={raw}
              placeholder="e.g. HYD-260408-A1B2C3"
              autoComplete="off"
              spellCheck={false}
              className="min-h-12 flex-1 rounded-xl border border-line bg-black/20 px-4 font-mono text-sm tracking-wide outline-none ring-accent/40 placeholder:text-subtle focus:ring-2"
            />
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              <PackageSearch size={16} />
              Track
            </button>
          </div>
        </form>

        {raw && !order ? (
          <div className="mt-6 rounded-2xl border border-line p-5 text-sm text-muted sm:p-6">
            No order found for <span className="font-mono text-fg">{raw}</span>. Check the invoice ID in your email, or contact{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-accent underline-offset-2 hover:underline">
              {siteConfig.email}
            </a>
            .
          </div>
        ) : null}

        {order ? (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-line p-5 sm:rounded-3xl sm:p-7">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Hello, {firstName}</p>
              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">Order / Invoice ID</p>
                  <p className="mt-1 break-all font-mono text-lg tracking-wider sm:text-xl">{order.number}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">Order status</p>
                  <p className="mt-1 text-lg font-semibold text-accent">
                    {STATUS_LABEL[order.status] ?? order.status}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted">
                Placed {formatDate(order.createdAt)} · {formatPrice(order.total)} ·{" "}
                {order.paymentMethod === "COD" ? "Pay on delivery" : order.paymentMethod} · {order.city},{" "}
                {order.country}
              </p>
            </div>

            {order.courierConsignmentId || liveCourierStatus ? (
              <div className="rounded-2xl border border-accent/25 bg-accent/[0.06] p-5 sm:rounded-3xl sm:p-6">
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-accent">
                  <Truck size={14} />
                  Courier · {(order.courierProvider || "pathao").toUpperCase()}
                </p>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted">Where is my parcel?</p>
                    <p className="mt-1 text-xl font-semibold tracking-tight">
                      {liveCourierStatus || "Booked — awaiting pickup"}
                    </p>
                  </div>
                  {order.courierConsignmentId ? (
                    <div className="sm:text-right">
                      <p className="text-xs uppercase tracking-[0.14em] text-muted">Consignment</p>
                      <p className="mt-1 font-mono text-sm">{order.courierConsignmentId}</p>
                    </div>
                  ) : null}
                </div>
                {order.fulfillmentNote ? (
                  <p className="mt-3 text-sm text-muted">{order.fulfillmentNote}</p>
                ) : null}
              </div>
            ) : order.fulfillmentNote ? (
              <p className="flex items-start gap-2 rounded-2xl border border-line p-4 text-sm text-muted">
                <Truck size={16} className="mt-0.5 shrink-0 text-accent" />
                {order.fulfillmentNote}
              </p>
            ) : null}

            {active >= 0 ? (
              <ol className="grid gap-2 sm:grid-cols-5">
                {STATUS_STEPS.map((step, i) => {
                  const done = i <= active;
                  return (
                    <li
                      key={step}
                      className={`rounded-xl border px-3 py-3 text-center text-xs sm:text-[11px] ${
                        done ? "border-accent/40 bg-accent/10 text-fg" : "border-line text-subtle"
                      }`}
                    >
                      <span className="font-medium">{STATUS_LABEL[step]}</span>
                    </li>
                  );
                })}
              </ol>
            ) : null}

            <ul className="space-y-2 rounded-2xl border border-line p-5 text-sm sm:p-6">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex justify-between gap-3 text-muted">
                  <span className="min-w-0 break-words">
                    {item.name}
                    {item.variantName ? ` · ${item.variantName}` : ""}
                  </span>
                  <span className="shrink-0 font-mono">
                    ×{item.quantity} · {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/support" variant="outline" className="min-h-11 w-full sm:w-auto">
                Help center
              </ButtonLink>
              <ButtonLink href="/shop" className="min-h-11 w-full sm:w-auto">
                Continue shopping
              </ButtonLink>
            </div>
          </div>
        ) : null}

        {!raw ? (
          <p className="mt-6 text-center text-sm text-muted">
            Tip: your invoice ID looks like <span className="font-mono text-fg">HYD-YYMMDD-XXXXXX</span>. You can also open{" "}
            <Link href="/support" className="text-accent underline-offset-2 hover:underline">
              Support
            </Link>{" "}
            anytime.
          </p>
        ) : null}
      </section>
    </>
  );
}

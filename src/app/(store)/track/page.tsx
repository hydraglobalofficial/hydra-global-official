import type { Metadata } from "next";
import Link from "next/link";
import { PackageSearch, Truck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/primitives";
import { db } from "@/lib/db";
import { verifyOrderAccess } from "@/lib/order-access";
import { rateLimit } from "@/lib/rate-limit";
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

function emailsMatch(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export default async function TrackOrderPage({ searchParams }: PageProps<"/track">) {
  const params = await searchParams;
  const raw = typeof params.order === "string" ? params.order.trim() : "";
  const query = raw.toUpperCase();
  const token = typeof params.t === "string" ? params.t.trim() : "";
  const emailRaw = typeof params.email === "string" ? params.email.trim() : "";
  const attempted = Boolean(query);
  if (attempted) {
    const limited = await rateLimit("track", 10, 60_000);
    if (!limited.ok) {
      return (
        <PageHeader
          eyebrow="Order tracking"
          title="Track your order"
          description="Too many lookups. Wait a minute, then use the link from your confirmation email."
        />
      );
    }
  }

  // Never return an order on invoice ID alone — requires HMAC token (email link) or matching checkout email.
  const candidate = query
    ? await db.order.findUnique({
        where: { number: query },
        select: {
          id: true,
          number: true,
          email: true,
          status: true,
          paymentMethod: true,
          paymentStatus: true,
          customerName: true,
          city: true,
          country: true,
          total: true,
          createdAt: true,
          courierProvider: true,
          courierConsignmentId: true,
          courierStatus: true,
          items: { select: { name: true, variantName: true, quantity: true, unitPrice: true } },
        },
      })
    : null;

  const authorized =
    candidate &&
    (verifyOrderAccess(candidate.number, token || undefined) ||
      (emailRaw.length > 0 && emailsMatch(candidate.email, emailRaw)));

  const order = authorized ? candidate : null;
  // Generic failure — do not reveal whether the invoice ID exists.
  const notFound = attempted && !order;

  const active = order ? stepIndex(order.status) : -1;
  const firstName = order?.customerName.trim().split(/\s+/)[0] || "there";
  const courierStatus = order?.courierStatus ?? null;

  return (
    <>
      <PageHeader
        eyebrow="Order tracking"
        title="Track your order"
        description="Use the secure link from your confirmation email, or enter your invoice ID with the email used at checkout."
      />

      <section className="container-page max-w-2xl pb-16 sm:pb-20">
        <form action="/track" method="get" className="glass rounded-2xl p-5 sm:rounded-3xl sm:p-7">
          <label htmlFor="order" className="text-xs uppercase tracking-[0.18em] text-muted">
            Invoice ID / order number
          </label>
          <input
            id="order"
            name="order"
            defaultValue={raw}
            placeholder="e.g. HYD-260408-A1B2C3"
            autoComplete="off"
            spellCheck={false}
            required
            className="mt-3 min-h-12 w-full rounded-xl border border-line bg-black/20 px-4 font-mono text-sm tracking-wide outline-none ring-accent/40 placeholder:text-subtle focus:ring-2"
          />
          <label htmlFor="email" className="mt-4 block text-xs uppercase tracking-[0.18em] text-muted">
            Email used at checkout
          </label>
          <p className="mt-1 text-xs text-subtle">
            Required unless you open the track link from your invoice email (includes a secure token).
          </p>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={emailRaw}
            placeholder="you@example.com"
            autoComplete="email"
            className="mt-3 min-h-12 w-full rounded-xl border border-line bg-black/20 px-4 text-sm outline-none ring-accent/40 placeholder:text-subtle focus:ring-2"
          />
          {token ? <input type="hidden" name="t" value={token} /> : null}
          <button
            type="submit"
            className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-white transition hover:brightness-110 sm:w-auto"
          >
            <PackageSearch size={16} />
            Track
          </button>
        </form>

        {notFound ? (
          <div className="mt-6 rounded-2xl border border-line p-5 text-sm text-muted sm:p-6">
            We couldn&apos;t find an order with those details. Use the track link from your invoice email, or enter the
            exact invoice ID and checkout email. Need help?{" "}
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

            {order.courierConsignmentId || courierStatus ? (
              <div className="rounded-2xl border border-accent/25 bg-accent/[0.06] p-5 sm:rounded-3xl sm:p-6">
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-accent">
                  <Truck size={14} />
                  Courier · {(order.courierProvider || "pathao").toUpperCase()}
                </p>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted">Where is my parcel?</p>
                    <p className="mt-1 text-xl font-semibold tracking-tight">
                      {courierStatus || "Booked — awaiting pickup"}
                    </p>
                  </div>
                  {order.courierConsignmentId ? (
                    <div className="sm:text-right">
                      <p className="text-xs uppercase tracking-[0.14em] text-muted">Consignment</p>
                      <p className="mt-1 font-mono text-sm">{order.courierConsignmentId}</p>
                    </div>
                  ) : null}
                </div>
                <p className="mt-3 text-xs text-subtle">
                  Status updates when our team syncs courier, or via Pathao webhook — not on every page refresh.
                </p>
              </div>
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

        {!attempted ? (
          <p className="mt-6 text-center text-sm text-muted">
            Tip: open the track link in your invoice email, or enter invoice ID + checkout email. Need help?{" "}
            <Link href="/support" className="text-accent underline-offset-2 hover:underline">
              Support
            </Link>
            .
          </p>
        ) : null}
      </section>
    </>
  );
}

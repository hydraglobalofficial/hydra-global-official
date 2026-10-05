import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Package, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { ClearCart } from "@/components/cart/clear-cart";
import { OrderReadyAlert } from "@/components/checkout/order-ready-alert";
import { TrackEvent } from "@/components/analytics/track-event";
import { db } from "@/lib/db";
import { verifyOrderAccess } from "@/lib/order-access";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

export default async function CheckoutSuccessPage({ searchParams }: PageProps<"/checkout/success">) {
  const params = await searchParams;
  const number = params.order;
  const token = params.t;
  if (typeof number !== "string" || !verifyOrderAccess(number, typeof token === "string" ? token : undefined)) {
    notFound();
  }

  const order = await db.order.findUnique({
    where: { number },
    select: {
      number: true,
      customerName: true,
      total: true,
      shippingFee: true,
      paymentMethod: true,
      city: true,
      country: true,
      items: { select: { name: true, variantName: true, unitPrice: true, quantity: true } },
    },
  });
  if (!order) notFound();

  const firstName = order.customerName.trim().split(/\s+/)[0] || "there";

  return (
    <div className="container-page max-w-3xl py-20">
      <ClearCart />
      <OrderReadyAlert orderNumber={order.number} customerName={order.customerName} />
      <TrackEvent
        event="purchase"
        onceKey={`purchase.${order.number}`}
        payload={{
          transactionId: order.number,
          value: order.total,
          shipping: order.shippingFee,
          items: order.items.map((i) => ({
            name: i.name,
            variant: i.variantName,
            price: i.unitPrice,
            quantity: i.quantity,
          })),
        }}
      />
      <div className="text-center">
        <div className="relative mx-auto mb-8 grid size-20 place-items-center">
          <div className="absolute inset-0 rounded-full bg-success/30 blur-xl animate-pulse-glow" />
          <CheckCircle2 size={56} className="relative text-success" />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Thank you, {firstName}!</h1>
        <p className="mt-4 text-lg text-muted">Your order is confirmed. We&apos;ll call you shortly to confirm delivery details.</p>
      </div>

      <div className="glass mt-12 space-y-6 rounded-3xl p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Order number</p>
            <p className="mt-1 font-mono text-xl tracking-wider">{order.number}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              Total ({order.paymentMethod === "COD" ? "Pay on delivery" : order.paymentMethod})
            </p>
            <p className="mt-1 font-mono text-xl">{formatPrice(order.total)}</p>
          </div>
        </div>
        <ul className="space-y-2 border-t border-line pt-6 text-sm">
          {order.items.map((i, idx) => (
            <li key={idx} className="flex justify-between text-muted">
              <span>
                {i.name}
                {i.variantName && ` · ${i.variantName}`}
              </span>
              <span className="font-mono">×{i.quantity}</span>
            </li>
          ))}
        </ul>
        <div className="grid gap-4 border-t border-line pt-6 text-sm sm:grid-cols-2">
          <p className="flex items-center gap-3 text-muted">
            <Package size={16} className="text-accent" /> Estimated delivery{" "}
            {["Dhaka", "Chattogram", "Sylhet", "New York", "London", "Dubai", "Singapore", "Tokyo", "Sydney", "Toronto", "Berlin"].includes(
              order.city,
            ) || order.country === "Bangladesh"
              ? "2–4 business days"
              : "4–8 business days"}
          </p>
          <p className="flex items-center gap-3 text-muted">
            <Phone size={16} className="text-accent" /> Questions? {siteConfig.phone}
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/installation" variant="outline">
          View installation guide
        </ButtonLink>
        <ButtonLink href="/shop">Continue shopping</ButtonLink>
      </div>
    </div>
  );
}

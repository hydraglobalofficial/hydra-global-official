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
    <div className="container-page max-w-3xl py-12 sm:py-16 md:py-20">
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
        <div className="relative mx-auto mb-6 grid size-16 place-items-center sm:mb-8 sm:size-20">
          <div className="absolute inset-0 rounded-full bg-success/30 blur-xl animate-pulse-glow" />
          <CheckCircle2 size={48} className="relative text-success sm:size-14" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">Thank you, {firstName}!</h1>
        <p className="mt-3 text-base text-muted sm:mt-4 sm:text-lg">Your order is confirmed. We&apos;ll call you shortly to confirm delivery details.</p>
      </div>

      <div className="glass mt-8 space-y-5 rounded-2xl p-5 sm:mt-12 sm:space-y-6 sm:rounded-3xl sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Order number</p>
            <p className="mt-1 break-all font-mono text-lg tracking-wider sm:text-xl">{order.number}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              Total ({order.paymentMethod === "COD" ? "Pay on delivery" : order.paymentMethod})
            </p>
            <p className="mt-1 font-mono text-xl">{formatPrice(order.total)}</p>
          </div>
        </div>
        <ul className="space-y-2 border-t border-line pt-5 text-sm sm:pt-6">
          {order.items.map((i, idx) => (
            <li key={idx} className="flex justify-between gap-3 text-muted">
              <span className="min-w-0 break-words">
                {i.name}
                {i.variantName && ` · ${i.variantName}`}
              </span>
              <span className="shrink-0 font-mono">×{i.quantity}</span>
            </li>
          ))}
        </ul>
        <div className="grid gap-4 border-t border-line pt-5 text-sm sm:grid-cols-2 sm:pt-6">
          <p className="flex items-start gap-3 text-muted">
            <Package size={16} className="mt-0.5 shrink-0 text-accent" /> Estimated delivery{" "}
            {["Dhaka", "Chattogram", "Sylhet", "New York", "London", "Dubai", "Singapore", "Tokyo", "Sydney", "Toronto", "Berlin"].includes(
              order.city,
            ) || order.country === "Bangladesh"
              ? "2–4 business days"
              : "4–8 business days"}
          </p>
          <p className="flex items-start gap-3 text-muted">
            <Phone size={16} className="mt-0.5 shrink-0 text-accent" /> Questions? {siteConfig.phone}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:justify-center">
        <ButtonLink href="/installation" variant="outline" className="min-h-11 w-full sm:w-auto">
          View installation guide
        </ButtonLink>
        <ButtonLink href="/shop" className="min-h-11 w-full sm:w-auto">Continue shopping</ButtonLink>
      </div>
    </div>
  );
}

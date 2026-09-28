import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Package, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { ClearCart } from "@/components/cart/clear-cart";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

export default async function CheckoutSuccessPage({ searchParams }: PageProps<"/checkout/success">) {
  const { order: number } = await searchParams;
  if (typeof number !== "string") notFound();

  const order = await db.order.findUnique({
    where: { number },
    select: { number: true, customerName: true, total: true, paymentMethod: true, city: true, items: { select: { name: true, variantName: true, quantity: true } } },
  });
  if (!order) notFound();

  return (
    <div className="container-page max-w-3xl py-20">
      <ClearCart />
      <div className="text-center">
        <div className="relative mx-auto mb-8 grid size-20 place-items-center">
          <div className="absolute inset-0 rounded-full bg-success/30 blur-xl animate-pulse-glow" />
          <CheckCircle2 size={56} className="relative text-success" />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Thank you, {order.customerName.split(" ")[0]}!</h1>
        <p className="mt-4 text-lg text-muted">Your order is confirmed. We&apos;ll call you shortly to verify delivery details.</p>
      </div>

      <div className="glass mt-12 space-y-6 rounded-3xl p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Order number</p>
            <p className="mt-1 font-mono text-xl tracking-wider">{order.number}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Total ({order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod})</p>
            <p className="mt-1 font-mono text-xl">{formatPrice(order.total)}</p>
          </div>
        </div>
        <ul className="space-y-2 border-t border-line pt-6 text-sm">
          {order.items.map((i, idx) => (
            <li key={idx} className="flex justify-between text-muted">
              <span>{i.name}{i.variantName && ` · ${i.variantName}`}</span>
              <span className="font-mono">×{i.quantity}</span>
            </li>
          ))}
        </ul>
        <div className="grid gap-4 border-t border-line pt-6 text-sm sm:grid-cols-2">
          <p className="flex items-center gap-3 text-muted"><Package size={16} className="text-accent" /> Delivery in {order.city === "Dhaka" ? "24–48 hours" : "2–4 business days"}</p>
          <p className="flex items-center gap-3 text-muted"><Phone size={16} className="text-accent" /> Questions? {siteConfig.phone}</p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/installation" variant="outline">View installation guide</ButtonLink>
        <ButtonLink href="/shop">Continue shopping</ButtonLink>
      </div>
    </div>
  );
}

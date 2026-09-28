"use client";

import { useActionState, useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { ProductImage } from "@/components/product/product-image";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, FormMessage, Input, Select, Textarea } from "@/components/ui/form";
import { EmptyState } from "@/components/ui/primitives";
import { cities, paymentMethods, shippingFee } from "@/lib/pricing";
import { initialFormState } from "@/lib/validations";
import { cn, formatPrice } from "@/lib/utils";
import { placeOrder } from "@/server/actions/checkout";

export function CheckoutForm() {
  const { lines, subtotal, hydrated } = useCart();
  const [state, action, pending] = useActionState(placeOrder, initialFormState);
  const [city, setCity] = useState("Dhaka");
  const [payment, setPayment] = useState("COD");
  const errors = state.fieldErrors ?? {};
  const shipping = shippingFee(subtotal, city);

  if (!hydrated) return <div className="h-96 animate-pulse rounded-3xl bg-surface" />;
  if (lines.length === 0) {
    return <EmptyState title="Your cart is empty" description="Add something before checking out." action={<ButtonLink href="/shop">Shop now</ButtonLink>} />;
  }

  const payload = JSON.stringify(lines.map((l) => ({ productId: l.productId, variantId: l.variantId, quantity: l.quantity })));

  return (
    <form action={action} className="grid gap-10 lg:grid-cols-[1fr_26rem]" noValidate>
      <input type="hidden" name="lines" value={payload} />
      <div className="space-y-10">
        <section className="space-y-5">
          <h2 className="flex items-center gap-3 text-lg font-semibold">
            <span className="grid size-7 place-items-center rounded-full bg-accent/15 font-mono text-xs text-accent">1</span> Contact
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" htmlFor="customerName" error={errors.customerName}>
              <Input id="customerName" name="customerName" autoComplete="name" required aria-invalid={!!errors.customerName} />
            </Field>
            <Field label="Mobile number" htmlFor="phone" error={errors.phone}>
              <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="01XXXXXXXXX" required aria-invalid={!!errors.phone} />
            </Field>
            <Field label="Email" htmlFor="email" error={errors.email} className="sm:col-span-2" hint="Order confirmation and tracking will be sent here.">
              <Input id="email" name="email" type="email" autoComplete="email" required aria-invalid={!!errors.email} />
            </Field>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="flex items-center gap-3 text-lg font-semibold">
            <span className="grid size-7 place-items-center rounded-full bg-accent/15 font-mono text-xs text-accent">2</span> Delivery
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="City" htmlFor="city" error={errors.city}>
              <Select id="city" name="city" value={city} onChange={(e) => setCity(e.target.value)}>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <Field label="Area / Thana" htmlFor="area" error={errors.area}>
              <Input id="area" name="area" placeholder="e.g. Gulshan 2" />
            </Field>
            <Field label="Full address" htmlFor="address" error={errors.address} className="sm:col-span-2">
              <Input id="address" name="address" autoComplete="street-address" placeholder="House, road, block" required aria-invalid={!!errors.address} />
            </Field>
            <Field label="Order notes (optional)" htmlFor="notes" className="sm:col-span-2">
              <Textarea id="notes" name="notes" className="min-h-20" placeholder="Landmark, delivery time preference…" />
            </Field>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="flex items-center gap-3 text-lg font-semibold">
            <span className="grid size-7 place-items-center rounded-full bg-accent/15 font-mono text-xs text-accent">3</span> Payment
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {paymentMethods.map((m) => (
              <label
                key={m.value}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all",
                  !m.enabled && "cursor-not-allowed opacity-40",
                  payment === m.value ? "border-accent bg-accent/5" : "border-line hover:border-line-strong",
                )}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={m.value}
                  checked={payment === m.value}
                  disabled={!m.enabled}
                  onChange={() => setPayment(m.value)}
                  className="mt-1 accent-[var(--color-accent)]"
                />
                <span>
                  <span className="block text-sm font-medium">{m.label}</span>
                  <span className="text-xs text-muted">{m.description}</span>
                </span>
              </label>
            ))}
          </div>
        </section>
      </div>

      <aside className="glass h-fit space-y-6 rounded-3xl p-6 lg:sticky lg:top-28">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <ul className="max-h-72 space-y-4 overflow-y-auto pr-1">
          {lines.map((l) => (
            <li key={`${l.productId}:${l.variantId}`} className="flex items-center gap-3">
              <span className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-line bg-surface-2">
                {l.image && <ProductImage src={l.image} alt={l.name} fill sizes="56px" className="object-contain p-1.5" />}
                <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-accent font-mono text-[10px] text-black">{l.quantity}</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="line-clamp-1 text-sm">{l.name}</span>
                {l.variantName && <span className="text-xs text-muted">{l.variantName}</span>}
              </span>
              <span className="font-mono text-sm tabular-nums">{formatPrice(l.price * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="space-y-3 border-t border-line pt-5 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="font-mono tabular-nums">{formatPrice(subtotal)}</dd></div>
          <div className="flex justify-between">
            <dt className="text-muted">Shipping ({city === "Dhaka" ? "inside" : "outside"} Dhaka)</dt>
            <dd className="font-mono tabular-nums">{shipping === 0 ? <span className="text-success">Free</span> : formatPrice(shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base">
            <dt className="font-medium">Total</dt>
            <dd className="font-mono text-xl tabular-nums">{formatPrice(subtotal + shipping)}</dd>
          </div>
        </dl>
        <FormMessage status={state.status} message={state.message} />
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? <Loader2 size={18} className="animate-spin" /> : <Lock size={16} />} Place order
        </Button>
        <p className="text-center text-xs text-subtle">Prices and stock are confirmed when you place the order.</p>
      </aside>
    </form>
  );
}

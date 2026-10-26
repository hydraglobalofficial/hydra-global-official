"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2, Lock, MapPin, Package, Truck, User } from "lucide-react";
import { track } from "@/lib/analytics";
import { useCart } from "@/components/cart/cart-provider";
import { ProductImage } from "@/components/product/product-image";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, FormMessage, Input, Select, Textarea } from "@/components/ui/form";
import { EmptyState } from "@/components/ui/primitives";
import { PhoneWithCountryCode } from "@/components/checkout/phone-with-country";
import { countries, paymentMethods, shippingFee } from "@/lib/pricing";
import { useShipping } from "@/components/shipping/shipping-provider";
import { initialFormState } from "@/lib/validations";
import { cn, formatPrice } from "@/lib/utils";
import { placeOrder } from "@/server/actions/checkout";

function SectionTitle({
  step,
  icon: Icon,
  title,
  subtitle,
}: {
  step: string;
  icon: typeof User;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3 sm:gap-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-2xl border border-accent/25 bg-accent/10 text-accent">
        <Icon size={18} />
      </span>
      <div className="min-w-0 pt-0.5">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">Step {step}</p>
        <h2 className="mt-0.5 text-lg font-semibold tracking-tight sm:text-xl">{title}</h2>
        <p className="mt-0.5 text-sm text-muted">{subtitle}</p>
      </div>
    </div>
  );
}

export function CheckoutForm() {
  const { lines, subtotal, hydrated } = useCart();
  const shippingSettings = useShipping();
  const [state, action, pending] = useActionState(placeOrder, initialFormState);
  const [country, setCountry] = useState("Bangladesh");
  const [city, setCity] = useState("");
  const [payment, setPayment] = useState("COD");
  const errors = state.fieldErrors ?? {};
  const shipping = shippingFee(subtotal, shippingSettings);

  const checkoutTracked = useRef(false);
  useEffect(() => {
    if (!hydrated || lines.length === 0 || checkoutTracked.current) return;
    checkoutTracked.current = true;
    track("begin_checkout", {
      items: lines.map((l) => ({
        id: l.productId,
        name: l.name,
        variant: l.variantName,
        price: l.price,
        quantity: l.quantity,
      })),
    });
  }, [hydrated, lines]);

  useEffect(() => {
    let cancelled = false;
    async function syncLoading() {
      const { alertClose, alertLoading } = await import("@/lib/swal");
      if (cancelled) return;
      if (pending) {
        void alertLoading("Placing your order…", "We're verifying your details and preparing everything.");
      } else {
        alertClose();
      }
    }
    void syncLoading();
    return () => {
      cancelled = true;
    };
  }, [pending]);

  if (!hydrated) return <div className="h-96 animate-pulse rounded-3xl bg-surface" />;
  if (lines.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add something before checking out."
        action={<ButtonLink href="/shop">Shop now</ButtonLink>}
      />
    );
  }

  const payload = JSON.stringify(
    lines.map((l) => ({ productId: l.productId, variantId: l.variantId, quantity: l.quantity })),
  );

  return (
    <form action={action} className="relative z-0 grid gap-8 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-10" noValidate>
      <input type="hidden" name="lines" value={payload} />

      <div className="min-w-0 overflow-hidden rounded-[1.35rem] border border-line bg-surface light:border-[#C5E0F3] light:bg-[#DCEEF9] sm:rounded-[1.75rem]">
        {/* 1 · Contact */}
        <section className="p-4 sm:p-7">
          <SectionTitle
            step="01"
            icon={User}
            title="Your details"
            subtitle="We’ll use these to confirm and deliver your order."
          />
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            <Field label="Full name" htmlFor="customerName" error={errors.customerName} required>
              <Input
                id="customerName"
                name="customerName"
                autoComplete="name"
                placeholder="As on your delivery label"
                required
                aria-invalid={!!errors.customerName}
              />
            </Field>
            <Field
              label="Contact number"
              htmlFor="phoneLocal"
              error={errors.phone}
              required
              hint="Country code defaults to Bangladesh (+880)"
            >
              <PhoneWithCountryCode country={country} error={!!errors.phone} />
            </Field>
            <Field
              label="Email address"
              htmlFor="email"
              error={errors.email}
              required
              className="sm:col-span-2"
              hint="Order confirmation and tracking land here."
            >
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                aria-invalid={!!errors.email}
              />
            </Field>
          </div>
        </section>

        {/* 2 · Delivery */}
        <section className="px-4 pb-4 pt-1 sm:px-7 sm:pb-7 sm:pt-2">
          <SectionTitle
            step="02"
            icon={MapPin}
            title="Delivery address"
            subtitle="Where should we send your HYDRA armor?"
          />
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            <Field label="Country" htmlFor="country" error={errors.country} required>
              <Select
                id="country"
                name="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                autoComplete="country-name"
                required
                aria-invalid={!!errors.country}
              >
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="City" htmlFor="city" error={errors.city} hint="Optional — helps with express routing">
              <Input
                id="city"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                autoComplete="address-level2"
                placeholder="e.g. Dhaka"
                aria-invalid={!!errors.city}
              />
            </Field>
            <Field label="District" htmlFor="area" error={errors.area} required>
              <Input
                id="area"
                name="area"
                autoComplete="address-level1"
                placeholder="e.g. Gulshan, Mirpur, Chattogram"
                required
                aria-invalid={!!errors.area}
              />
            </Field>
            <Field label="Zip / postal code" htmlFor="postalCode" error={errors.postalCode}>
              <Input
                id="postalCode"
                name="postalCode"
                autoComplete="postal-code"
                placeholder="e.g. 1212"
                inputMode="numeric"
                aria-invalid={!!errors.postalCode}
              />
            </Field>
            <Field
              label="Full address"
              htmlFor="address"
              error={errors.address}
              className="sm:col-span-2"
              hint="House, road, block, landmark — as detailed as you can"
            >
              <Textarea
                id="address"
                name="address"
                autoComplete="street-address"
                className="min-h-[5.5rem]"
                placeholder="House / flat, road, block, nearby landmark…"
                aria-invalid={!!errors.address}
              />
            </Field>
          </div>
        </section>

        {/* 3 · Instructions */}
        <section className="px-4 pb-4 pt-1 sm:px-7 sm:pb-7 sm:pt-2">
          <SectionTitle
            step="03"
            icon={Truck}
            title="Delivery instructions"
            subtitle="Anything the courier should know — optional."
          />
          <Field label="Instructions" htmlFor="notes" error={errors.notes}>
            <Textarea
              id="notes"
              name="notes"
              className="min-h-24"
              placeholder="Gate code, preferred delivery window, leave with security…"
            />
          </Field>
        </section>

        {/* 4 · Payment */}
        <section className="px-4 pb-4 pt-1 sm:px-7 sm:pb-7 sm:pt-2">
          <SectionTitle
            step="04"
            icon={Package}
            title="Payment"
            subtitle="Choose how you’d like to pay."
          />
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

      <aside className="h-fit space-y-5 rounded-[1.35rem] border border-line bg-surface p-5 light:border-[#C5E0F3] light:bg-[#DCEEF9] sm:space-y-6 sm:rounded-[1.75rem] sm:p-6 lg:sticky lg:top-28">
        <h2 className="text-lg font-semibold tracking-tight">Order summary</h2>
        <ul className="max-h-72 space-y-4 overflow-y-auto overscroll-contain pr-1">
          {lines.map((l) => (
            <li key={`${l.productId}:${l.variantId}`} className="flex items-center gap-3">
              <span className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-line bg-transparent">
                {l.image && (
                  <ProductImage src={l.image} alt={l.name} fill sizes="56px" className="object-contain p-1.5" />
                )}
                <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-accent font-mono text-[10px] text-black">
                  {l.quantity}
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="line-clamp-1 text-sm">{l.name}</span>
                {l.variantName && <span className="text-xs text-muted">{l.variantName}</span>}
              </span>
              <span className="shrink-0 font-mono text-sm tabular-nums">{formatPrice(l.price * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="space-y-3 border-t border-line pt-5 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Subtotal</dt>
            <dd className="font-mono tabular-nums">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="min-w-0 text-muted">Shipping</dt>
            <dd className="shrink-0 font-mono tabular-nums">{formatPrice(shipping)}</dd>
          </div>
          <div className="flex justify-between gap-3 border-t border-line pt-3 text-base">
            <dt className="font-medium">Total</dt>
            <dd className="font-mono text-xl tabular-nums">{formatPrice(subtotal + shipping)}</dd>
          </div>
        </dl>
        <FormMessage status={state.status} message={state.message} />
        <Button type="submit" size="lg" className="min-h-12 w-full" disabled={pending}>
          {pending ? <Loader2 size={18} className="animate-spin" /> : <Lock size={16} />} Place order
        </Button>
        <p className="pb-[env(safe-area-inset-bottom)] text-center text-xs text-subtle lg:pb-0">Prices and stock are confirmed when you place the order.</p>
      </aside>
    </form>
  );
}

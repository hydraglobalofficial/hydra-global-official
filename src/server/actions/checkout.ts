"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { withTransaction } from "@/lib/db";
import { checkoutSchema, invalid, type FormState } from "@/lib/validations";
import { isPaymentEnabled, shippingFee } from "@/lib/pricing";
import { getShippingContent } from "@/server/queries/content";
import { signOrderAccess } from "@/lib/order-access";
import { rateLimit } from "@/lib/rate-limit";
import { invalidateAdminCache } from "@/server/queries/admin";
import { CATALOG_TAG } from "@/server/queries/catalog";
import { Prisma } from "@/generated/prisma/client";

class CheckoutError extends Error {}

function orderNumber() {
  const d = new Date();
  const date = `${d.getFullYear() % 100}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `HYD-${date}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function placeOrder(_prev: FormState, formData: FormData): Promise<FormState> {
  const limited = await rateLimit("checkout", 3, 60_000);
  if (!limited.ok) return { status: "error", message: "Too many checkout attempts — wait a minute and try again." };

  let lines: unknown;
  try {
    lines = JSON.parse(String(formData.get("lines") ?? "[]"));
  } catch {
    return { status: "error", message: "Your cart could not be read. Please refresh and try again." };
  }

  const parsed = checkoutSchema.safeParse({ ...Object.fromEntries(formData), lines });
  if (!parsed.success) {
    return invalid(parsed.error);
  }
  const input = parsed.data;

  if (!isPaymentEnabled(input.paymentMethod)) {
    return { status: "error", message: "That payment method isn't available yet. Please choose Cash on Delivery." };
  }

  const shippingSettings = await getShippingContent();

  let number: string;
  try {
    number = await withTransaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: input.lines.map((l) => l.productId) }, status: "ACTIVE" },
        include: { variants: true },
      });
      const byId = new Map(products.map((p) => [p.id, p]));

      const items = input.lines.map((line) => {
        const product = byId.get(line.productId);
        if (!product) throw new CheckoutError("An item in your cart is no longer available.");
        const variant = line.variantId ? product.variants.find((v) => v.id === line.variantId) : null;
        if (line.variantId && !variant) throw new CheckoutError(`${product.name}: the selected option is unavailable.`);
        return {
          productId: product.id,
          variantId: variant?.id ?? null,
          name: product.name,
          variantName: variant?.name ?? null,
          sku: variant?.sku ?? product.sku,
          unitPrice: variant?.priceOverride ?? product.price,
          quantity: line.quantity,
        };
      });

      // Conditional decrements make overselling impossible under concurrency.
      for (const item of items) {
        const updated = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity }, soldCount: { increment: item.quantity } },
        });
        if (updated.count === 0) throw new CheckoutError(`${item.name} doesn't have enough stock left.`);
        if (item.variantId) {
          const v = await tx.productVariant.updateMany({
            where: { id: item.variantId, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });
          if (v.count === 0) throw new CheckoutError(`${item.name} (${item.variantName}) is out of stock.`);
        }
      }

      const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
      const city = input.city?.trim() || "";
      const shipping = shippingFee(subtotal, shippingSettings);
      const street =
        input.address?.trim() ||
        [input.area, city, input.country].filter(Boolean).join(", ");
      const order = await tx.order.create({
        data: {
          number: orderNumber(),
          paymentMethod: input.paymentMethod,
          customerName: input.customerName,
          email: input.email,
          phone: input.phone,
          address: street,
          country: input.country,
          city: city || input.country,
          area: input.area,
          postalCode: input.postalCode?.trim() || null,
          notes: input.notes || null,
          subtotal,
          shippingFee: shipping,
          total: subtotal + shipping,
          items: { create: items },
        },
      });
      return order.number;
    });
  } catch (error) {
    if (error instanceof CheckoutError) return { status: "error", message: error.message };
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2028") {
      console.error("[checkout] transaction start timeout", error);
      return {
        status: "error",
        message: "The store is busy right now. Please wait a moment and place the order again.",
      };
    }
    console.error("[checkout]", error);
    return { status: "error", message: "We couldn't place your order. Please try again." };
  }

  updateTag(CATALOG_TAG);
  // Don't block the redirect on cache wipe — fire-and-forget.
  void invalidateAdminCache();
  const access = signOrderAccess(number);
  redirect(`/checkout/success?order=${encodeURIComponent(number)}&t=${encodeURIComponent(access)}`);
}

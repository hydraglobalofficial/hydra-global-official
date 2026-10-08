import "server-only";
import { steadfastProvider } from "./steadfast";
import type {
  CourierProvider,
  CourierProviderId,
  CourierShipmentRequest,
  CourierShipmentResult,
} from "./types";

export type { CourierShipmentRequest, CourierShipmentResult, CourierProviderId };

const providers: Record<string, CourierProvider> = {
  steadfast: steadfastProvider,
};

function activeProvider(): CourierProvider | null {
  const id = (process.env.COURIER_PROVIDER || "").trim().toLowerCase();
  if (!id) return null;
  return providers[id] ?? null;
}

export function isCourierReady() {
  const p = activeProvider();
  return Boolean(p?.ready());
}

/**
 * Book a courier shipment using invoice UID (= order.number).
 * Safe no-op when COURIER_PROVIDER / API keys are unset.
 */
export async function createCourierShipment(
  input: CourierShipmentRequest,
): Promise<CourierShipmentResult | { ok: true; skipped: true; reason: string }> {
  const provider = activeProvider();
  if (!provider) {
    return {
      ok: true,
      skipped: true,
      reason: "COURIER_PROVIDER not set — courier booking skipped (scaffold ready).",
    };
  }
  if (!provider.ready()) {
    return {
      ok: true,
      skipped: true,
      reason: `${provider.id} credentials missing — booking skipped.`,
    };
  }
  return provider.createShipment(input);
}

/** Map a confirmed order-shaped object into courier request (invoice UID = order number). */
export function orderToCourierRequest(order: {
  id: string;
  number: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  area: string | null;
  city: string;
  postalCode: string | null;
  country: string;
  total: number;
  currency: string;
  notes: string | null;
  items: Array<{ name: string; quantity: number }>;
}): CourierShipmentRequest {
  const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);
  const itemSummary = order.items.map((i) => `${i.name} ×${i.quantity}`).join("; ");

  return {
    invoiceUid: order.number,
    merchantOrderId: order.id,
    customerName: order.customerName,
    phone: order.phone,
    email: order.email,
    address: order.address,
    area: order.area,
    city: order.city,
    postalCode: order.postalCode,
    country: order.country,
    codAmount: order.total,
    currency: order.currency,
    itemCount,
    itemSummary,
    notes: order.notes,
  };
}

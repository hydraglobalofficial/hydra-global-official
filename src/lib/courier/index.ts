import "server-only";
import { pathaoProvider, pathaoConfigStatus } from "./pathao";
import { steadfastProvider } from "./steadfast";
import type {
  CourierBookResult,
  CourierProvider,
  CourierProviderId,
  CourierShipmentRequest,
} from "./types";

export type {
  CourierBookResult,
  CourierShipmentRequest,
  CourierShipmentResult,
  CourierShipmentSkipped,
  CourierProviderId,
} from "./types";
export { pathaoConfigStatus };

const providers: Record<string, CourierProvider> = {
  pathao: pathaoProvider,
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

export function getActiveCourierProviderId(): CourierProviderId | null {
  const id = (process.env.COURIER_PROVIDER || "").trim().toLowerCase();
  if (!id) return null;
  if (id === "pathao" || id === "steadfast" || id === "redx" || id === "custom") return id;
  return null;
}

/**
 * Book a courier shipment using invoice UID (= order.number).
 * Safe no-op when COURIER_PROVIDER / API keys are unset.
 */
export async function createCourierShipment(input: CourierShipmentRequest): Promise<CourierBookResult> {
  const provider = activeProvider();
  if (!provider) {
    return {
      ok: true,
      skipped: true,
      reason: "COURIER_PROVIDER not set — courier booking skipped.",
    };
  }
  if (!provider.ready()) {
    return {
      ok: true,
      skipped: true,
      reason: `${provider.id} credentials incomplete — booking skipped.`,
    };
  }
  return provider.createShipment(input);
}

export async function trackCourierShipment(
  consignmentId: string,
  providerId?: string | null,
): Promise<{ status: string; raw?: unknown } | { error: string }> {
  const id = (providerId || process.env.COURIER_PROVIDER || "").trim().toLowerCase();
  const provider = providers[id] ?? activeProvider();
  if (!provider?.track) {
    return { error: "Tracking is not available for this courier provider." };
  }
  try {
    return await provider.track(consignmentId);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Track failed." };
  }
}

/** Map a confirmed order into courier request (invoice UID = order number). */
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
  paymentMethod: string;
  paymentStatus: string;
  items: Array<{ name: string; quantity: number }>;
}): CourierShipmentRequest {
  const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);
  const itemSummary = order.items.map((i) => `${i.name} ×${i.quantity}`).join("; ");
  const collectCod =
    order.paymentMethod === "COD" && order.paymentStatus !== "PAID" ? order.total : 0;

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
    codAmount: collectCod,
    currency: order.currency,
    itemCount,
    itemSummary,
    weightKg: Math.max(0.5, Math.min(10, itemCount * 0.2)),
    notes: order.notes,
  };
}

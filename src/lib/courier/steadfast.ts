import "server-only";
import type {
  CourierProvider,
  CourierShipmentRequest,
  CourierShipmentResult,
} from "./types";

/**
 * Steadfast Courier (Bangladesh) scaffold.
 * Env (add when you have keys — leave empty for now):
 *   COURIER_PROVIDER=steadfast
 *   STEADFAST_API_KEY=
 *   STEADFAST_SECRET_KEY=
 *   STEADFAST_BASE_URL=https://portal.packzy.com/api/v1
 *
 * Docs shape (create order): POST /create_order
 * Body fields commonly used: invoice, recipient_name, recipient_phone, recipient_address,
 *   cod_amount, note, item_description
 * invoice = our order.number (invoice UID).
 */
function steadfastReady() {
  return Boolean(
    process.env.STEADFAST_API_KEY?.trim() && process.env.STEADFAST_SECRET_KEY?.trim(),
  );
}

export const steadfastProvider: CourierProvider = {
  id: "steadfast",
  ready: steadfastReady,
  async createShipment(input: CourierShipmentRequest): Promise<CourierShipmentResult> {
    if (!steadfastReady()) {
      return {
        ok: false,
        provider: "steadfast",
        invoiceUid: input.invoiceUid,
        error: "STEADFAST_API_KEY / STEADFAST_SECRET_KEY not set.",
      };
    }

    const base = (process.env.STEADFAST_BASE_URL || "https://portal.packzy.com/api/v1").replace(
      /\/$/,
      "",
    );

    const body = {
      invoice: input.invoiceUid,
      recipient_name: input.customerName,
      recipient_phone: input.phone.replace(/[^\d+]/g, ""),
      recipient_address: [input.address, input.area, input.city, input.postalCode, input.country]
        .filter(Boolean)
        .join(", "),
      cod_amount: Number(input.codAmount.toFixed(2)),
      note: input.notes || undefined,
      item_description: input.itemSummary.slice(0, 250),
      total_lot: Math.max(1, input.itemCount),
    };

    try {
      const res = await fetch(`${base}/create_order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": process.env.STEADFAST_API_KEY!.trim(),
          "Secret-Key": process.env.STEADFAST_SECRET_KEY!.trim(),
        },
        body: JSON.stringify(body),
      });
      const raw = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (!res.ok) {
        return {
          ok: false,
          provider: "steadfast",
          invoiceUid: input.invoiceUid,
          raw,
          error: `Steadfast HTTP ${res.status}`,
        };
      }
      const consignment =
        (raw.consignment_id as string | number | undefined) ??
        ((raw.consignment as { consignment_id?: string | number } | undefined)?.consignment_id);
      return {
        ok: true,
        provider: "steadfast",
        invoiceUid: input.invoiceUid,
        consignmentId: consignment != null ? String(consignment) : undefined,
        raw,
      };
    } catch (error) {
      return {
        ok: false,
        provider: "steadfast",
        invoiceUid: input.invoiceUid,
        error: error instanceof Error ? error.message : "Steadfast request failed.",
      };
    }
  },
};

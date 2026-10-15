/**
 * Courier integration contract — fill COURIER_* env + implement a provider later.
 * Consignment / tracking reference MUST equal the HYDRA invoice UID (order.number).
 */

export type CourierProviderId = "pathao" | "steadfast" | "redx" | "custom";

export type CourierShipmentRequest = {
  /** Same as invoice UID / order.number — never invent a second ID. */
  invoiceUid: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  area?: string | null;
  city: string;
  postalCode?: string | null;
  country: string;
  /** Amount to collect on delivery in major currency units (USD for now). 0 if prepaid. */
  codAmount: number;
  currency: string;
  itemCount: number;
  itemSummary: string;
  weightKg?: number;
  notes?: string | null;
  merchantOrderId: string;
};

export type CourierShipmentResult =
  | {
      ok: true;
      provider: CourierProviderId;
      /** Provider's consignment / tracking number when booked. */
      consignmentId?: string;
      /** Echo of invoice UID for reconciliation. */
      invoiceUid: string;
      labelUrl?: string;
      raw?: unknown;
    }
  | {
      ok: false;
      provider: CourierProviderId;
      invoiceUid: string;
      error: string;
      raw?: unknown;
    };

/** Returned when courier env / credentials are missing — not an API failure. */
export type CourierShipmentSkipped = {
  ok: true;
  skipped: true;
  reason: string;
};

export type CourierBookResult = CourierShipmentResult | CourierShipmentSkipped;

export type CourierProvider = {
  id: CourierProviderId;
  ready(): boolean;
  createShipment(input: CourierShipmentRequest): Promise<CourierShipmentResult>;
  track?(consignmentId: string): Promise<{ status: string; raw?: unknown }>;
};

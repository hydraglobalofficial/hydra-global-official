import "server-only";
import type { InvoiceOrder } from "./types";

/** Prisma order (+ items) → invoice snapshot. Invoice UID = order.number. */
export function toInvoiceOrder(order: {
  number: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentRef: string | null;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  city: string;
  area: string | null;
  postalCode: string | null;
  notes: string | null;
  fulfillmentNote: string | null;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  createdAt: Date;
  items: Array<{
    name: string;
    variantName: string | null;
    sku: string;
    unitPrice: number;
    quantity: number;
  }>;
}): InvoiceOrder {
  return {
    number: order.number,
    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    paymentRef: order.paymentRef,
    customerName: order.customerName,
    email: order.email,
    phone: order.phone,
    address: order.address,
    country: order.country,
    city: order.city,
    area: order.area,
    postalCode: order.postalCode,
    notes: order.notes,
    fulfillmentNote: order.fulfillmentNote,
    subtotal: order.subtotal,
    shippingFee: order.shippingFee,
    discount: order.discount,
    total: order.total,
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
      name: item.name,
      variantName: item.variantName,
      sku: item.sku,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
    })),
  };
}

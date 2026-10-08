import "server-only";

/** Order snapshot used to render a professional sales invoice. */
export type InvoiceOrder = {
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
  items: {
    name: string;
    variantName: string | null;
    sku: string;
    unitPrice: number;
    quantity: number;
  }[];
};

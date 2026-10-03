export const CONSENT_KEY = "hydra.consent";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
  }
}

export type AnalyticsItem = {
  id?: string;
  name: string;
  price: number;
  quantity?: number;
  variant?: string | null;
};

export type AnalyticsPayload = {
  items?: AnalyticsItem[];
  value?: number;
  transactionId?: string;
  shipping?: number;
  searchTerm?: string;
  label?: string;
};

// GA4 recommended event names (for GTM) mapped to Meta Pixel standard events.
const pixelEvents = {
  view_item: "ViewContent",
  add_to_cart: "AddToCart",
  begin_checkout: "InitiateCheckout",
  purchase: "Purchase",
  search: "Search",
  generate_lead: "Lead",
  sign_up: "CompleteRegistration",
} as const;

export type AnalyticsEvent = keyof typeof pixelEvents;

const CURRENCY = "BDT";

export function hasAnalyticsConsent() {
  return typeof window !== "undefined" && localStorage.getItem(CONSENT_KEY) === "granted";
}

export function track(event: AnalyticsEvent, payload: AnalyticsPayload = {}) {
  if (!hasAnalyticsConsent()) return;
  const { items, transactionId, shipping, searchTerm, label } = payload;
  const value = payload.value ?? items?.reduce((sum, i) => sum + i.price * (i.quantity ?? 1), 0);

  window.dataLayer ??= [];
  if (items) window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event,
    ...(searchTerm && { search_term: searchTerm }),
    ...(label && { event_label: label }),
    ...(items && {
      ecommerce: {
        currency: CURRENCY,
        value,
        ...(transactionId && { transaction_id: transactionId }),
        ...(shipping !== undefined && { shipping }),
        items: items.map((i) => ({
          item_id: i.id,
          item_name: i.name,
          item_variant: i.variant ?? undefined,
          price: i.price,
          quantity: i.quantity ?? 1,
        })),
      },
    }),
  });

  window.fbq?.(
    "track",
    pixelEvents[event],
    {
      ...(searchTerm && { search_string: searchTerm }),
      ...(label && { content_name: label }),
      ...(items && {
        currency: CURRENCY,
        value,
        content_type: "product",
        content_ids: items.map((i) => i.id),
        contents: items.map((i) => ({ id: i.id, quantity: i.quantity ?? 1 })),
        num_items: items.reduce((n, i) => n + (i.quantity ?? 1), 0),
      }),
    },
    transactionId ? { eventID: transactionId } : undefined,
  );
}

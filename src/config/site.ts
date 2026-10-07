export const siteConfig = {
  name: "HYDRA",
  legalName: "HYDRA Global Ltd.",
  tagline: "Technology within reach",
  slogan: "Technology within reach",
  description:
    "HYDRA is a global mobile accessories brand for iPhone and Samsung Galaxy — screen protection, cases, camera armor and everyday essentials, engineered for a perfect fit and shipped worldwide.",
  email: "support@hydraglobal.com",
  phone: "+1 (415) 555-0147",
  address: "Global HQ · Shipping from regional hubs worldwide",
  hours: "Mon–Fri, 09:00–18:00 (local hub time)",
  /** Used for the live open/closed indicator. Days follow Date#getDay (0 = Sunday). */
  businessHours: { timeZone: "UTC", days: [1, 2, 3, 4, 5], open: 9, close: 18 },
  whatsapp: "14155550147",
  messenger: "https://m.me/hydraglobal",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=HYDRA+Global",
  currency: "USD",
  freeShippingThreshold: 80,
  /** Express = major hub cities; standard = everywhere else. */
  shippingFee: { express: 8, standard: 14 },
  social: {
    facebook: "https://facebook.com/hydraglobal",
    instagram: "https://instagram.com/hydraglobal",
    youtube: "https://youtube.com/@hydraglobal",
    tiktok: "https://tiktok.com/@hydraglobal",
  },
} as const;

/**
 * Internal legal identifiers for invoices / reports only — never render on the public storefront.
 * Public About company copy lives in the About CMS section.
 */
export const companyInfo = {
  legalForm: "Private Limited Company",
  incorporated: "2023",
  jurisdiction: "People's Republic of Bangladesh",
  registrationNo: "RJSC C-000000/2023",
  tradeLicense: "DNCC TRAD/000000/2023",
  tin: "000000000000",
  bin: "000000000-0101",
  registeredOffice: "Level 7, Gulshan Avenue, Dhaka 1212, Bangladesh",
} as const;

export type BrandSlug = "iphone" | "samsung";

export const brands: Record<BrandSlug, { label: string; enum: "APPLE" | "SAMSUNG"; blurb: string }> = {
  iphone: {
    label: "iPhone",
    enum: "APPLE",
    blurb: "Accessories cut to Apple's exact tolerances — from screen armor and cases to camera kits for iPhone 15 through the latest Pro Max.",
  },
  samsung: {
    label: "Samsung Galaxy",
    enum: "SAMSUNG",
    blurb: "Ultrasonic-fingerprint friendly glass, cases and camera armor for Galaxy S and Z series flagships.",
  },
};

export function isBrandSlug(value: string): value is BrandSlug {
  return value in brands;
}

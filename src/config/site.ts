export const siteConfig = {
  name: "HYDRA",
  legalName: "HYDRA Global",
  tagline: "Engineered protection for flagship phones.",
  description:
    "HYDRA makes precision screen protectors, privacy glass and camera armor for iPhone and Samsung Galaxy — with verified authenticity on every box.",
  email: "support@hydra.com.bd",
  phone: "+880 1700-000000",
  address: "Level 7, Gulshan Avenue, Dhaka 1212, Bangladesh",
  hours: "Sat–Thu, 10:00–20:00",
  currency: "BDT",
  freeShippingThreshold: 1500,
  shippingFee: { insideDhaka: 70, outsideDhaka: 130 },
  social: {
    facebook: "https://facebook.com/hydraglobal",
    instagram: "https://instagram.com/hydraglobal",
    youtube: "https://youtube.com/@hydraglobal",
    tiktok: "https://tiktok.com/@hydraglobal",
  },
} as const;

export type BrandSlug = "iphone" | "samsung";

export const brands: Record<BrandSlug, { label: string; enum: "APPLE" | "SAMSUNG"; blurb: string }> = {
  iphone: {
    label: "iPhone",
    enum: "APPLE",
    blurb: "Edge-to-edge armor cut to Apple's exact tolerances, from iPhone 15 to the latest Pro Max.",
  },
  samsung: {
    label: "Samsung Galaxy",
    enum: "SAMSUNG",
    blurb: "Ultrasonic-fingerprint compatible glass for Galaxy S and Z series flagships.",
  },
};

export function isBrandSlug(value: string): value is BrandSlug {
  return value in brands;
}

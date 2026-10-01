export const siteConfig = {
  name: "HYDRA",
  legalName: "HYDRA Global Ltd.",
  tagline: "Technology within reach",
  slogan: "Technology within reach",
  description:
    "HYDRA is a mobile accessories brand for iPhone and Samsung Galaxy — screen protection, cases, camera armor and everyday essentials, engineered for a perfect fit.",
  email: "support@hydra.com.bd",
  phone: "+880 1700-000000",
  address: "Level 7, Gulshan Avenue, Dhaka 1212, Bangladesh",
  hours: "Sat–Thu, 10:00–20:00",
  /** Used for the live open/closed indicator. Days follow Date#getDay (0 = Sunday). */
  businessHours: { timeZone: "Asia/Dhaka", days: [6, 0, 1, 2, 3, 4], open: 10, close: 20 },
  whatsapp: "8801700000000",
  messenger: "https://m.me/hydraglobal",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Gulshan+Avenue+Dhaka+1212",
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

/** Internal / partner use only — not shown on the public storefront. */
export const companyInfo = {
  legalForm: "Private Limited Company",
  incorporated: "2023",
  jurisdiction: "People's Republic of Bangladesh",
  registrationNo: "RJSC C-000000/2023",
  tradeLicense: "DNCC TRAD/000000/2023",
  tin: "000000000000",
  bin: "000000000-0101",
  registeredOffice: siteConfig.address,
} as const;

/** Add a YouTube video ID to embed it inline; without one the card links to `href`. */
export const showcaseVideos: { title: string; caption: string; duration: string; poster: string; youtubeId: string; href: string }[] = [
  {
    title: "Bubble-free install in 2 minutes",
    caption: "The alignment frame does the work — no skill needed.",
    duration: "Guide · 2 min",
    poster: "/products/glass-clear.jpg",
    youtubeId: "",
    href: "/installation",
  },
  {
    title: "Privacy glass, side by side",
    caption: "What your neighbour on the metro sees — nothing.",
    duration: "Demo · 1 min",
    poster: "/products/glass-privacy.jpg",
    youtubeId: "",
    href: "/shop?category=privacy-glass",
  },
  {
    title: "Camera armor drop test",
    caption: "Sapphire-coated rings versus a 2-meter fall.",
    duration: "Lab · 90 sec",
    poster: "/products/camera-lens.jpg",
    youtubeId: "",
    href: "/shop?category=camera-armor",
  },
];

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

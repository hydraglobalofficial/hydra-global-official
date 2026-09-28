export const siteConfig = {
  name: "HYDRA",
  legalName: "HYDRA Global",
  tagline: "Engineered protection for flagship phones.",
  description:
    "HYDRA makes precision screen protectors, privacy glass and camera armor for iPhone and Samsung Galaxy — engineered for a perfect, bubble-free fit.",
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

/** Add a YouTube video ID to embed it inline; without one the card links to `href`. */
export const showcaseVideos: { title: string; caption: string; duration: string; poster: string; youtubeId: string; href: string }[] = [
  {
    title: "Bubble-free install in 2 minutes",
    caption: "The alignment frame does the work — no skill needed.",
    duration: "Guide · 2 min",
    poster: "/products/glass-clear.svg",
    youtubeId: "",
    href: "/installation",
  },
  {
    title: "Privacy glass, side by side",
    caption: "What your neighbour on the metro sees — nothing.",
    duration: "Demo · 1 min",
    poster: "/products/glass-privacy.svg",
    youtubeId: "",
    href: "/shop?category=privacy-glass",
  },
  {
    title: "Camera armor drop test",
    caption: "Sapphire-coated rings versus a 2-meter fall.",
    duration: "Lab · 90 sec",
    poster: "/products/camera-lens.svg",
    youtubeId: "",
    href: "/shop?category=camera-armor",
  },
];

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

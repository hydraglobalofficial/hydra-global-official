export type AboutContent = {
  hero: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    description: string;
  };
  stats: { value: string; label: string }[];
  manifesto: { text: string; highlight: string[] };
  mission: { title: string; body: string; bullets: string[] };
  vision: { title: string; body: string; bullets: string[] };
  valuesIntro: { title: string; titleMuted: string; description: string };
  values: { title: string; keyword: string; text: string }[];
  divisions: { title: string; text: string; href: string }[];
  journey: { year: string; title: string; text: string; future?: boolean }[];
  careers: { title: string; text: string; cta: string };
  partner: { title: string; text: string; cta: string };
};

export type HowItWorksContent = {
  eyebrow: string;
  title: string;
  titleMuted: string;
  steps: { title: string; text: string }[];
};

export type NewsletterContent = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
};

export type CollectionsContent = {
  eyebrow: string;
  title: string;
  titleMuted: string;
  ctaLabel: string;
  ctaHref: string;
  /** First item is the large featured card; keep ~5 for the bento layout. */
  items: { slug: string; name: string; description: string; image: string }[];
};

export const defaultAboutContent: AboutContent = {
  hero: {
    eyebrow: "About HYDRA",
    title: "Mobile accessories",
    titleAccent: "within reach.",
    description:
      "HYDRA designs and delivers essentials for flagship phones — screen armor, cases, camera gear and everyday accessories — built on protection, precision and progression. Technology within reach.",
  },
  stats: [
    { value: "2023", label: "Founded in Dhaka" },
    { value: "50K+", label: "Devices equipped" },
    { value: "64", label: "Districts served" },
    { value: "18", label: "Flagship models" },
    { value: "4.9★", label: "Customer rating" },
  ],
  manifesto: {
    text: "We believe the most important device in your life deserves accessories that are engineered, not guessed. Genuine materials. Precise fit. Honest service. That is the HYDRA standard.",
    highlight: ["engineered", "Genuine", "Precise", "Honest", "HYDRA"],
  },
  mission: {
    title: "Our mission",
    body: "To make world-class mobile accessories affordable and accessible to every smartphone owner in Bangladesh.",
    bullets: [
      "Device-specific fit across protectors, cases and more",
      "Verified-genuine products at honest, published prices",
      "Real people on support, in all 64 districts",
    ],
  },
  vision: {
    title: "Our vision",
    body: "To become South Asia's most trusted mobile accessories brand — the name people choose first, and recommend without hesitation.",
    bullets: [
      "A partner network in every major city",
      "Expanding categories beyond the screen",
      "Accessories for every device you carry",
    ],
  },
  valuesIntro: {
    title: "Six principles.",
    titleMuted: "Zero compromise.",
    description:
      "They shape who we hire, what we build and how we treat every customer — from a single case to a full accessories kit.",
  },
  values: [
    {
      title: "Engineering first",
      keyword: "Precision",
      text: "Every product starts in CAD against real device scans — never a generic template. If it isn't cut to ±0.05 mm, it doesn't ship.",
    },
    {
      title: "Radical authenticity",
      keyword: "Genuine",
      text: "Sealed packaging and honest sourcing. What we say is inside is exactly what you get.",
    },
    {
      title: "Customer obsessed",
      keyword: "People",
      text: "A local team that answers personally, a 12-month warranty, and replacements dispatched within 24 hours.",
    },
    {
      title: "Integrity always",
      keyword: "Trust",
      text: "Honest pricing, VAT-compliant invoicing and no inflated claims. We would rather lose a sale than a customer's trust.",
    },
    {
      title: "Relentless innovation",
      keyword: "Progress",
      text: "Like the Hydra, we keep growing new heads — privacy layers, camera armor and coatings tested in our own lab.",
    },
    {
      title: "Responsible growth",
      keyword: "Future",
      text: "Recyclable packaging, fair local employment and partnerships that let small retailers across Bangladesh grow with us.",
    },
  ],
  divisions: [
    {
      title: "Retail & e-commerce",
      text: "Direct-to-customer sales through hydra.com.bd with cash on delivery nationwide.",
      href: "/shop",
    },
    {
      title: "Wholesale & distribution",
      text: "Trade pricing and priority stock for retailers and repair shops across Bangladesh.",
      href: "/contact?topic=wholesale#write",
    },
    {
      title: "After-sales & warranty",
      text: "Installation help, warranty claims and replacements handled by our own team.",
      href: "/support/warranty",
    },
  ],
  journey: [
    {
      year: "2023",
      title: "Founded in Dhaka",
      text: "Born out of too many cracked screens and too many fake accessories. HYDRA starts as a mobile accessories brand for Bangladesh.",
    },
    {
      year: "2024",
      title: "First iPhone line",
      text: "Tempered glass and early accessory kits for iPhone launch — 10,000 units in the first six months, mostly by word of mouth.",
    },
    {
      year: "2025",
      title: "Samsung lineup expands",
      text: "Galaxy S and Z series join the lineup, with sealed packaging and nationwide COD delivery.",
    },
    {
      year: "2026",
      title: "50,000+ devices equipped",
      text: "Screen armor, camera armor, cases and nationwide delivery to all 64 districts — with 24-hour dispatch inside Dhaka.",
    },
    {
      year: "Next",
      title: "Full accessories range",
      text: "Retail partner network and new categories — everyday essentials beyond the screen, engineered for flagships.",
      future: true,
    },
  ],
  careers: {
    title: "Build with HYDRA.",
    text: "We're growing across product, ops and customer experience in Dhaka.",
    cta: "View careers",
  },
  partner: {
    title: "Partner with HYDRA.",
    text: "Retailers and distributors — let's grow genuine mobile accessories together.",
    cta: "Start a partnership",
  },
};

export const defaultHowItWorksContent: HowItWorksContent = {
  eyebrow: "How it works",
  title: "From checkout to",
  titleMuted: "armored.",
  steps: [
    { title: "Pick your armor", text: "Choose your exact model and finish. Every cut is device-specific." },
    { title: "Fast delivery", text: "24–48 hours inside Dhaka, 2–4 days nationwide. Cash on delivery." },
    { title: "Install in 2 minutes", text: "Alignment frame and clean kit included. Bubble-free, first time." },
    { title: "Covered for a year", text: "12-month warranty plus one free replacement for accidental cracks." },
  ],
};

export const defaultNewsletterContent: NewsletterContent = {
  eyebrow: "Members only",
  title: "Join the",
  titleAccent: "HYDRA",
  description: "Launch drops, member pricing and early access to new devices. No spam, ever.",
};

export const defaultCollectionsContent: CollectionsContent = {
  eyebrow: "Shop by collection",
  title: "Armor for every",
  titleMuted: "device.",
  ctaLabel: "All products",
  ctaHref: "/shop",
  items: [
    {
      slug: "tempered-glass",
      name: "Tempered Glass",
      description: "Crystal-clear 9H armor with full-edge coverage.",
      image: "/products/glass-clear.jpg",
    },
    {
      slug: "privacy-glass",
      name: "Privacy Glass",
      description: "Blocks side views beyond 30° — your screen, your business.",
      image: "/products/glass-privacy.jpg",
    },
    {
      slug: "matte-glass",
      name: "Matte Glass",
      description: "Anti-glare, anti-fingerprint, paper-smooth feel.",
      image: "/products/glass-matte.jpg",
    },
    {
      slug: "camera-armor",
      name: "Camera Armor",
      description: "Sapphire-coated rings that protect every lens.",
      image: "/products/camera-lens.jpg",
    },
    {
      slug: "cases",
      name: "Cases",
      description: "Slim, drop-tested, MagSafe-ready protection.",
      image: "/products/case-clear.jpg",
    },
  ],
};

export const SITE_SECTION_META = [
  { key: "about", title: "About page", description: "Hero, stats, mission, values, journey and CTAs." },
  { key: "home.collections", title: "Home · Collections", description: "Shop-by-collection bento: heading, CTA and category cards." },
  { key: "home.howItWorks", title: "Home · How it works", description: "Checkout-to-armored steps on the homepage." },
  { key: "home.newsletter", title: "Home · Newsletter", description: "Members list signup block copy." },
] as const;

export type SiteSectionKey = (typeof SITE_SECTION_META)[number]["key"];

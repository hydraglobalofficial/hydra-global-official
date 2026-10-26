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
  /** Public company block — no registration / tax IDs in defaults. Admin controls show + rows. */
  company: {
    visible: boolean;
    eyebrow: string;
    title: string;
    titleMuted: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
    sheetTitle: string;
    sheetBadge: string;
    commitments: { title: string; text: string }[];
    /** Public fact rows only. Leave empty to hide the sheet. */
    facts: { label: string; value: string }[];
  };
  careers: { title: string; text: string; cta: string };
  partner: { title: string; text: string; cta: string };
};

export type HowItWorksContent = {
  eyebrow: string;
  title: string;
  titleMuted: string;
  steps: { title: string; text: string }[];
};

/** Homepage “Protection, re-engineered” — six photo cards. */
export type TechCard = {
  title: string;
  text: string;
  stat: string;
  /** Optional full-bleed background. Empty keeps the plain card. */
  image: string;
};

export type TechContent = {
  eyebrow: string;
  title: string;
  titleMuted: string;
  description: string;
  cards: TechCard[];
};

export type NewsletterContent = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
};

/** Floating WhatsApp chat button — staff photos rotate on the storefront. */
export type WhatsappWidgetContent = {
  enabled: boolean;
  /** Digits only (country code + number), e.g. 8801XXXXXXXXX */
  phone: string;
  /** Prefill text when the chat opens. */
  message: string;
  /** Seconds between staff photo swaps (2–8). */
  rotateSeconds: number;
  staff: { name: string; image: string }[];
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

/** Built-in stage visuals; `image` uses the slide's custom media URL. */
export type HeroVisualKey = "phone" | "glass" | "privacy" | "image";

export type HeroSlide = {
  key: string;
  brand: string;
  title: string;
  titleAccent: string;
  text: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  visual: HeroVisualKey;
  /** Used when visual is `image` (public path or allowlisted host). */
  image: string;
};

export type HomeHeroContent = {
  ratingLabel: string;
  quickLinks: { label: string; href: string }[];
  stats: { value: string; label: string }[];
  slides: HeroSlide[];
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
    { value: "2023", label: "Founded" },
    { value: "20K+", label: "Devices equipped" },
    { value: "40+", label: "Markets shipped" },
    { value: "18", label: "Flagship models" },
    { value: "4.9★", label: "Customer rating" },
  ],
  manifesto: {
    text: "We believe the most important device in your life deserves accessories that are engineered, not guessed. Genuine materials. Precise fit. Honest service. That is the HYDRA standard.",
    highlight: ["engineered", "Genuine", "Precise", "Honest", "HYDRA"],
  },
  mission: {
    title: "Our mission",
    body: "To make world-class mobile accessories affordable and accessible to every smartphone owner — wherever they are.",
    bullets: [
      "Device-specific fit across protectors, cases and more",
      "Verified-genuine products at honest, published prices",
      "Real people on support, across every region we ship",
    ],
  },
  vision: {
    title: "Our vision",
    body: "To become the world's most trusted mobile accessories brand — the name people choose first, and recommend without hesitation.",
    bullets: [
      "A partner network in every major market",
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
      text: "A real team that answers personally — installation help and replacements handled quickly when something isn't right.",
    },
    {
      title: "Integrity always",
      keyword: "Trust",
      text: "Honest pricing, clear invoicing and no inflated claims. We would rather lose a sale than a customer's trust.",
    },
    {
      title: "Relentless innovation",
      keyword: "Progress",
      text: "Like the Hydra, we keep growing new heads — privacy layers, camera armor and coatings tested in our own lab.",
    },
    {
      title: "Responsible growth",
      keyword: "Future",
      text: "Recyclable packaging, fair employment and partnerships that help retailers grow with us in every market we enter.",
    },
  ],
  divisions: [
    {
      title: "Retail & e-commerce",
      text: "Direct-to-customer sales online, with pay-on-delivery where available and worldwide shipping.",
      href: "/shop",
    },
    {
      title: "Wholesale & distribution",
      text: "Trade pricing and priority stock for retailers and repair shops worldwide.",
      href: "/contact?topic=wholesale#write",
    },
    {
      title: "After-sales support",
      text: "Installation help, returns and replacements handled by our own team.",
      href: "/support",
    },
  ],
  journey: [
    {
      year: "2023",
      title: "HYDRA launches",
      text: "Born out of too many cracked screens and too many fake accessories. HYDRA starts as a precision mobile accessories brand.",
    },
    {
      year: "2024",
      title: "First iPhone line",
      text: "Tempered glass and early accessory kits for iPhone launch — 10,000 units in the first six months, mostly by word of mouth.",
    },
    {
      year: "2025",
      title: "Samsung lineup expands",
      text: "Galaxy S and Z series join the lineup, with sealed packaging and reliable delivery across new markets.",
    },
    {
      year: "2026",
      title: "20,000+ devices equipped",
      text: "Screen armor, camera armor, cases — and shipping that reaches customers far beyond our first city.",
    },
    {
      year: "Next",
      title: "Full accessories range",
      text: "Global retail partners and new categories — everyday essentials beyond the screen, engineered for flagships.",
      future: true,
    },
  ],
  company: {
    visible: true,
    eyebrow: "Company information",
    title: "A registered company",
    titleMuted: "you can trust.",
    description:
      "HYDRA Global Ltd. designs and ships precision mobile accessories worldwide. Partners and corporate buyers can request a full company profile privately.",
    ctaLabel: "Request company profile",
    ctaHref: "/contact?topic=corporate#write",
    sheetTitle: "Company overview",
    sheetBadge: "Public",
    commitments: [
      { title: "Clear invoicing", text: "Official invoices available on request for every qualifying order." },
      { title: "Transparent delivery", text: "Published shipping rates — no surprise fees at the door." },
      { title: "Fair trade terms", text: "Written terms for wholesale and distribution partners." },
    ],
    facts: [
      { label: "Registered name", value: "HYDRA Global Ltd." },
      { label: "Legal form", value: "Private Limited Company" },
      { label: "Founded", value: "2023" },
      { label: "Focus", value: "Mobile accessories for flagship phones" },
    ],
  },
  careers: {
    title: "Build with HYDRA.",
    text: "We're growing across product, ops and customer experience worldwide.",
    cta: "View careers",
  },
  partner: {
    title: "Partner with HYDRA.",
    text: "Retailers and distributors — let's grow genuine mobile accessories together.",
    cta: "Start a partnership",
  },
};

export const defaultTechContent: TechContent = {
  eyebrow: "Engineering",
  title: "Protection,",
  titleMuted: "re-engineered.",
  description: "Every HYDRA protector is designed in-house and quality-checked batch by batch.",
  cards: [
    {
      title: "5-layer construction",
      text: "Anti-shatter film, tempered core, optical adhesive, AR coat and oleophobic top layer.",
      stat: "5 layers",
      image: "/products/glass-clear.jpg",
    },
    {
      title: "Impact absorption",
      text: "Drop-tested from 2 meters onto granite. Glass sacrifices itself — your screen doesn't.",
      stat: "2 m drop",
      image: "/products/glass-matte.jpg",
    },
    {
      title: "Ultrasonic ready",
      text: "Certified with in-display fingerprint readers on Galaxy S and iPhone Face ID sensors.",
      stat: "100% touch",
      image: "/products/glass-privacy.jpg",
    },
    {
      title: "Hydrophobic coat",
      text: "Water and oil bead off. Wipes clean with a single swipe.",
      stat: "110° contact",
      image: "/products/camera-lens.jpg",
    },
    {
      title: "Laser-cut precision",
      text: "±0.05mm tolerance ensures full coverage without case conflicts.",
      stat: "±0.05 mm",
      image: "/products/case-clear.jpg",
    },
    {
      title: "Dust-free install",
      text: "Alignment frame and clean-room kit included in every box.",
      stat: "2 min fit",
      image: "/products/box.jpg",
    },
  ],
};

export const defaultHowItWorksContent: HowItWorksContent = {
  eyebrow: "How it works",
  title: "From checkout to",
  titleMuted: "armored.",
  steps: [
    { title: "Pick your armor", text: "Choose your exact model and finish. Every cut is device-specific." },
    { title: "Ship worldwide", text: "Express hubs in 2–4 days; standard delivery elsewhere. Pay on delivery where available." },
    { title: "Install in 2 minutes", text: "Alignment frame and clean kit included. Bubble-free, first time." },
    { title: "We've got your back", text: "7-day returns on unopened items and clear support if something isn't right." },
  ],
};

export const defaultNewsletterContent: NewsletterContent = {
  eyebrow: "Members only",
  title: "Join the",
  titleAccent: "HYDRA",
  description: "Launch drops, member pricing and early access to new devices. No spam, ever.",
};

export const defaultWhatsappWidgetContent: WhatsappWidgetContent = {
  enabled: true,
  phone: "8801635992804",
  message: "Hi HYDRA! I have a question.",
  rotateSeconds: 3,
  /** Empty until admin uploads real staff photos — float stays hidden without them. */
  staff: [],
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

export const defaultHomeHeroContent: HomeHeroContent = {
  ratingLabel: "20,000+ owners · worldwide",
  quickLinks: [
    { label: "iPhone", href: "/shop/iphone" },
    { label: "Samsung", href: "/shop/samsung" },
    { label: "All products", href: "/shop" },
  ],
  stats: [
    { value: "9H+", label: "Hardness" },
    { value: "±0.05", label: "mm fit" },
    { value: "20k+", label: "Owners" },
  ],
  slides: [
    {
      key: "armor",
      brand: "HYDRA",
      title: "Technology",
      titleAccent: "within reach.",
      text: "Premium cases, screen armor and camera gear for iPhone & Galaxy — cut to fit, built to last.",
      primaryLabel: "Shop now",
      primaryHref: "/shop",
      secondaryLabel: "Our story",
      secondaryHref: "/about",
      visual: "phone",
      image: "",
    },
    {
      key: "clarity",
      brand: "Clarity glass",
      title: "Less glare.",
      titleAccent: "More clarity.",
      text: "Anti-reflective armor for outdoor readability — tuned for iPhone 17 and Galaxy S25.",
      primaryLabel: "Shop glass",
      primaryHref: "/shop?category=tempered-glass",
      secondaryLabel: "iPhone lineup",
      secondaryHref: "/shop/iphone",
      visual: "glass",
      image: "",
    },
    {
      key: "privacy",
      brand: "Privacy armor",
      title: "Your screen.",
      titleAccent: "Your business.",
      text: "Side views black out past 30° — privacy for the metro, office and every café seat.",
      primaryLabel: "Shop privacy",
      primaryHref: "/shop?category=privacy-glass",
      secondaryLabel: "Galaxy lineup",
      secondaryHref: "/shop/samsung",
      visual: "privacy",
      image: "",
    },
  ],
};

export type ShowcaseVideoItem = {
  title: string;
  caption: string;
  duration: string;
  poster: string;
  /** YouTube watch/share/embed URL only. Empty → card links to `href`. */
  videoUrl: string;
  href: string;
};

export type ShowcaseContent = {
  eyebrow: string;
  title: string;
  titleMuted: string;
  channelLabel: string;
  channelHref: string;
  videos: ShowcaseVideoItem[];
};

export const defaultShowcaseContent: ShowcaseContent = {
  eyebrow: "Watch & learn",
  title: "See HYDRA",
  titleMuted: "in action.",
  channelLabel: "YouTube channel",
  channelHref: "https://youtube.com/@hydraglobal",
  videos: [
    {
      title: "Bubble-free install in 2 minutes",
      caption: "The alignment frame does the work — no skill needed.",
      duration: "Guide · 2 min",
      poster: "/products/glass-clear.jpg",
      videoUrl: "",
      href: "/installation",
    },
    {
      title: "Privacy glass, side by side",
      caption: "What your neighbour on the train sees — nothing.",
      duration: "Demo · 1 min",
      poster: "/products/glass-privacy.jpg",
      videoUrl: "",
      href: "/shop?category=privacy-glass",
    },
    {
      title: "Camera armor drop test",
      caption: "Sapphire-coated rings versus a 2-meter fall.",
      duration: "Lab · 90 sec",
      poster: "/products/camera-lens.jpg",
      videoUrl: "",
      href: "/shop?category=camera-armor",
    },
  ],
};

/** Flat delivery charge chosen in admin. Free shows ৳0; paid shows the amount. */
export type ShippingContent = {
  mode: "free" | "paid";
  /** Whole currency units. Used only when mode is paid. */
  amount: number;
};

export const defaultShippingContent: ShippingContent = {
  mode: "paid",
  amount: 80,
};

/** Footer and contact social icons. Admin can replace each URL. */
export type SocialContent = {
  facebook: string;
  instagram: string;
  youtube: string;
  x: string;
};

export const defaultSocialContent: SocialContent = {
  facebook: "https://www.facebook.com/share/1C5gw1m8am/",
  instagram: "https://www.instagram.com/hydraglobalofficial?vrfl=YmVyeHQzbTcwcGU5",
  youtube: "https://youtube.com/@hydraglobalofficial?si=sJ3izB9ZTDj9wrxL",
  x: "https://x.com/hydragloballtd",
};

/** Homepage clarity slider. Empty images keep the built-in glass scene. */
export type ClarityContent = {
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
};

export const defaultClarityContent: ClarityContent = {
  beforeImage: "",
  afterImage: "",
  beforeLabel: "Ordinary glass",
  afterLabel: "HYDRA armor",
};

/** Photos scattered around the homepage 20,000+ block. */
export type ImpactPhoto = {
  url: string;
  alt: string;
};

export type ImpactContent = {
  images: ImpactPhoto[];
};

export const defaultImpactContent: ImpactContent = {
  images: [
    { url: "/products/glass-clear.jpg", alt: "HYDRA clear screen armor" },
    { url: "/products/glass-privacy.jpg", alt: "HYDRA privacy glass" },
    { url: "/products/glass-matte.jpg", alt: "HYDRA matte glass" },
    { url: "/products/camera-lens.jpg", alt: "HYDRA camera lens armor" },
    { url: "/products/case-clear.jpg", alt: "HYDRA clear case" },
    { url: "/products/box.jpg", alt: "HYDRA install kit" },
  ],
};

/** Four blocks under the homepage drop animation. */
export type ImpactLabCard = {
  value: string;
  label: string;
  image: string;
};

export type ImpactLabContent = {
  eyebrow: string;
  title: string;
  titleMuted: string;
  text: string;
  cards: ImpactLabCard[];
};

export const defaultImpactLabContent: ImpactLabContent = {
  eyebrow: "Impact lab",
  title: "Glass breaks.",
  titleMuted: "Your screen doesn't.",
  text: "HYDRA's sacrificial layer absorbs and spreads impact energy — so the protector takes the hit, not your display.",
  cards: [
    { value: "2 m", label: "Drop-tested onto granite", image: "" },
    { value: "9H+", label: "Surface hardness", image: "" },
    { value: "3.2×", label: "Stronger than standard glass", image: "" },
    { value: "100%", label: "Touch stays as it was", image: "" },
  ],
};

export const SITE_SECTION_META = [
  {
    key: "home.hero",
    title: "Home · Hero slider",
    description: "Homepage hero: slides, stage visuals/images, CTAs, quick links and bottom stats. Custom banner: 21:10 (1920×910).",
  },
  {
    key: "about",
    title: "About page",
    description: "Full About page: hero, company overview (show/hide + public facts), mission, values, journey and CTAs.",
  },
  { key: "home.collections", title: "Home · Collections", description: "Shop-by-collection bento: heading, CTA and category cards." },
  {
    key: "home.showcase",
    title: "Homepage video cards",
    description: "The video cards on the homepage. Each card has a poster image and a YouTube link.",
  },
  {
    key: "home.tech",
    title: "Protection, re-engineered",
    description: "The six homepage cards. Each one has its own background photo, title, text and small stat.",
  },
  { key: "home.howItWorks", title: "Home · How it works", description: "Checkout-to-armored steps on the homepage." },
  { key: "home.newsletter", title: "Home · Newsletter", description: "Members list signup block copy." },
  {
    key: "site.whatsapp",
    title: "WhatsApp float",
    description: "Right-side chat button: WhatsApp number, greeting, and rotating staff photos (admin uploads).",
  },
  {
    key: "site.social",
    title: "Social links",
    description: "Facebook, Instagram, YouTube and X icons in the footer and on the contact page.",
  },
  {
    key: "site.currency",
    title: "Currency & price format",
    description: "How product prices show on the store — Taka (৳), Dollar ($), Euro (€), or a custom symbol. Numbers stay the same; only the display changes.",
  },
  {
    key: "site.shipping",
    title: "Shipping charge",
    description: "One delivery fee for every order. Free shows ৳0. Paid shows the amount you set, added into the checkout and invoice total.",
  },
  {
    key: "home.clarity",
    title: "Home · Clarity you can feel",
    description: "The two photos in the homepage compare slider. Left is ordinary glass, right is HYDRA armor.",
  },
  {
    key: "home.impact",
    title: "20,000+ photos",
    description: "The photos around the big 20,000+ number on the homepage. Add them here. They sit in different spots around the number.",
  },
  {
    key: "home.impactLab",
    title: "Impact lab cards",
    description: "The four blocks under the Impact lab heading. On a phone they sit two by two. Change the words here.",
  },
  {
    key: "installation",
    title: "Installation guide",
    description: "One shared install flow for iPhone & Galaxy: hero copy, video, kit, animated steps (with images), troubleshooting.",
  },
] as const;

export type SiteSectionKey = (typeof SITE_SECTION_META)[number]["key"];

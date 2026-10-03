import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type DeviceBrand } from "../src/generated/prisma/client";
import {
  defaultAboutContent,
  defaultCollectionsContent,
  defaultHowItWorksContent,
  defaultNewsletterContent,
} from "../src/content/site-sections";

if (process.env.NODE_ENV === "production" && process.env.SEED_FORCE !== "1") {
  console.error("Refusing to reset a production database. Set SEED_FORCE=1 if you really mean it.");
  process.exit(1);
}

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

const slug = (s: string) =>
  s.toLowerCase().replace(/\+/g, " plus").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// ─── Taxonomy ────────────────────────────────────────────────────────────────

const categories = [
  { name: "Tempered Glass", slug: "tempered-glass", icon: "shield", description: "Crystal-clear 9H armor with full-edge coverage." },
  { name: "Privacy Glass", slug: "privacy-glass", icon: "eye-off", description: "Blocks side views beyond 30° — your screen, your business." },
  { name: "Matte Glass", slug: "matte-glass", icon: "sparkles", description: "Anti-glare, anti-fingerprint, paper-smooth feel." },
  { name: "Camera Armor", slug: "camera-armor", icon: "camera", description: "Sapphire-coated rings that protect every lens." },
  { name: "Cases", slug: "cases", icon: "layers", description: "Slim, drop-tested, MagSafe-ready protection." },
];

const devices: { brand: DeviceBrand; series: string; models: string[] }[] = [
  { brand: "APPLE", series: "iPhone 17", models: ["iPhone 17 Pro Max", "iPhone 17 Pro", "iPhone 17 Air", "iPhone 17"] },
  { brand: "APPLE", series: "iPhone 16", models: ["iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16 Plus", "iPhone 16"] },
  { brand: "APPLE", series: "iPhone 15", models: ["iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15"] },
  { brand: "SAMSUNG", series: "Galaxy S25", models: ["Galaxy S25 Ultra", "Galaxy S25+", "Galaxy S25"] },
  { brand: "SAMSUNG", series: "Galaxy S24", models: ["Galaxy S24 Ultra", "Galaxy S24"] },
  { brand: "SAMSUNG", series: "Galaxy Z", models: ["Galaxy Z Fold7", "Galaxy Z Flip7"] },
];

// ─── Products ────────────────────────────────────────────────────────────────

const glassSpecs = {
  Hardness: "9H+ (Mohs)",
  Thickness: "0.33 mm",
  Transparency: "99.9%",
  Coating: "Oleophobic nano-coat",
  Adhesive: "Full-glue, bubble-free",
  "In the box": "Glass, alignment frame, clean kit",
};

type Seed = {
  name: string;
  tagline: string;
  description: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  featured?: boolean;
  image: string;
  devices: string[];
  variants?: { name: string; stock: number; priceOverride?: number }[];
  highlights: string[];
  specs?: Record<string, string>;
  soldCount: number;
};

const products: Seed[] = [
  {
    name: "Armor Glass — iPhone 17 Pro Max",
    tagline: "Our flagship tempered glass, laser-cut for the 6.9\" display.",
    description:
      "Armor Glass is five precision layers fused into a 0.33 mm shield. It absorbs impact energy before it reaches your OLED, while the oleophobic nano-coating keeps it looking brand new.\n\nThe included alignment frame snaps onto your iPhone 17 Pro Max so the glass lands perfectly around the Dynamic Island every single time.",
    category: "tempered-glass",
    price: 1290,
    compareAtPrice: 1590,
    stock: 240,
    featured: true,
    image: "/products/glass-clear.jpg",
    devices: ["iPhone 17 Pro Max"],
    variants: [
      { name: "Clear", stock: 160 },
      { name: "Matte", stock: 80, priceOverride: 1390 },
    ],
    highlights: ["3.2× stronger than standard glass", "Case-friendly edge cut", "Face ID & True Tone safe", "Alignment frame included"],
    specs: glassSpecs,
    soldCount: 1840,
  },
  {
    name: "Armor Glass — iPhone 17 Pro",
    tagline: "Edge-to-edge clarity for the 6.3\" Pro display.",
    description: "The same five-layer Armor Glass construction, tuned for the iPhone 17 Pro's thinner bezels and Dynamic Island cut-out.\n\nInstalls in under two minutes with the alignment frame.",
    category: "tempered-glass",
    price: 1190,
    compareAtPrice: 1490,
    stock: 180,
    featured: true,
    image: "/products/glass-clear.jpg",
    devices: ["iPhone 17 Pro"],
    variants: [
      { name: "Clear", stock: 120 },
      { name: "Matte", stock: 60, priceOverride: 1290 },
    ],
    highlights: ["Five-layer impact core", "Oleophobic coating", "Bubble-free adhesive", "12-month warranty"],
    specs: glassSpecs,
    soldCount: 1320,
  },
  {
    name: "Armor Glass — iPhone 17 & 17 Air",
    tagline: "Featherweight protection for the thinnest iPhones yet.",
    description: "Designed for the iPhone 17 and the ultra-slim 17 Air — full coverage without adding bulk.",
    category: "tempered-glass",
    price: 1090,
    compareAtPrice: 1290,
    stock: 150,
    image: "/products/glass-clear.jpg",
    devices: ["iPhone 17", "iPhone 17 Air"],
    variants: [
      { name: "iPhone 17", stock: 90 },
      { name: "iPhone 17 Air", stock: 60 },
    ],
    highlights: ["Ultra-thin 0.33 mm", "Model-specific fit", "Anti-fingerprint", "Alignment frame included"],
    specs: glassSpecs,
    soldCount: 640,
  },
  {
    name: "Privacy Armor — iPhone 17 Pro Max",
    tagline: "Crystal clear to you. Pitch black to everyone else.",
    description:
      "Micro-louver privacy technology darkens the display beyond a 30° viewing angle, so your chats, banking apps and photos stay private on the bus, in the metro or at the office.\n\nBuilt on the same 9H Armor Glass core for uncompromised protection.",
    category: "privacy-glass",
    price: 1490,
    compareAtPrice: 1890,
    stock: 120,
    featured: true,
    image: "/products/glass-privacy.jpg",
    devices: ["iPhone 17 Pro Max"],
    highlights: ["30° two-way privacy", "9H Armor Glass core", "Face ID compatible", "Anti-glare finish"],
    specs: { ...glassSpecs, "Privacy angle": "30° (two-way)", Transparency: "90% (front)" },
    soldCount: 1105,
  },
  {
    name: "Privacy Armor — iPhone 16 Pro Series",
    tagline: "Privacy glass for iPhone 16 Pro and Pro Max.",
    description: "Two-way privacy filter with Armor Glass strength. Choose your exact model below.",
    category: "privacy-glass",
    price: 1390,
    compareAtPrice: 1690,
    stock: 95,
    image: "/products/glass-privacy.jpg",
    devices: ["iPhone 16 Pro", "iPhone 16 Pro Max"],
    variants: [
      { name: "iPhone 16 Pro", stock: 45 },
      { name: "iPhone 16 Pro Max", stock: 50 },
    ],
    highlights: ["30° two-way privacy", "Model-specific cut", "Easy install", "12-month warranty"],
    specs: { ...glassSpecs, "Privacy angle": "30° (two-way)" },
    soldCount: 720,
  },
  {
    name: "Armor Glass — iPhone 16 Series",
    tagline: "One glass, four perfect fits.",
    description: "Pick your iPhone 16 model — every size is individually laser-cut for full coverage.",
    category: "tempered-glass",
    price: 990,
    compareAtPrice: 1290,
    stock: 300,
    image: "/products/glass-clear.jpg",
    devices: ["iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max"],
    variants: [
      { name: "iPhone 16", stock: 70 },
      { name: "iPhone 16 Plus", stock: 60 },
      { name: "iPhone 16 Pro", stock: 80 },
      { name: "iPhone 16 Pro Max", stock: 90 },
    ],
    highlights: ["Model-specific fit", "9H hardness", "Oleophobic coating", "Case friendly"],
    specs: glassSpecs,
    soldCount: 2210,
  },
  {
    name: "Armor Glass — iPhone 15 Series",
    tagline: "Proven protection for iPhone 15 owners.",
    description: "Everything you love about Armor Glass, cut for the iPhone 15 family.",
    category: "tempered-glass",
    price: 890,
    compareAtPrice: 1090,
    stock: 200,
    image: "/products/glass-clear.jpg",
    devices: ["iPhone 15", "iPhone 15 Pro", "iPhone 15 Pro Max"],
    variants: [
      { name: "iPhone 15", stock: 60 },
      { name: "iPhone 15 Pro", stock: 70 },
      { name: "iPhone 15 Pro Max", stock: 70 },
    ],
    highlights: ["9H hardness", "Full-glue adhesive", "Alignment frame", "12-month warranty"],
    specs: glassSpecs,
    soldCount: 1560,
  },
  {
    name: "Lens Armor — iPhone 17 Pro / Pro Max",
    tagline: "Individual sapphire-coated rings for every lens.",
    description: "Aluminium rings with sapphire-coated optical glass protect each camera lens individually — no flare, no haze, no compromise on night mode.",
    category: "camera-armor",
    price: 690,
    compareAtPrice: 890,
    stock: 210,
    featured: true,
    image: "/products/camera-lens.jpg",
    devices: ["iPhone 17 Pro", "iPhone 17 Pro Max"],
    variants: [
      { name: "Titanium Black", stock: 90 },
      { name: "Natural Silver", stock: 70 },
      { name: "Cosmic Orange", stock: 50 },
    ],
    highlights: ["Zero flare optics", "Aerospace aluminium rings", "Night mode safe", "Install tool included"],
    specs: { Material: "Aluminium + sapphire-coated glass", Transmittance: "99.5%", Thickness: "0.4 mm" },
    soldCount: 980,
  },
  {
    name: "Lens Armor — iPhone 16 Pro / Pro Max",
    tagline: "Camera protection that looks factory-fitted.",
    description: "Colour-matched rings for the iPhone 16 Pro camera system.",
    category: "camera-armor",
    price: 590,
    compareAtPrice: 790,
    stock: 160,
    image: "/products/camera-lens.jpg",
    devices: ["iPhone 16 Pro", "iPhone 16 Pro Max"],
    variants: [
      { name: "Black Titanium", stock: 60 },
      { name: "Desert Titanium", stock: 50 },
      { name: "White Titanium", stock: 50 },
    ],
    highlights: ["Colour-matched", "Sapphire coating", "No flash interference", "Easy install"],
    specs: { Material: "Aluminium + sapphire-coated glass", Transmittance: "99.5%" },
    soldCount: 610,
  },
  {
    name: "MagSafe Clear Case — iPhone 17 Pro Max",
    tagline: "Crystal-clear, drop-tested, never yellows.",
    description: "Military-grade drop protection in a 1.2 mm clear shell with built-in N52 magnets for MagSafe charging and accessories. Anti-yellowing coating keeps it clear for years.",
    category: "cases",
    price: 1490,
    compareAtPrice: 1990,
    stock: 85,
    image: "/products/case-clear.jpg",
    devices: ["iPhone 17 Pro Max"],
    highlights: ["3 m drop tested", "N52 MagSafe magnets", "Anti-yellowing", "Raised camera lip"],
    specs: { Material: "TPU + polycarbonate", Weight: "32 g", "Drop test": "3 m (MIL-STD-810H)", MagSafe: "Yes" },
    soldCount: 430,
  },
  {
    name: "Ultra Armor Glass — Galaxy S25 Ultra",
    tagline: "Ultrasonic-fingerprint certified. Flat-edge perfect.",
    description:
      "Engineered for the Galaxy S25 Ultra's flat display with an ultrasonic-optimized adhesive, so your fingerprint unlock stays instant.\n\nIncludes our alignment frame and a UV-free installation — no lamps, no liquids.",
    category: "tempered-glass",
    price: 1390,
    compareAtPrice: 1790,
    stock: 190,
    featured: true,
    image: "/products/glass-clear.jpg",
    devices: ["Galaxy S25 Ultra"],
    variants: [
      { name: "Clear", stock: 130 },
      { name: "Matte", stock: 60, priceOverride: 1490 },
    ],
    highlights: ["Ultrasonic fingerprint certified", "S Pen compatible", "Flat-edge fit", "UV-free install"],
    specs: glassSpecs,
    soldCount: 1490,
  },
  {
    name: "Privacy Armor — Galaxy S25 Ultra",
    tagline: "Privacy glass that keeps fingerprint unlock flawless.",
    description: "Two-way privacy filter engineered around the S25 Ultra's ultrasonic sensor.",
    category: "privacy-glass",
    price: 1590,
    compareAtPrice: 1990,
    stock: 70,
    featured: true,
    image: "/products/glass-privacy.jpg",
    devices: ["Galaxy S25 Ultra"],
    highlights: ["30° two-way privacy", "Fingerprint certified", "S Pen compatible", "9H core"],
    specs: { ...glassSpecs, "Privacy angle": "30° (two-way)" },
    soldCount: 540,
  },
  {
    name: "Armor Glass — Galaxy S25 & S25+",
    tagline: "Precision glass for the compact Galaxy flagships.",
    description: "Choose your model for an exact fit with full fingerprint support.",
    category: "tempered-glass",
    price: 1090,
    compareAtPrice: 1390,
    stock: 140,
    image: "/products/glass-clear.jpg",
    devices: ["Galaxy S25", "Galaxy S25+"],
    variants: [
      { name: "Galaxy S25", stock: 70 },
      { name: "Galaxy S25+", stock: 70 },
    ],
    highlights: ["Fingerprint certified", "9H hardness", "Case friendly", "Alignment frame"],
    specs: glassSpecs,
    soldCount: 690,
  },
  {
    name: "Matte Armor — Galaxy S25 Ultra",
    tagline: "Paper-like feel for S Pen artists and outdoor readers.",
    description: "An etched anti-glare surface that eliminates reflections and fingerprints, with a paper-like drag that makes S Pen writing feel natural.",
    category: "matte-glass",
    price: 1490,
    compareAtPrice: 1790,
    stock: 60,
    image: "/products/glass-matte.jpg",
    devices: ["Galaxy S25 Ultra"],
    highlights: ["Zero glare outdoors", "Paper-like S Pen feel", "Fingerprint resistant", "Fingerprint certified"],
    specs: { ...glassSpecs, Finish: "AG etched matte", Transparency: "92%" },
    soldCount: 310,
  },
  {
    name: "Lens Armor — Galaxy S25 Ultra",
    tagline: "Individual lens rings for the 200MP camera system.",
    description: "Protect all five S25 Ultra lenses with colour-matched aluminium rings and sapphire-coated glass.",
    category: "camera-armor",
    price: 690,
    compareAtPrice: 890,
    stock: 130,
    image: "/products/camera-lens.jpg",
    devices: ["Galaxy S25 Ultra"],
    variants: [
      { name: "Titanium Black", stock: 60 },
      { name: "Titanium Silverblue", stock: 40 },
      { name: "Titanium Gray", stock: 30 },
    ],
    highlights: ["Zero flare optics", "Colour-matched", "100× zoom safe", "Install tool included"],
    specs: { Material: "Aluminium + sapphire-coated glass", Transmittance: "99.5%" },
    soldCount: 420,
  },
  {
    name: "Armor Glass — Galaxy S24 Ultra",
    tagline: "Still the benchmark for S24 Ultra owners.",
    description: "Our best-selling S24 Ultra protector with full fingerprint support.",
    category: "tempered-glass",
    price: 1190,
    compareAtPrice: 1490,
    stock: 8,
    image: "/products/glass-clear.jpg",
    devices: ["Galaxy S24 Ultra"],
    highlights: ["Fingerprint certified", "S Pen compatible", "9H hardness", "Alignment frame"],
    specs: glassSpecs,
    soldCount: 1750,
  },
  {
    name: "Hinge Armor Kit — Galaxy Z Fold7",
    tagline: "Front screen glass + hinge film for the Fold7.",
    description: "A complete protection kit for Galaxy Z Fold7: cover-screen Armor Glass and a self-healing hinge film.",
    category: "tempered-glass",
    price: 1990,
    compareAtPrice: 2490,
    stock: 0,
    image: "/products/glass-clear.jpg",
    devices: ["Galaxy Z Fold7"],
    highlights: ["Cover glass + hinge film", "Self-healing TPU", "Fold-tested 200k cycles", "Alignment frame"],
    specs: { ...glassSpecs, "Hinge film": "Self-healing TPU" },
    soldCount: 95,
  },
];

const reviewPool = [
  { authorName: "Tahmid R.", rating: 5, title: "Can't even tell it's there", comment: "Installed in two minutes with the frame. Zero bubbles, touch feels exactly like the bare screen." },
  { authorName: "Nusrat J.", rating: 5, title: "Survived a nasty drop", comment: "Dropped my phone on the stairs — the glass cracked but my screen is perfect. Ordered a replacement immediately." },
  { authorName: "Arif H.", rating: 4, title: "Great quality", comment: "Very clear and smooth. Took one star off because delivery to Sylhet took 4 days, but the product is excellent." },
  { authorName: "Sadia K.", rating: 5, title: "Genuine quality", comment: "Sealed box, perfect fit, zero bubbles. Much better than the cheap ones at the market." },
  { authorName: "Rakib M.", rating: 5, title: "Fingerprint works perfectly", comment: "Was worried about the fingerprint sensor but it works instantly after re-registering." },
  { authorName: "Farhana T.", rating: 4, title: "Solid", comment: "Good fit with my case, oleophobic coating is really good. Packaging feels premium too." },
];

// ─── Content ─────────────────────────────────────────────────────────────────

const pages = [
  {
    slug: "warranty",
    title: "Warranty",
    summary: "Every HYDRA product is covered for 12 months against manufacturing defects.",
    body: `## What's covered
- Edge lifting or peeling not caused by misuse
- Adhesive failure, dead touch zones or persistent bubbles
- Coating defects (oleophobic or anti-glare layer wearing unevenly)

## Accidental damage
Every screen protector includes **one free replacement** for accidental cracks within 30 days of delivery. After 30 days, replacements are available at 50% off.

## What's not covered
- Damage from improper installation after 48 hours
- Products bought from unauthorized sellers
- Normal wear such as micro-scratches after extended use

## How to claim
Submit a request through Contact Support with your order number and a clear photo of the issue. Approved claims are shipped within 24 hours inside Dhaka and 2–4 days elsewhere.`,
  },
  {
    slug: "returns",
    title: "Returns",
    summary: "Changed your mind? Return unopened products within 7 days.",
    body: `## 7-day returns
Unopened products in original packaging can be returned within **7 days** of delivery for a full refund.

## Wrong model?
If you ordered the wrong model and haven't opened the inner seal, we'll exchange it free of charge inside Dhaka.

## How it works
- Submit a return request via Contact Support
- We confirm eligibility within one business day
- Inside Dhaka we collect from your address; outside Dhaka we share courier instructions
- Refunds are issued within 5 business days to bKash, Nagad or your bank`,
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    summary: "How HYDRA collects, uses and protects your personal information.",
    body: `## Information we collect
- Contact details you provide at checkout: name, phone, email and delivery address
- Order history and support requests
- Anonymous analytics, only after you accept cookies

## How we use it
We use your information to fulfil orders, provide support, prevent counterfeiting and — only if you subscribe — send marketing emails.

## Sharing
We share delivery details with courier partners solely to deliver your order. We **never** sell your data.

## Your rights
You can request a copy or deletion of your data at any time by emailing support@hydra.com.bd.`,
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    summary: "The rules for using hydra.com.bd and purchasing HYDRA products.",
    body: `## Orders
All orders are subject to availability and confirmation. We may cancel orders with incorrect pricing or suspected fraud and will notify you immediately.

## Pricing
Prices are listed in Bangladeshi Taka (BDT) and include applicable VAT. Shipping fees are shown at checkout.

## Authorized sales
HYDRA products are sold only through hydra.com.bd and authorized resellers.

## Liability
HYDRA protectors reduce the risk of screen damage but cannot guarantee protection against every impact. Our liability is limited to the purchase price of the product.`,
  },
  {
    slug: "shipping-policy",
    title: "Shipping Policy",
    summary: "Delivery times, fees and coverage across Bangladesh.",
    body: `## Delivery times
- **Inside Dhaka:** 24–48 hours
- **Outside Dhaka:** 2–4 business days

## Fees
- Inside Dhaka: ৳70
- Outside Dhaka: ৳130
- **Free delivery** on orders over ৳1,500

## Cash on Delivery
COD is available nationwide. Please keep the exact amount ready to help our riders.

## Tracking
You'll receive an SMS with tracking details once your order ships.`,
  },
  {
    slug: "return-policy",
    title: "Return & Replacement Policy",
    summary: "Our commitment when something isn't right.",
    body: `## Returns
Unopened products may be returned within 7 days of delivery for a full refund.

## Replacements
Defective products are replaced free of charge within the 12-month warranty period. Accidental cracks within 30 days qualify for one free replacement.

## Condition
Returned items must include original packaging and tags in sellable condition.

## Refund method
Refunds are processed within 5 business days to your original payment method or bKash.`,
  },
];

const announcements = [
  { message: "Free delivery across Bangladesh on orders over ৳1,500", href: "/shop" },
  { message: "New: Privacy Armor for iPhone 17 Pro Max is here", href: "/product/privacy-armor-iphone-17-pro-max" },
  { message: "12-month warranty on every HYDRA protector", href: "/support/warranty" },
  { message: "Cash on delivery available across Bangladesh", href: null },
];

// ─── Run ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Resetting data…");
  await db.$transaction([
    db.orderItem.deleteMany(),
    db.order.deleteMany(),
    db.review.deleteMany(),
    db.productVariant.deleteMany(),
    db.productImage.deleteMany(),
    db.productDevice.deleteMany(),
    db.product.deleteMany(),
    db.device.deleteMany(),
    db.category.deleteMany(),
    db.inquiry.deleteMany(),
    db.subscriber.deleteMany(),
    db.announcement.deleteMany(),
    db.page.deleteMany(),
    db.siteSection.deleteMany(),
  ]);

  console.log("Seeding taxonomy…");
  const categoryIds = new Map<string, string>();
  for (const [i, c] of categories.entries()) {
    const row = await db.category.create({ data: { ...c, position: i } });
    categoryIds.set(c.slug, row.id);
  }

  const deviceIds = new Map<string, string>();
  for (const group of devices) {
    for (const [i, model] of group.models.entries()) {
      const row = await db.device.create({
        data: { brand: group.brand, series: group.series, model, slug: slug(model), position: deviceIds.size + i },
      });
      deviceIds.set(model, row.id);
    }
  }

  console.log("Seeding products…");
  const productIds: string[] = [];
  for (const [i, p] of products.entries()) {
    const reviews = reviewPool.slice(0, 2 + (i % 5));
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    const productSlug = slug(p.name);
    const sku = `HYD-${String(i + 1).padStart(3, "0")}`;

    const created = await db.product.create({
      data: {
        slug: productSlug,
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        sku,
        stock: p.variants ? p.variants.reduce((s, v) => s + v.stock, 0) : p.stock,
        featured: p.featured ?? false,
        status: "ACTIVE",
        highlights: p.highlights,
        specs: p.specs ?? {},
        soldCount: p.soldCount,
        ratingAverage: Math.round(avg * 10) / 10,
        ratingCount: reviews.length,
        categoryId: categoryIds.get(p.category)!,
        createdAt: new Date(Date.now() - (products.length - i) * 86_400_000),
        images: {
          create: [
            { url: p.image, alt: p.name, position: 0 },
            { url: "/products/box.jpg", alt: `${p.name} packaging`, position: 1 },
          ],
        },
        devices: { create: p.devices.map((m) => ({ deviceId: deviceIds.get(m)! })) },
        variants: p.variants
          ? { create: p.variants.map((v, j) => ({ ...v, sku: `${sku}-${j + 1}`, position: j })) }
          : undefined,
        reviews: {
          create: reviews.map((r, j) => ({
            ...r,
            verified: j % 3 !== 2,
            status: "APPROVED" as const,
            createdAt: new Date(Date.now() - (j + 1) * 5 * 86_400_000),
          })),
        },
      },
    });
    productIds.push(created.id);
  }

  await db.review.create({
    data: { productId: productIds[0], authorName: "Imran S.", rating: 5, comment: "Just installed, looks amazing. Will update after a month.", status: "PENDING" },
  });

  console.log("Seeding content…");
  await db.announcement.createMany({ data: announcements.map((a, i) => ({ ...a, position: i })) });
  await db.page.createMany({ data: pages });
  await db.siteSection.createMany({
    data: [
      { key: "about", title: "About page", data: defaultAboutContent },
      { key: "home.collections", title: "Home · Collections", data: defaultCollectionsContent },
      { key: "home.howItWorks", title: "Home · How it works", data: defaultHowItWorksContent },
      { key: "home.newsletter", title: "Home · Newsletter", data: defaultNewsletterContent },
    ],
  });

  console.log("Seeding sample orders & inquiries…");
  const sample = [
    { name: "Tahmid Rahman", phone: "01712345678", city: "Dhaka", status: "DELIVERED" as const, idx: 0, qty: 1 },
    { name: "Nusrat Jahan", phone: "01898765432", city: "Chattogram", status: "SHIPPED" as const, idx: 10, qty: 2 },
    { name: "Arif Hossain", phone: "01556677889", city: "Dhaka", status: "PENDING" as const, idx: 3, qty: 1 },
  ];
  for (const [i, o] of sample.entries()) {
    const p = products[o.idx];
    const subtotal = p.price * o.qty;
    const shipping = subtotal >= 1500 ? 0 : o.city === "Dhaka" ? 70 : 130;
    await db.order.create({
      data: {
        number: `HYD-260${920 + i}-S${i}A${i}B${i}`,
        status: o.status,
        paymentMethod: "COD",
        paymentStatus: o.status === "DELIVERED" ? "PAID" : "UNPAID",
        customerName: o.name,
        email: `${o.name.split(" ")[0].toLowerCase()}@example.com`,
        phone: o.phone,
        address: "House 12, Road 5",
        city: o.city,
        area: o.city === "Dhaka" ? "Dhanmondi" : "Agrabad",
        subtotal,
        shippingFee: shipping,
        total: subtotal + shipping,
        createdAt: new Date(Date.now() - (3 - i) * 86_400_000),
        items: { create: [{ productId: productIds[o.idx], name: p.name, sku: `HYD-${String(o.idx + 1).padStart(3, "0")}`, unitPrice: p.price, quantity: o.qty }] },
      },
    });
  }
  await db.inquiry.createMany({
    data: [
      { type: "WARRANTY", name: "Sadia Karim", email: "sadia@example.com", phone: "01911223344", orderNumber: "HYD-260920-S0A0B0", message: "The top-left corner of my glass started lifting after two weeks. Can I get a replacement?" },
      { type: "CONTACT", name: "Mahmud Traders", email: "mahmud@example.com", subject: "Wholesale", message: "We run three mobile shops in Uttara and would like to become an authorized reseller." },
    ],
  });

  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@hydra.com.bd";
  const username = (process.env.SEED_ADMIN_USERNAME ?? "owner").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe!2026";
  await db.user.upsert({
    where: { email },
    update: { username, passwordHash: await bcrypt.hash(password, 12) },
    create: {
      email,
      username,
      name: "HYDRA Owner",
      role: "OWNER",
      passwordHash: await bcrypt.hash(password, 12),
    },
  });

  console.log(`\n✔ Seed complete — ${products.length} products, ${deviceIds.size} devices.`);
  console.log(`  Admin: ${username} / ${email}  (password from SEED_ADMIN_PASSWORD)`);
  console.log(`  Editable sections: about, home.collections, home.howItWorks, home.newsletter`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

export type NavLink = { label: string; href: string; description?: string };

export const primaryNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Installation", href: "/installation" },
  { label: "Support", href: "/support" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const supportNav: NavLink[] = [
  { label: "Track order", href: "/track", description: "Status by invoice ID" },
  { label: "FAQ", href: "/support/faq", description: "Quick answers to common questions" },
  { label: "Contact Support", href: "/support/contact", description: "Talk to a real person" },
];

/** Brand shop links are injected at render from DB (see SiteFooter). */
export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "Search", href: "/search" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Track order", href: "/track" },
      { label: "FAQ", href: "/support/faq" },
      { label: "Installation", href: "/installation" },
      { label: "Contact Support", href: "/support/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About HYDRA", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy-policy" },
      { label: "Terms & Conditions", href: "/legal/terms" },
      { label: "Shipping & Delivery", href: "/legal/shipping-policy" },
      { label: "Returns & Refunds", href: "/legal/return-policy" },
    ],
  },
];

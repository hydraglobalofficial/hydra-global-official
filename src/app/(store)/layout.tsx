import { CartProvider } from "@/components/cart/cart-provider";
import { CartDrawer } from "@/components/cart/cart-drawer-lazy";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { AmbientBackground } from "@/components/layout/ambient-background";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { NewsletterPopup } from "@/components/layout/newsletter-popup-lazy";
import { WhatsappFloat } from "@/components/layout/whatsapp-float-lazy";
import { ScrollTopButton } from "@/components/layout/scroll-top-button-lazy";
import { ConsentAnalytics } from "@/components/analytics/consent-analytics-lazy";
import { MoneyProvider } from "@/components/money/money-provider";
import { bindMoneyFormat } from "@/lib/money";
import { ShippingProvider } from "@/components/shipping/shipping-provider";
import type { Metadata } from "next";
import { getAnnouncements, getCurrencyContent, getShippingContent, getSocialContent, getTrackingContent, getWhatsappWidgetContent } from "@/server/queries/content";
import { getBrands } from "@/server/queries/catalog";

export async function generateMetadata(): Promise<Metadata> {
  const tracking = await getTrackingContent();
  return {
    verification: {
      ...(tracking.googleVerification ? { google: tracking.googleVerification } : {}),
      ...(tracking.bingVerification ? { other: { "msvalidate.01": tracking.bingVerification } } : {}),
    },
  };
}

export default async function StoreLayout({ children }: LayoutProps<"/">) {
  const [announcements, whatsapp, brands, currency, shipping, social, tracking] = await Promise.all([
    getAnnouncements(),
    getWhatsappWidgetContent(),
    getBrands(),
    getCurrencyContent(),
    getShippingContent(),
    getSocialContent(),
    getTrackingContent(),
  ]);
  bindMoneyFormat(currency);

  return (
    <MoneyProvider format={currency}>
      <ShippingProvider value={shipping}>
      <CartProvider>
        <AmbientBackground />
        {tracking.gtmId && !tracking.requireConsent ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${tracking.gtmId}`}
              height="0"
              width="0"
              title="Google Tag Manager"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        {tracking.metaPixelId && !tracking.requireConsent ? (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height={1}
              width={1}
              alt=""
              src={`https://www.facebook.com/tr?id=${tracking.metaPixelId}&ev=PageView&noscript=1`}
              style={{ display: "none" }}
            />
          </noscript>
        ) : null}
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg">
          Skip to content
        </a>
        {/* Safe-area top lives on announcement when present; spacer when empty so chrome never kisses the notch */}
        {announcements.length === 0 ? <div aria-hidden className="h-[env(safe-area-inset-top,0px)] bg-bg" /> : null}
        <AnnouncementBar items={announcements} />
        <SiteHeader />
        <main id="main" className="min-w-0 flex-1 overflow-x-clip">
          {children}
        </main>
        <SiteFooter brands={brands} social={social} />
        {/* Fixed overlays — siblings of footer so position:fixed is not trapped */}
        {/* Fixed overlays — siblings so footer overflow cannot trap them */}
        <ScrollTopButton />
        <WhatsappFloat content={whatsapp} />
        <CartDrawer />
        <NewsletterPopup />
        <ConsentAnalytics tracking={tracking} />
      </CartProvider>
      </ShippingProvider>
    </MoneyProvider>
  );
}

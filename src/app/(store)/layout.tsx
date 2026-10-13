import { CartProvider } from "@/components/cart/cart-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { AmbientBackground } from "@/components/layout/ambient-background";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SplashScreen } from "@/components/layout/splash-screen-lazy";
import { NewsletterPopup } from "@/components/layout/newsletter-popup";
import { WhatsappFloat } from "@/components/layout/whatsapp-float";
import { ScrollTopButton } from "@/components/layout/scroll-top-button";
import { ConsentAnalytics } from "@/components/analytics/consent-analytics";
import { getAnnouncements, getWhatsappWidgetContent } from "@/server/queries/content";
import { getBrands } from "@/server/queries/catalog";

export default async function StoreLayout({ children }: LayoutProps<"/">) {
  const [announcements, whatsapp, brands] = await Promise.all([
    getAnnouncements(),
    getWhatsappWidgetContent(),
    getBrands(),
  ]);

  return (
    <CartProvider>
      <AmbientBackground />
      <SplashScreen />
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
      <SiteFooter brands={brands} />
      {/* Fixed overlays — siblings of footer so position:fixed is not trapped */}
      {/* Fixed overlays — siblings so footer overflow cannot trap them */}
      <ScrollTopButton />
      <WhatsappFloat content={whatsapp} />
      <CartDrawer />
      <NewsletterPopup />
      <ConsentAnalytics />
    </CartProvider>
  );
}

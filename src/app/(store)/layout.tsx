import { CartProvider } from "@/components/cart/cart-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { AmbientBackground } from "@/components/layout/ambient-background";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SplashScreen } from "@/components/layout/splash-screen";
import { NewsletterPopup } from "@/components/layout/newsletter-popup";
import { ConsentAnalytics } from "@/components/analytics/consent-analytics";
import { getAnnouncements } from "@/server/queries/content";

export default async function StoreLayout({ children }: LayoutProps<"/">) {
  const announcements = await getAnnouncements();

  return (
    <CartProvider>
      <script
        // Hides the splash before first paint for visitors who've already seen it this session.
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem('hydra.splash.seen'))document.documentElement.dataset.splash='seen'}catch(e){}`,
        }}
      />
      <AmbientBackground />
      <SplashScreen />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-black">
        Skip to content
      </a>
      <AnnouncementBar items={announcements} />
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <CartDrawer />
      <NewsletterPopup />
      <ConsentAnalytics />
    </CartProvider>
  );
}

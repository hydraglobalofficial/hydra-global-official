"use client";

import Script from "next/script";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CONSENT_KEY, configureAnalytics } from "@/lib/analytics";
import type { TrackingContent } from "@/content/site-sections";

type Consent = "granted" | "denied" | null;

export function ConsentAnalytics({ tracking }: { tracking: TrackingContent }) {
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);
  const { gtmId, metaPixelId, tiktokPixelId, ga4Id, requireConsent } = tracking;
  configureAnalytics({ requireConsent });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read persisted consent once
    setConsent(localStorage.getItem(CONSENT_KEY) as Consent);
    setReady(true);
  }, []);

  const pathname = usePathname();
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    window.dataLayer ??= [];
    window.dataLayer.push({ event: "page_view", page_path: pathname });
    window.fbq?.("track", "PageView");
    window.ttq?.page();
  }, [pathname]);

  const decide = (value: Exclude<Consent, null>) => {
    localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  };

  const allowed = !requireConsent || consent === "granted";
  const hasTrackers = Boolean(gtmId || metaPixelId || tiktokPixelId || ga4Id);
  const loadGa4Direct = Boolean(ga4Id && !gtmId);

  return (
    <>
      {allowed && gtmId ? (
        <Script id="gtm" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      ) : null}
      {allowed && loadGa4Direct ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`}
          </Script>
        </>
      ) : null}
      {allowed && metaPixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`}
        </Script>
      ) : null}
      {allowed && tiktokPixelId ? (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie'];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i='https://analytics.tiktok.com/i18n/pixel/events.js';ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=d.createElement('script');o.type='text/javascript';o.async=!0;o.src=i+'?sdkid='+e+'&lib='+t;var a=d.getElementsByTagName('script')[0];a.parentNode.insertBefore(o,a)};ttq.load('${tiktokPixelId}');ttq.page()}(window,document,'ttq');`}
        </Script>
      ) : null}

      {ready && requireConsent && hasTrackers && consent === null ? (
        <div className="glass fixed inset-x-4 bottom-4 z-[80] mx-auto max-w-xl rounded-2xl p-5 shadow-2xl animate-fade-up md:left-6 md:right-auto">
          <p className="text-sm text-muted">
            We use cookies to measure traffic and improve your experience. See our{" "}
            <Link href="/legal/privacy-policy" className="text-fg underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => decide("granted")} className="rounded-full bg-fg px-5 py-2 text-sm font-medium text-bg">
              Accept
            </button>
            <button type="button" onClick={() => decide("denied")} className="rounded-full border border-line px-5 py-2 text-sm text-muted hover:text-fg">
              Decline
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

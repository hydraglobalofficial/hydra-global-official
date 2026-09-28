"use client";

import Script from "next/script";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CONSENT_KEY } from "@/lib/analytics";

type Consent = "granted" | "denied" | null;

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export function ConsentAnalytics() {
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read persisted consent once
    setConsent(localStorage.getItem(CONSENT_KEY) as Consent);
    setReady(true);
  }, []);

  // The Pixel snippet tracks the first PageView; client-side navigations are tracked here.
  // GTM should use a "History Change" trigger for the same purpose.
  const pathname = usePathname();
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    window.fbq?.("track", "PageView");
  }, [pathname]);

  const decide = (value: Exclude<Consent, null>) => {
    localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  };

  const hasTrackers = Boolean(GTM_ID || PIXEL_ID);

  return (
    <>
      {consent === "granted" && GTM_ID && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}
      {consent === "granted" && PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      )}

      {ready && hasTrackers && consent === null && (
        <div className="glass fixed inset-x-4 bottom-4 z-[80] mx-auto max-w-xl rounded-2xl p-5 shadow-2xl animate-fade-up md:left-6 md:right-auto">
          <p className="text-sm text-muted">
            We use cookies to measure traffic and improve your experience. See our{" "}
            <Link href="/legal/privacy-policy" className="text-fg underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => decide("granted")} className="rounded-full bg-fg px-5 py-2 text-sm font-medium text-black">
              Accept
            </button>
            <button type="button" onClick={() => decide("denied")} className="rounded-full border border-line px-5 py-2 text-sm text-muted hover:text-fg">
              Decline
            </button>
          </div>
        </div>
      )}
    </>
  );
}

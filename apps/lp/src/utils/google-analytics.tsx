"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

// 詳細な型定義
type GTagEvent = {
  page_path?: string;
  page_title?: string;
  page_location?: string;
  send_to?: string;
  [key: string]: unknown;
};

type GTagFunction = (
  command: "config" | "event" | "js",
  targetId: string,
  options?: GTagEvent,
) => void;

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    gtag?: GTagFunction;
    dataLayer?: unknown[];
  }
}

export const GoogleAnalytics = ({
  measurementId,
}: {
  measurementId: string;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && window.gtag) {
      window.gtag("config", measurementId, {
        page_path:
          pathname +
          (searchParams.toString() ? `?${searchParams.toString()}` : ""),
      });
    }
  }, [pathname, searchParams, measurementId]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname + window.location.search,
            });
          `,
        }}
      />
    </>
  );
};

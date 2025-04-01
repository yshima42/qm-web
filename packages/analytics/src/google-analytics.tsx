'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';
import { GTagFunction } from './types';
import React from 'react';
import { Suspense } from 'react';

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    gtag?: GTagFunction;
    dataLayer?: unknown[];
  }
}

// 実際のGoogleAnalytics機能を含むコンポーネント
export function GoogleAnalyticsContent({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && window.gtag) {
      window.gtag('config', measurementId, {
        page_path: pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''),
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
}

// 親コンポーネント - Suspenseでラップ
export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsContent measurementId={measurementId} />
    </Suspense>
  );
}
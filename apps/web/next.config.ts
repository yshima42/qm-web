import type { NextConfig } from "next";

import createNextIntlPlugin from "next-intl/plugin";

// SupabaseのURLからドメインを抽出する関数
function getSupabaseDomain(): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return "";
  try {
    const url = new URL(supabaseUrl);
    return url.origin; // https://htrhmajkecuuiptrzund.supabase.co
  } catch {
    return "";
  }
}

const supabaseDomain = getSupabaseDomain();
const cspHeader = `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://www.google-analytics.com; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; connect-src 'self' https://www.google-analytics.com${supabaseDomain ? ` ${supabaseDomain}` : ""}; upgrade-insecure-requests;`;

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_SUPABASE_DOMAIN ?? "undefined",
      },
      // ローカルで画像見るために追加
      {
        protocol: "https",
        hostname: process.env.NEXT_SUPABASE_IMAGE_DOMAIN ?? "undefined",
      },
    ],
  },
  async headers() {
    // ローカルでのproductionテスト時はDISABLE_CSP=trueでCSPを無効化
    // if (process.env.NODE_ENV === "development" || process.env.DISABLE_CSP === "true") {
    //   return [];
    // }

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);

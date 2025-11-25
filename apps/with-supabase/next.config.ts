import createNextIntlPlugin from "next-intl/plugin";

const cspHeader = `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://www.google-analytics.com; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; connect-src 'self' https://www.google-analytics.com; upgrade-insecure-requests;`;

const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https" as const,
        hostname: process.env.NEXT_SUPABASE_DOMAIN ?? "undefined",
      },
      // ローカルで画像見るために追加
      {
        protocol: "https" as const,
        hostname: process.env.NEXT_SUPABASE_IMAGE_DOMAIN ?? "undefined",
      },
    ],
  },

  async headers() {
    if (process.env.NODE_ENV === "development") {
      return [];
    }

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

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);

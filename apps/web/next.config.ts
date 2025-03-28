import type { NextConfig } from 'next';

const cspHeader = `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;`;

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    TZ: 'Asia/Tokyo',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_SUPABASE_DOMAIN ?? 'undefined',
      },
    ],
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  async headers() {
    if (process.env.NODE_ENV === 'development') {
      return [];
    }

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
        ],
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  eslint: {
    // 警告とエラーをビルド時に表示するが、ビルドを失敗させない
    ignoreDuringBuilds: false,
    dirs: ["src"],
  },
  // output: "export",
  // images: {
  //   unoptimized: true,
  // },
  // // 必要に応じて、ベースパスの設定（サブディレクトリにデプロイする場合）
  // // basePath: '/your-base-path',
  // // 明示的に静的生成するパスを指定（念のため）
  // trailingSlash: true,
  // experimental: {
  //   turboCaching: false,
  // },
  // unstable_disableWithNoCache: true,
};

export default withNextIntl(nextConfig);

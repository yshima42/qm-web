import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

// Tailwind CSSのJSエンジンを強制的に使用する環境変数を設定
process.env.TAILWIND_ENGINE = "js";
process.env.OXIDE_DISABLE = "1";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webpack: (config: Record<string, unknown>) => {
    // Tailwind CSSのOxideバイナリを使用しないようにする
    const resolveConfig = config.resolve as Record<string, unknown> | undefined;

    if (resolveConfig && typeof resolveConfig === "object") {
      const aliases = resolveConfig.alias as Record<string, string> | undefined;

      resolveConfig.alias = {
        ...(aliases ?? {}),
        "@tailwindcss/oxide": "@tailwindcss/postcss",
      };
    }

    return config;
  },
};

export default withNextIntl(nextConfig);

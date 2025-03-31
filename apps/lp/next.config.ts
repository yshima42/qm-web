/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // 必要に応じて、ベースパスの設定（サブディレクトリにデプロイする場合）
  // basePath: '/your-base-path',
  // 明示的に静的生成するパスを指定（念のため）
  trailingSlash: false,
};

export default nextConfig;

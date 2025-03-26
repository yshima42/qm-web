/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // 必要に応じて、ベースパスの設定（サブディレクトリにデプロイする場合）
  // basePath: '/your-base-path',
};

export default nextConfig;

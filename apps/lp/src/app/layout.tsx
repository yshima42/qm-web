import "./globals.css";
import { GoogleAnalytics } from "@quitmate/analytics";
import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

// 日本語フォントの設定
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

// 欧文フォントの設定（必要に応じて）
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "QuitMate（クイットメイト） | 依存症克服SNS",
  description:
    "依存症克服のための、禁酒、禁ギャンブル、禁煙、禁欲などをサポートするSNSアプリです。",
  metadataBase: new URL("https://about.quitmate.app"),
  openGraph: {
    title: "QuitMate（クイットメイト）",
    description: "依存症克服SNS",
    url: "https://about.quitmate.app",
    siteName: "QuitMate",
    images: [
      {
        url: "/images/ogp.png",
        width: 1200,
        height: 630,
        alt: "QuitMate OGP Image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuitMate（クイットメイト）",
    description: "依存症克服SNS",
    images: ["/images/ogp.png"],
    creator: "@QuitMate_JP",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Google Analytics測定IDを環境変数から取得
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

  return (
    <html lang="ja" className={`${notoSansJP.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-white">
        {/* Google Analyticsコンポーネントを追加 */}
        {gaId && <GoogleAnalytics measurementId={gaId} />}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

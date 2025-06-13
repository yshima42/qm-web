import "./[locale]/globals.css";
import { GoogleAnalytics } from "@quitmate/analytics";
import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";

// 日本語フォントの設定
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

// 欧文フォントの設定
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "QuitMate | Addiction Recovery SNS",
  description:
    "An anonymous community app to help you break free from alcohol, gambling, smoking, porn, and other addictions.",
  metadataBase: new URL("https://about.quitmate.app"),
  openGraph: {
    title: "QuitMate | Addiction Recovery SNS",
    description:
      "An anonymous community app to help you break free from alcohol, gambling, smoking, porn, and other addictions.",
    url: "https://about.quitmate.app",
    siteName: "QuitMate",
    images: [
      {
        url: "/images/en/ogp.png",
        width: 1200,
        height: 630,
        alt: "QuitMate OGP Image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuitMate | Addiction Recovery SNS",
    description:
      "An anonymous community app to help you break free from alcohol, gambling, smoking, porn, and other addictions.",
    images: ["/images/en/ogp.png"],
    creator: "@QuitMate_JP",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Google Analytics測定IDを環境変数から取得
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

  return (
    <html lang="en" className={`${notoSansJP.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-white">
        {/* Google Analyticsコンポーネントを追加 */}
        {gaId && <GoogleAnalytics measurementId={gaId} />}
        {children}
      </body>
    </html>
  );
}

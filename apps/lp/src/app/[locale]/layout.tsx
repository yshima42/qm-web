import "./globals.css";
import { GoogleAnalytics } from "@quitmate/analytics";
import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

import { routing } from "@/i18n/routing";

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

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("common");
  const tConfig = await getTranslations("config");

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(
      `https://about.quitmate.app/${tConfig("language-code")}`,
    ),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `https://about.quitmate.app/${tConfig("language-code")}`,
      siteName: "QuitMate",
      images: [
        {
          url: `/images/${tConfig("language-code")}/ogp.png`,
          width: 1200,
          height: 630,
          alt: "QuitMate OGP Image",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`/images/${tConfig("language-code")}/ogp.png`],
      creator: "@QuitMate_JP",
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // SSG対応
  setRequestLocale(locale);
  // 言語ファイルの読み込み
  const messages = await getMessages();

  // Google Analytics測定IDを環境変数から取得
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

  return (
    <html lang={locale} className={`${notoSansJP.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-white">
        {/* Google Analyticsコンポーネントを追加 */}
        {gaId && <GoogleAnalytics measurementId={gaId} />}
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

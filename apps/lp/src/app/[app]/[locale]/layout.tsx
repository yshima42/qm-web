import "./globals.css";
import { GoogleAnalytics } from "@quitmate/analytics";
import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";

import { getAppConfig } from "@/apps";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ app: string; locale: string }>;
}): Promise<Metadata> {
  const { app, locale } = await params;

  // アプリ設定を取得
  const appConfig = getAppConfig(app as "quitmate" | "alcohol");
  if (!appConfig) {
    return {};
  }

  const t = await getTranslations("common");
  const tConfig = await getTranslations("config");

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(appConfig.metadataBase),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${appConfig.metadataBase}/${app}/${locale}`,
      siteName: appConfig.siteName,
      images: [
        {
          url: appConfig.ogpImage[locale as "ja" | "en"],
          width: 1200,
          height: 630,
          alt: `${appConfig.siteName} OGP Image`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [appConfig.ogpImage[locale as "ja" | "en"]],
      creator: appConfig.twitter?.creator,
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
  params: Promise<{ app: string; locale: string }>;
}>) {
  const { app, locale } = await params;

  // アプリ設定を取得
  const appConfig = getAppConfig(app as "quitmate" | "alcohol");
  if (!appConfig) {
    notFound();
  }

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // SSG対応
  setRequestLocale(locale);
  // アプリに応じた言語ファイルの読み込み
  const messages =
    app === "alcohol"
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (await import(`../../../../messages/alcohol-${locale}.json`)).default
      : await getMessages();

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

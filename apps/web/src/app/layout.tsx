import { GoogleAnalytics } from "@quitmate/analytics";
import { Metadata } from "next";
import { Geist } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";

import { Footer } from "@/components/layout/footer";
import { SmartBanner } from "@/components/ui/smart-banner";
import { QueryProvider } from "@/app/providers";

import { getLocale } from "next-intl/server";

import "./globals.css";

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "QuitMate（クイットメイト） | 依存症克服SNS",
    template: "%s | QuitMate",
  },
  description:
    "依存症克服のための、禁酒、禁ギャンブル、禁煙、禁欲などをサポートするSNSアプリです。",
  keywords: ["依存症", "禁酒", "禁ギャンブル", "禁煙", "禁欲"],
  applicationName: "QuitMate（クイットメイト）",
  creator: "QuitMate（クイットメイト）",
  publisher: "QuitMate（クイットメイト）",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://quitmate.app"),
  alternates: {
    canonical: "/",
    languages: {
      "ja-JP": "/ja",
    },
  },
  openGraph: {
    title: {
      default: "QuitMate（クイットメイト） | 依存症克服SNS",
      template: "%s | QuitMate",
    },
    description:
      "依存症克服のための、禁酒、禁ギャンブル、禁煙、禁欲などをサポートするSNSアプリです。",
    url: "https://quitmate.app",
    siteName: "QuitMate（クイットメイト）",
    images: [
      {
        url: "/images/ogp.png",
        width: 1200,
        height: 630,
        alt: "QuitMate OGP Image",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "QuitMate（クイットメイト）",
      template: "%s | QuitMate",
    },
    description: "依存症克服SNS",
    images: ["/images/ogp.png"],
    creator: "@QuitMate_JP",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

  const locale = await getLocale();

  return (
    <html lang={locale} className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground" suppressHydrationWarning>
        {gaId && <GoogleAnalytics measurementId={gaId} />}
        <NextIntlClientProvider locale={locale}>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <main className="flex min-h-screen flex-col items-center">
                <div className="flex w-full flex-1 flex-col items-center">
                  {/* layoutじゃなくてpageで呼び出すコンポーネントに入れるとエラーが出る。やる時になおす */}
                  {/* <HeaderAuth /> */}
                  <div className="flex w-full max-w-5xl">
                    {/* レイアウトで認証をチェックしない方がいいいらしいので。実装する時また考える */}
                    {/* <Sidebar /> */}
                    <div className="flex flex-1 flex-col">{children}</div>
                  </div>
                  <SmartBanner />
                  <Footer />
                </div>
              </main>
            </ThemeProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

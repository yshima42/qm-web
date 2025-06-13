import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Features } from "@/components/sections/features";
import { FinalCTA } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { Intro } from "@/components/sections/intro";
import { Testimonials } from "@/components/sections/testimonials";

import { routing } from "@/i18n/routing";

// SSG対応
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// ビルド時に実行される
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

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Intro />
      <Features />
      <Testimonials />
      <FinalCTA />
    </main>
  );
}

import { getTranslations, setRequestLocale } from "next-intl/server";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t("title"),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  return (
    <main>
      <h1>{t("title")}</h1>
      <Hero />
      <Intro />
      <Features />
      <Testimonials />
      <FinalCTA />
    </main>
  );
}

import { APP_IDS } from "@/apps";
import { Features } from "@/components/sections/features";
import { FinalCTA } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { Intro } from "@/components/sections/intro";
import { Recommended } from "@/components/sections/recommended";
import { Testimonials } from "@/components/sections/testimonials";
import { Why } from "@/components/sections/why";

import { routing } from "@/i18n/routing";

// SSG対応: 各アプリ×各ロケールの組み合わせを生成
export function generateStaticParams() {
  const params: { app: string; locale: string }[] = [];
  for (const app of APP_IDS) {
    for (const locale of routing.locales) {
      params.push({ app, locale });
    }
  }
  return params;
}

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Intro />
      <Recommended />
      <Features />
      <Why />
      <Testimonials />
      <FinalCTA />
    </main>
  );
}

import {
  ChillBaseCTA,
  ChillBaseFeatures,
  ChillBaseHero,
  ChillBaseIntro,
  ChillBaseTarget,
} from "@/chillbase/components";

import { routing } from "@/i18n/routing";

// SSG対応
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function ChillBasePage() {
  return (
    <main>
      <ChillBaseHero />
      <ChillBaseIntro />
      <ChillBaseFeatures />
      <ChillBaseTarget />
      <ChillBaseCTA />
    </main>
  );
}

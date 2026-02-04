"use client";

import { useTranslations } from "next-intl";

import { StoreBadges } from "./store-badge";
import { ScreenshotViewer } from "./screenshot-viewer";

type HeroProps = {
  namespace?: string;
};

const SCREENSHOT_CONFIG = {
  alcohol: [
    { image: "k-screenshot-home.png", altKey: "screenshot-home-alt" },
    { image: "k-screenshot-timeline.png", altKey: "screenshot-timeline-alt" },
    { image: "k-screenshot-profile.png", altKey: "screenshot-profile-alt" },
    { image: "k-screenshot-diagnosis.png", altKey: "screenshot-diagnosis-alt" },
    { image: "k-screenshot-roadmap.png", altKey: "screenshot-roadmap-alt" },
  ],
  default: [
    { image: "screenshot-stories.png", altKey: "screenshot-stories-alt" },
    { image: "screenshot-categories.png", altKey: "screenshot-categories-alt" },
    { image: "screenshot-program.png", altKey: "screenshot-program-alt" },
    { image: "screenshot-habits.png", altKey: "screenshot-habits-alt" },
  ],
} as const;

export const Hero = ({ namespace = "" }: HeroProps = {}) => {
  const translationKey = namespace ? `${namespace}.hero` : "hero";
  const t = useTranslations(translationKey);
  const tConfig = useTranslations("config");

  const isAlcohol = namespace === "alcohol";
  const config = SCREENSHOT_CONFIG[isAlcohol ? "alcohol" : "default"];
  const lang = tConfig("language-code");
  const screenshots = config.map(({ image, altKey }) => ({
    src: `/images/${lang}/${image}`,
    alt: t(altKey),
  }));

  const bgGradient = isAlcohol
    ? "bg-gradient-to-b from-[#d8e8d4] to-white"
    : "bg-gradient-to-b from-[#f8fbf7] to-white";
  const titleColor = "text-gray-800";
  const descColor = "text-gray-600";

  return (
    <section className={`flex items-center justify-center ${bgGradient} p-8 py-12 md:py-16`}>
      <div className="flex w-full max-w-5xl flex-col items-center justify-between gap-2 md:flex-row md:gap-6">
        <div className="flex max-w-lg flex-col items-center text-center md:items-start md:text-left">
          <h1
            className={`mb-2 text-3xl font-semibold leading-tight ${titleColor} md:mb-4 md:text-4xl md:font-bold lg:text-4xl`}
          >
            {t("title")}
          </h1>
          <p className={`mb-4 text-lg ${descColor} md:mb-6 md:text-xl lg:text-2xl`}>
            {t("description")}
          </p>
          <div className="hidden md:block">
            <StoreBadges size="xl" namespace={namespace} />
          </div>
          <div className="block md:hidden">
            <StoreBadges size="medium" namespace={namespace} />
          </div>
        </div>

        <div className="relative mt-4 h-[600px] w-full md:mt-0 md:w-[380px] lg:w-[450px]">
          <ScreenshotViewer screenshots={screenshots} />
        </div>
      </div>
    </section>
  );
};

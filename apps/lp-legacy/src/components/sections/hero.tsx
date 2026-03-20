"use client";

import { useTranslations } from "next-intl";

import { ScreenshotViewer } from "./screenshot-viewer";
import { StoreBadges } from "./store-badge";

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
  kinshu: [
    { image: "a-screenshot-home.png", altKey: "screenshot-home-alt" },
    { image: "a-screenshot-habits.png", altKey: "screenshot-habits-alt" },
  ],
  porn: [
    { image: "p-screenshot-home.png", altKey: "screenshot-home-alt" },
    { image: "p-screenshot-habits.png", altKey: "screenshot-habits-alt" },
  ],
  tobacco: [
    { image: "t-screenshot-home.png", altKey: "screenshot-home-alt" },
    { image: "t-screenshot-habits.png", altKey: "screenshot-habits-alt" },
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

  const config =
    namespace === "alcohol"
      ? SCREENSHOT_CONFIG.alcohol
      : namespace === "kinshu"
        ? SCREENSHOT_CONFIG.kinshu
        : namespace === "porn"
          ? SCREENSHOT_CONFIG.porn
          : namespace === "tobacco"
            ? SCREENSHOT_CONFIG.tobacco
            : SCREENSHOT_CONFIG.default;
  const lang = tConfig("language-code");
  const screenshots = config.map(({ image, altKey }) => ({
    src: `/images/${lang}/${image}`,
    alt: t(altKey),
  }));

  const bgGradient =
    namespace === "porn"
      ? "bg-gradient-to-b from-[#1a0a1f] via-[#2d1b4e] to-[#1a0a1f]"
      : namespace === "tobacco"
        ? "bg-gradient-to-b from-[#e8f5e9] to-white"
        : namespace === "kinshu"
          ? "bg-gradient-to-b from-[#e8eaf6] to-white"
          : namespace === "alcohol"
            ? "bg-gradient-to-b from-[#d8e8d4] to-white"
            : "bg-gradient-to-b from-[#f8fbf7] to-white";
  const titleColor =
    namespace === "porn"
      ? "text-white"
      : namespace === "kinshu" || namespace === "tobacco"
        ? "text-gray-900"
        : "text-gray-800";
  const descColor =
    namespace === "porn"
      ? "text-purple-200"
      : namespace === "kinshu" || namespace === "tobacco"
        ? "text-gray-700"
        : "text-gray-600";

  const indicatorColor =
    namespace === "porn"
      ? "bg-purple-400"
      : namespace === "kinshu"
        ? "bg-[#3949ab]"
        : namespace === "tobacco"
          ? "bg-green-600"
          : namespace === "alcohol"
            ? "bg-green-700"
            : "bg-[#2E6C28]";

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
          <ScreenshotViewer screenshots={screenshots} indicatorActiveClassName={indicatorColor} />
        </div>
      </div>
    </section>
  );
};

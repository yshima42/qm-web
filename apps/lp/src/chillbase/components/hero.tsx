"use client";

import { useTranslations } from "next-intl";

import { ScreenshotViewer } from "@/components/sections/screenshot-viewer";

import { ChillBaseStoreBadges } from "./store-badge";

export const ChillBaseHero = () => {
  const t = useTranslations("chillbase.hero");

  const screenshots = [
    {
      src: "/chillbase/images/ss1.png",
      alt: t("screenshot1-alt"),
    },
    {
      src: "/chillbase/images/ss2.png",
      alt: t("screenshot2-alt"),
    },
    {
      src: "/chillbase/images/ss3.png",
      alt: t("screenshot3-alt"),
    },
  ];

  return (
    <section className="flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-8 py-12 md:py-16">
      <div className="flex w-full max-w-5xl flex-col items-center justify-between gap-2 md:flex-row md:gap-6">
        <div className="flex max-w-lg flex-col items-center text-center md:items-start md:text-left">
          <h1 className="mb-2 text-3xl font-semibold leading-tight text-gray-800 md:mb-4 md:text-4xl md:font-bold lg:text-4xl">
            {t("title")}
          </h1>
          <p className="mb-4 text-lg text-gray-600 md:mb-6 md:text-xl lg:text-2xl">
            {t("description")}
          </p>
          <div className="hidden md:block">
            <ChillBaseStoreBadges size="xl" />
          </div>
          <div className="block md:hidden">
            <ChillBaseStoreBadges size="medium" />
          </div>
        </div>

        <div className="relative mt-4 h-[600px] w-full md:mt-0 md:w-[380px] lg:w-[450px]">
          <ScreenshotViewer screenshots={screenshots} />
        </div>
      </div>
    </section>
  );
};

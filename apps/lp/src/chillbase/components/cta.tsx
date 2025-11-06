"use client";

import { useTranslations } from "next-intl";

import { ChillBaseStoreBadges } from "./store-badge";

export const ChillBaseCTA = () => {
  const t = useTranslations("chillbase.cta");

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white px-6 py-20 text-center">
      <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
        {t("title")}
      </h2>
      <p className="mx-auto mb-8 max-w-xl text-lg text-gray-600">
        {t("description")}
      </p>
      <ChillBaseStoreBadges size="medium" />
    </section>
  );
};

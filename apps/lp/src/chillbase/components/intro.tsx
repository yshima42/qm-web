"use client";

import { useTranslations } from "next-intl";

export const ChillBaseIntro = () => {
  const t = useTranslations("chillbase.intro");

  return (
    <section className="bg-white px-6 py-12 md:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-4 text-3xl font-semibold text-gray-800 md:mb-6 md:text-4xl">
          {t("title")}
        </h2>
        <p className="text-lg leading-relaxed text-gray-600 md:text-xl">
          {t("description")}
        </p>
      </div>
    </section>
  );
};

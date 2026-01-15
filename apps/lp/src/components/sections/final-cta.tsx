"use client";

import { useTranslations } from "next-intl";

import { StoreBadges } from "./store-badge";

type FinalCTAProps = {
  namespace?: string;
};

export const FinalCTA = ({ namespace = "" }: FinalCTAProps = {}) => {
  const translationKey = namespace ? `${namespace}.final-cta` : "final-cta";
  const t = useTranslations(translationKey);

  const isAlcohol = namespace === "alcohol";
  const bgGradient = isAlcohol
    ? "bg-gradient-to-b from-[#d8e8d4] to-white"
    : "bg-gradient-to-b from-[#f8fbf7] to-white";
  const textColor = "text-gray-800";
  const descColor = "text-gray-600";

  return (
    <section className={`${bgGradient} px-6 py-20 text-center`}>
      <h2 className={`mb-4 text-3xl font-bold ${textColor} md:text-4xl`}>{t("title")}</h2>
      <p className={`mx-auto mb-8 max-w-xl text-lg ${descColor}`}>{t("description")}</p>
      <StoreBadges size="medium" />
    </section>
  );
};

"use client";

import { useTranslations } from "next-intl";

import { useApp } from "@/components/providers/app-provider";
import { StoreBadges } from "./store-badge";

export const FinalCTA = () => {
  const t = useTranslations("final-cta");
  const appId = useApp();

  // 禁酒ウィークの場合は薄い緑系の背景色を使用
  const bgGradient =
    appId === "alcohol"
      ? "bg-gradient-to-b from-green-50 to-white"
      : "bg-gradient-to-b from-[#f8fbf7] to-white";

  return (
    <section className={`${bgGradient} px-6 py-20 text-center`}>
      <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">{t("title")}</h2>
      <p className="mx-auto mb-8 max-w-xl text-lg text-gray-600">{t("description")}</p>
      <StoreBadges size="medium" />
    </section>
  );
};

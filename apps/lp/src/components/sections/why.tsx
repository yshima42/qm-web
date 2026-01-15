"use client";

import { useTranslations } from "next-intl";

import { useApp } from "@/components/providers/app-provider";

export const Why = () => {
  const appId = useApp();

  // 禁酒ウィークの場合のみ表示
  if (appId !== "alcohol") {
    return null;
  }

  const t = useTranslations("why");

  // 薄い緑系の背景色
  const bgColor = "bg-green-50";

  return (
    <section className={`${bgColor} px-6 py-20 text-center`}>
      <h2 className="mb-6 text-3xl font-semibold text-gray-800 md:text-4xl">{t("title")}</h2>
      <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-700">{t("description")}</p>
    </section>
  );
};

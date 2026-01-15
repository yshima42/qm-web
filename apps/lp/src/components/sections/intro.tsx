"use client";

import { useTranslations } from "next-intl";

import { useApp } from "@/components/providers/app-provider";

export const Intro = () => {
  const t = useTranslations("intro");
  const appId = useApp();

  // 禁酒ウィークの場合は薄い緑系の背景色を使用
  const bgColor = appId === "alcohol" ? "bg-green-50" : "bg-[#f8fbf7]";

  return (
    <section className={`${bgColor} px-6 py-20 text-center`}>
      <h2 className="mb-4 text-3xl font-semibold text-gray-800 md:text-4xl">{t("title")}</h2>
      <p className="mx-auto max-w-3xl text-lg text-gray-600">{t("description")}</p>
    </section>
  );
};

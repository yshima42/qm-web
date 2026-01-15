"use client";

import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { useApp } from "@/components/providers/app-provider";

export const Recommended = () => {
  const appId = useApp();

  // 禁酒ウィークの場合のみ表示
  if (appId !== "alcohol") {
    return null;
  }

  const t = useTranslations("recommended");
  const items = t.raw("items") as string[];

  // 薄い緑系のアイコンカラー
  const iconColor = "text-green-500";

  return (
    <section className="bg-white px-6 py-12 md:py-20">
      <h2 className="mb-8 text-center text-3xl font-semibold text-gray-800 md:mb-12 md:text-4xl">
        {t("title")}
      </h2>
      <div className="mx-auto max-w-3xl">
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className={`mt-1 flex-shrink-0 ${iconColor}`}>
                <CheckCircle2 size={24} strokeWidth={2} />
              </div>
              <p className="text-lg text-gray-700">{item}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

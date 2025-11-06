"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";

export const ChillBaseTarget = () => {
  const t = useTranslations("chillbase.target");

  const items = [t("item1"), t("item2"), t("item3")];

  return (
    <section className="bg-white px-6 py-12 md:py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-8 text-center text-3xl font-semibold text-gray-800 md:text-4xl">
          {t("title")}
        </h2>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 rounded-lg bg-gray-50 p-4"
            >
              <CheckCircle2
                className="mt-1 flex-shrink-0 text-blue-500"
                size={24}
              />
              <p className="text-lg text-gray-700">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

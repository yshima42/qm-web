"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@quitmate/ui";
import { useTranslations } from "next-intl";
import { Music, Timer, Gift } from "lucide-react";

export const ChillBaseFeatures = () => {
  const t = useTranslations("chillbase.features");

  const features = [
    {
      title: t("feature1.title"),
      icon: Music,
      description: t("feature1.description"),
    },
    {
      title: t("feature2.title"),
      icon: Timer,
      description: t("feature2.description"),
    },
    {
      title: t("feature3.title"),
      icon: Gift,
      description: t("feature3.description"),
    },
  ];

  return (
    <section className="bg-gray-50 px-6 py-12 md:py-20">
      <h2 className="mb-4 text-center text-3xl font-semibold text-gray-800 md:mb-12 md:text-4xl">
        {t("title")}
      </h2>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {features.map(({ title, icon: Icon, description }) => (
          <Card
            key={title}
            className="h-full border-none bg-white shadow-md transition-shadow hover:shadow-lg"
          >
            <CardHeader className="flex flex-col items-center gap-2 pb-4">
              <div className="p-2 text-blue-500">
                <Icon size={48} strokeWidth={1.5} />
              </div>
              <CardTitle className="text-lg font-bold text-gray-800 md:text-xl">
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-gray-600">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

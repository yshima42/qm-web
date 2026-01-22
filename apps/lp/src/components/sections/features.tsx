import { Card, CardContent, CardHeader, CardTitle } from "@quitmate/ui";
import { Users, MessageSquare, TimerReset } from "lucide-react"; // 仮アイコン
import { useTranslations } from "next-intl";

type FeaturesProps = {
  namespace?: string;
};

export const Features = ({ namespace = "" }: FeaturesProps = {}) => {
  const translationKey = namespace ? `${namespace}.features` : "features";
  const t = useTranslations(translationKey);

  const features = [
    {
      title: t("feature1.title"),
      icon: Users,
      description: t("feature1.description"),
    },
    {
      title: t("feature2.title"),
      icon: MessageSquare,
      description: t("feature2.description"),
    },
    {
      title: t("feature3.title"),
      icon: TimerReset,
      description: t("feature3.description"),
    },
  ];

  const isAlcohol = namespace === "alcohol";
  const bgColor = isAlcohol ? "bg-[#e8f0e6]" : "bg-white";
  const textColor = "text-gray-800";

  return (
    <section className={`${bgColor} px-6 py-12 md:py-20`}>
      <h2 className={`mb-4 text-center text-3xl font-semibold ${textColor} md:mb-12 md:text-4xl`}>
        {t("title")}
      </h2>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {features.map(({ title, icon: Icon, description }) => {
          const iconColor = "text-[#2E6C28]";
          const cardBg = "bg-white";
          const titleColor = "text-gray-800";
          const descColor = "text-gray-600";

          return (
            <Card
              key={title}
              className={`h-full border-none ${cardBg} shadow-md transition-shadow hover:shadow-lg`}
            >
              <CardHeader className="flex flex-col items-center gap-2 pb-4">
                <div className={`p-2 ${iconColor}`}>
                  <Icon size={48} strokeWidth={1.5} />
                </div>
                <CardTitle className={`text-lg font-bold ${titleColor} md:text-xl`}>
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <p className={descColor}>{description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

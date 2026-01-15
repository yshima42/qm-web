import { useTranslations } from "next-intl";

type IntroProps = {
  namespace?: string;
};

export const Intro = ({ namespace = "" }: IntroProps = {}) => {
  const translationKey = namespace ? `${namespace}.intro` : "intro";
  const t = useTranslations(translationKey);

  const isAlcohol = namespace === "alcohol";
  const bgColor = isAlcohol ? "bg-[#d8e8d4]" : "bg-[#f8fbf7]";
  const textColor = "text-gray-800";
  const descColor = "text-gray-600";

  return (
    <section className={`${bgColor} px-6 py-20 text-center`}>
      <h2 className={`mb-4 text-3xl font-semibold ${textColor} md:text-4xl`}>{t("title")}</h2>
      <p className={`mx-auto max-w-3xl text-lg ${descColor}`}>{t("description")}</p>
    </section>
  );
};

import { useTranslations } from "next-intl";

type IntroProps = {
  namespace?: string;
};

export const Intro = ({ namespace = "" }: IntroProps = {}) => {
  const translationKey = namespace ? `${namespace}.intro` : "intro";
  const t = useTranslations(translationKey);

  const bgColor =
    namespace === "porn"
      ? "bg-[#1a0a1f]"
      : namespace === "tobacco"
        ? "bg-[#e8f5e9]"
        : namespace === "kinshu"
          ? "bg-[#e8eaf6]"
          : namespace === "alcohol"
            ? "bg-[#d8e8d4]"
            : "bg-[#f8fbf7]";
  const textColor =
    namespace === "porn"
      ? "text-white"
      : namespace === "kinshu" || namespace === "tobacco"
        ? "text-gray-900"
        : "text-gray-800";
  const descColor =
    namespace === "porn"
      ? "text-purple-200"
      : namespace === "kinshu" || namespace === "tobacco"
        ? "text-gray-700"
        : "text-gray-600";

  return (
    <section className={`${bgColor} px-6 py-20 text-center`}>
      <h2 className={`mb-4 text-3xl font-semibold ${textColor} md:text-4xl`}>{t("title")}</h2>
      <p className={`mx-auto max-w-3xl text-lg ${descColor}`}>{t("description")}</p>
    </section>
  );
};

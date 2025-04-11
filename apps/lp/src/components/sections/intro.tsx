import { useTranslations } from "next-intl";

export const Intro = () => {
  const t = useTranslations("intro");

  return (
    <section className="bg-[#f8fbf7] px-6 py-20 text-center">
      <h2 className="mb-4 text-3xl font-semibold text-gray-800 md:text-4xl">
        {t("title")}
      </h2>
      <p className="mx-auto max-w-3xl text-lg text-gray-600">
        {t("description")}
      </p>
    </section>
  );
};

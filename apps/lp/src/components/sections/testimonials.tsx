// apps/lp/src/components/sections/Testimonials.tsx
import { Card, CardContent } from "@quitmate/ui";
import { useTranslations } from "next-intl";

type TestimonialsProps = {
  namespace?: string;
};

export const Testimonials = ({ namespace = "" }: TestimonialsProps = {}) => {
  const translationKey = namespace ? `${namespace}.testimonials` : "testimonials";
  const t = useTranslations(translationKey);

  const testimonials = [
    {
      name: t("testimonial1.name"),
      title: t("testimonial1.title"),
      message: t("testimonial1.message"),
    },
    {
      name: t("testimonial2.name"),
      title: t("testimonial2.title"),
      message: t("testimonial2.message"),
    },
    {
      name: t("testimonial3.name"),
      title: t("testimonial3.title"),
      message: t("testimonial3.message"),
    },
  ];

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

  return (
    <section className={`${bgColor} px-6 py-20 text-center`}>
      <h2 className={`mb-12 text-3xl font-semibold ${textColor} md:text-4xl`}>{t("title")}</h2>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        {testimonials.map((item, index) => (
          <Card
            key={index}
            className={`h-full border-none text-left shadow-md ${
              namespace === "porn" ? "bg-[#2d1b4e]/90" : "bg-white"
            }`}
          >
            <CardContent className="p-6">
              <div className="mb-4 flex justify-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="size-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <h3
                className={`mb-2 text-lg font-semibold ${
                  namespace === "porn" ? "text-white" : "text-gray-800"
                }`}
              >
                {item.title}
              </h3>
              <p
                className={`mb-4 text-sm ${
                  namespace === "porn" ? "text-purple-200" : "text-gray-600"
                }`}
              >
                &quot;{item.message}&quot;
              </p>
              <p
                className={`text-right text-sm font-semibold ${
                  namespace === "porn" ? "text-purple-300" : "text-gray-700"
                }`}
              >
                — {item.name}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

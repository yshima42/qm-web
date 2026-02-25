import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";

import { Link } from "@/i18n/routing";

import { routing } from "@/i18n/routing";

const APP_ENTRIES = [
  {
    key: "challenge",
    href: "/challenge",
    icon: "/images/kinshu_icon.png",
    accent: "bg-[#2E6C28]",
    bgHover: "hover:border-green-200 hover:bg-green-50/50",
  },
  {
    key: "kinshu",
    href: "/alcohol",
    icon: "/images/alcohol_icon.png",
    accent: "bg-[#3949ab]",
    bgHover: "hover:border-indigo-200 hover:bg-indigo-50/50",
  },
  {
    key: "porn",
    href: "/porn",
    icon: "/images/porn_icon.png",
    accent: "bg-[#2d1b4e]",
    bgHover: "hover:border-violet-200 hover:bg-violet-50/50",
  },
  {
    key: "tobacco",
    href: "/tobacco",
    icon: "/images/tobacco_icon.png",
    accent: "bg-green-600",
    bgHover: "hover:border-teal-200 hover:bg-teal-50/50",
  },
] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata() {
  const t = await getTranslations("apps");
  const tConfig = await getTranslations("config");

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(`https://about.quitmate.app/${tConfig("language-code")}`),
  };
}

export default async function AppsPage() {
  const t = await getTranslations("apps");

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ヒーロー */}
      <div className="relative overflow-hidden border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8fbf7_0%,#f0fdf4_50%,transparent_100%)] opacity-60" />
        <div className="relative mx-auto max-w-3xl px-4 py-10 text-center sm:px-6 sm:py-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {t("heading")}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">{t("subheading")}</p>
        </div>
      </div>

      {/* アプリカード */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {APP_ENTRIES.map(({ key, href, icon, accent, bgHover }) => (
            <Link
              key={key}
              href={href}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:p-8 ${bgHover}`}
            >
              {/* 上部アクセントバー（各LPのテーマ色） */}
              <div className={`absolute left-0 right-0 top-0 h-1 ${accent}`} />

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gray-50 transition-colors group-hover:bg-gray-100 sm:size-16">
                    <Image
                      src={icon}
                      alt=""
                      width={64}
                      height={64}
                      className="object-contain p-1"
                    />
                  </div>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-all group-hover:bg-gray-200 group-hover:text-gray-600">
                    <ArrowUpRight className="size-5" strokeWidth={2} />
                  </span>
                </div>

                <h2 className="mt-5 text-xl font-semibold text-gray-900 sm:text-2xl">
                  {t(`${key}.name`)}
                </h2>
                <p className="mt-2 flex-1 leading-relaxed text-gray-600">
                  {t(`${key}.description`)}
                </p>
                <p className="mt-4 text-sm font-medium text-gray-500 transition-colors group-hover:text-gray-700">
                  {t(`${key}.linkText`)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

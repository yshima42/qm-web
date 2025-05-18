import Image from "next/image";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import { Link, routing } from "@/i18n/routing";
import { getAllPosts } from "@/utils/blog";

// SSG対応
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// ビルド時に実行される
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("blog");
  const tConfig = await getTranslations("config");

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(
      `https://about.quitmate.app/${tConfig("language-code")}`,
    ),
  };
}

export default function BlogPage() {
  const t = useTranslations("blog");
  const tConfig = useTranslations("config");
  const posts = getAllPosts(tConfig("language-code"));

  return (
    <div className="min-h-screen bg-[#f8fbf7]">
      {/* ブログヘッダーセクション - モダンなミニマルデザイン */}
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[#f8fbf7]"></div>
        <div className="absolute inset-y-0 right-0 w-1/2 rounded-l-full bg-[#2E6C28] opacity-10"></div>

        <div className="relative mx-auto max-w-5xl px-4 py-8 pb-6 sm:py-12 sm:pb-8 lg:py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-lg text-center md:max-w-3xl">
            <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              {t("journal-title")}
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-lg sm:text-xl text-gray-500">
              {t("journal-description")}
            </p>
          </div>
        </div>
      </div>

      {/* コンテンツセクション - モダンなカードデザイン */}
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {posts.length === 0 ? (
          <div className="py-16 text-center">
            <svg
              className="mx-auto size-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              {t("no-posts")}
            </h3>
            <p className="mt-1 text-gray-500">{t("content-preparing")}</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* 特集記事 - 最新の記事を特集として表示 */}
            {posts.length > 0 && (
              <div className="relative">
                <Link href={`/blog/${posts[0].slug}`} className="group block">
                  <div className="relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl lg:flex-row">
                    {/* 画像部分（スマホでは上に表示） */}
                    <div className="order-first flex items-center justify-center bg-gray-100 p-6 lg:w-1/2 lg:p-12">
                      {posts[0].coverImage ? (
                        <div className="h-64 w-full overflow-hidden rounded-xl lg:h-full">
                          <Image
                            src={posts[0].coverImage}
                            alt={posts[0].title}
                            width={600}
                            height={400}
                            className="size-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-64 w-full items-center justify-center rounded-xl bg-green-800 p-8 lg:h-full">
                          <svg
                            className="size-24 text-green-700 opacity-25"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* テキスト部分（スマホでは下に表示） */}
                    <div className="order-last flex flex-col justify-between p-6 sm:p-8 lg:w-1/2 lg:p-12">
                      <div>
                        <div className="mb-4 flex items-center text-sm font-medium text-green-700">
                          <svg
                            className="mr-1.5 size-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {new Date(posts[0].date).toLocaleDateString(
                            tConfig("language-code") === "ja"
                              ? "ja-JP"
                              : "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 transition duration-300 group-hover:text-green-700 sm:text-3xl">
                          {posts[0].title}
                        </h2>
                        <p className="mt-4 text-lg leading-relaxed text-gray-600">
                          {posts[0].excerpt}
                        </p>
                      </div>
                      <div className="mt-8">
                        <span className="inline-flex items-center font-semibold text-green-700 transition-all duration-200 group-hover:text-green-800">
                          {t("read-more")}
                          <svg
                            className="ml-2 size-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* 記事一覧 */}
            <div>
              <h2 className="mb-8 text-2xl font-bold text-gray-900">
                {t("latest-articles")}
              </h2>
              <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {posts.slice(posts.length > 0 ? 1 : 0).map((post) => (
                  <div
                    key={post.slug}
                    className="flex flex-col overflow-hidden rounded-xl bg-white transition-all duration-300 hover:shadow-lg"
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex h-full flex-col"
                    >
                      <div className="p-1">
                        <div className="h-40 overflow-hidden rounded-lg">
                          {post.coverImage ? (
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              width={400}
                              height={200}
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center bg-gray-100">
                              <div className="flex size-full items-center justify-center rounded-lg bg-green-800">
                                <svg
                                  className="size-12 text-green-700 opacity-25"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 p-6">
                        <div className="mb-2 flex items-center text-sm font-medium text-green-700">
                          <svg
                            className="mr-1.5 size-3.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {new Date(post.date).toLocaleDateString(
                            tConfig("language-code") === "ja"
                              ? "ja-JP"
                              : "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-gray-900 transition duration-300 group-hover:text-green-700">
                          {post.title}
                        </h3>
                        <p className="mb-4 line-clamp-2 text-gray-600">
                          {post.excerpt}
                        </p>
                        <div className="mt-auto flex items-center pt-4 font-medium text-green-700">
                          <span className="text-sm">{t("read-article")}</span>
                          <svg
                            className="ml-1 size-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

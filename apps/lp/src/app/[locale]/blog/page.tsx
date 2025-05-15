import { Link, routing } from "@/i18n/routing";
import { getAllPosts } from "@/utils/blog";

// SSG対応
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// ビルド時に実行される
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return {
    title: locale === "ja" ? "ブログ | QuitMate" : "Blog | QuitMate",
    description:
      locale === "ja"
        ? "QuitMateの公式ブログ。依存症回復に関する情報や最新ニュースを発信しています。"
        : "QuitMate official blog. Find information and the latest news about addiction recovery.",
    alternates: {
      canonical: `/${locale}/blog`,
      languages: {
        en: "/en/blog",
        ja: "/ja/blog",
      },
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const posts = getAllPosts(locale);

  return (
    <div className="min-h-screen bg-[#f8fbf7]">
      {/* ブログヘッダーセクション - モダンなミニマルデザイン */}
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[#f8fbf7]"></div>
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[#2E6C28] opacity-10 rounded-l-full"></div>

        <div className="relative max-w-5xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-lg text-center md:max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
              {locale === "ja" ? "QuitMate Journal" : "QuitMate Journal"}
            </h1>
            <p className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
              {locale === "ja"
                ? "回復の旅路に役立つ洞察、ストーリー、そして最新情報"
                : "Insights, stories, and updates to support your recovery journey"}
            </p>
          </div>
        </div>
      </div>

      {/* コンテンツセクション - モダンなカードデザイン */}
      <main className="max-w-5xl mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
              {locale === "ja" ? "まだ記事がありません" : "No posts yet"}
            </h3>
            <p className="mt-1 text-gray-500">
              {locale === "ja"
                ? "コンテンツは準備中です。もうしばらくお待ちください。"
                : "Content is being prepared. Please check back soon."}
            </p>
          </div>
        ) : (
          <div className="space-y-20">
            {/* 特集記事 - 最新の記事を特集として表示 */}
            {posts.length > 0 && (
              <div className="relative">
                <div className="relative lg:flex rounded-2xl overflow-hidden bg-white shadow-xl">
                  <div className="lg:w-1/2 p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center text-sm font-medium text-green-700 mb-4">
                        <svg
                          className="mr-1.5 h-4 w-4"
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
                          locale === "ja" ? "ja-JP" : "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </div>
                      <Link
                        href={`/blog/${posts[0].slug}`}
                        className="block group"
                      >
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:text-green-700 transition duration-300">
                          {posts[0].title}
                        </h2>
                        <p className="mt-4 text-lg leading-relaxed text-gray-600">
                          {posts[0].excerpt}
                        </p>
                      </Link>
                    </div>
                    <div className="mt-8">
                      <Link
                        href={`/blog/${posts[0].slug}`}
                        className="inline-flex items-center font-semibold text-green-700 hover:text-green-800 transition-all duration-200"
                      >
                        {locale === "ja" ? "続きを読む" : "Read article"}
                        <svg
                          className="ml-2 h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                  <div className="lg:w-1/2 bg-gray-100 flex items-center justify-center p-12">
                    <div className="w-full h-full bg-green-800 bg-opacity-10 rounded-xl flex items-center justify-center p-8">
                      <svg
                        className="h-24 w-24 text-green-700 opacity-25"
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
                </div>
              </div>
            )}

            {/* 記事一覧 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                {locale === "ja" ? "最新の記事" : "Latest Articles"}
              </h2>
              <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {posts.slice(posts.length > 0 ? 1 : 0).map((post) => (
                  <div
                    key={post.slug}
                    className="flex flex-col bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex flex-col h-full"
                    >
                      <div className="p-1">
                        <div className="bg-gray-100 h-40 rounded-lg flex items-center justify-center">
                          <div className="w-full h-full bg-green-800 bg-opacity-5 rounded-lg flex items-center justify-center">
                            <svg
                              className="h-12 w-12 text-green-700 opacity-25"
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
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-center text-sm font-medium text-green-700 mb-2">
                          <svg
                            className="mr-1.5 h-3.5 w-3.5"
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
                            locale === "ja" ? "ja-JP" : "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </div>
                        <h3 className="font-semibold text-xl text-gray-900 mb-2 group-hover:text-green-700 transition duration-300">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 line-clamp-2 mb-4">
                          {post.excerpt}
                        </p>
                        <div className="mt-auto pt-4 flex items-center font-medium text-green-700">
                          <span className="text-sm">
                            {locale === "ja" ? "読む" : "Read article"}
                          </span>
                          <svg
                            className="ml-1 h-4 w-4"
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

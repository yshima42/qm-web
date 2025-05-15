import { notFound } from "next/navigation";

import { MarkdownContent } from "@/components/sections/markdown-content";

import { Link, routing } from "@/i18n/routing";
import {
  getAllPostSlugs,
  getPostBySlug,
  getAlternateLanguageVersions,
} from "@/utils/blog";

// SSG対応
export function generateStaticParams() {
  // すべての対応言語に対してスラッグを生成
  const params: { locale: string; slug: string }[] = [];

  for (const locale of routing.locales) {
    const slugs = getAllPostSlugs(locale);
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }

  return params;
}

// ビルド時に実行される
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const post = getPostBySlug(slug, locale);

  if (!post) {
    return {
      title: "404 - Not Found",
    };
  }

  return {
    title: `${post.title} | QuitMate`,
    description: post.excerpt,
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
      languages: {
        en: `/en/blog/${slug}`,
        ja: `/ja/blog/${slug}`,
      },
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  try {
    const { locale, slug } = await params;

    const post = getPostBySlug(slug, locale);

    if (!post) {
      notFound();
    }

    const alternateVersions = getAlternateLanguageVersions(slug);

    return (
      <div className="min-h-screen bg-[#f8fbf7]">
        {/* ナビゲーション */}
        <div className="max-w-5xl mx-auto px-4 pt-8 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-gray-600 hover:text-green-700 transition-colors"
          >
            <svg
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
            <span>{locale === "ja" ? "ブログに戻る" : "Back to blog"}</span>
          </Link>
        </div>

        {/* 記事ヘッダー */}
        <header className="max-w-5xl mx-auto px-4 pt-10 pb-10 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="mb-6 flex justify-center">
              {/* 言語切替リンク */}
              <div className="flex space-x-4">
                {Object.entries(alternateVersions).map(([lang, exists]) => {
                  if (lang === locale || !exists) return null;

                  return (
                    <Link
                      key={lang}
                      href={`/blog/${slug}`}
                      locale={lang}
                      className="inline-flex items-center text-sm font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-800 hover:bg-green-100 hover:text-green-800 transition-colors"
                    >
                      <svg
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.498 7.549a.75.75 0 01.751-.737 5.824 5.824 0 11-5.941 5.815.75.75 0 011.5.021 4.324 4.324 0 104.17-4.351.75.75 0 01-.479-.748zm3.656-3.019a1 1 0 01.894.529l.15.26a9.274 9.274 0 01-1.123 10.562 1 1 0 01-.834.38h-.344a1 1 0 01-.831-1.383l.15-.302a8 8 0 001.084-5.509 1 1 0 01.528-1 1 1 0 01.326-.04h.001a1 1 0 01-.001 0h-.001z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {lang === "ja" ? "日本語で読む" : "Read in English"}
                    </Link>
                  );
                })}
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-6">
              {post.title}
            </h1>

            <div className="flex items-center justify-center text-gray-500 text-sm">
              <time dateTime={post.date} className="flex items-center">
                <svg
                  className="h-4 w-4 mr-1.5"
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
              </time>
              {post.author && (
                <>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <svg
                      className="h-4 w-4 mr-1.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                    </svg>
                    {post.author}
                  </span>
                </>
              )}
            </div>
          </div>
        </header>

        {/* 記事の内容 - 見出しとデコレーションを追加 */}
        <div className="relative overflow-hidden pb-16">
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#f8fbf7] to-white pointer-events-none"></div>
          <div className="absolute right-0 top-[20%] w-96 h-96 bg-green-100 opacity-20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute left-0 bottom-[30%] w-64 h-64 bg-green-100 opacity-20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

          <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-sm rounded-2xl p-6 sm:p-10 lg:p-12 mb-12">
              <div className="prose prose-green prose-lg max-w-none">
                <MarkdownContent
                  content={post.content}
                  className="prose-green"
                />
              </div>
            </div>

            {/* 記事フッター */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-12 gap-6">
              <Link
                href="/blog"
                className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-800 transition-colors group"
              >
                <svg
                  className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                    clipRule="evenodd"
                  />
                </svg>
                {locale === "ja" ? "ブログに戻る" : "Back to blog"}
              </Link>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  {locale === "ja" ? "共有:" : "Share:"}
                </span>
                <div className="flex space-x-3">
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://about.quitmate.app/${locale}/blog/${slug}`)}&text=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-gray-200 text-gray-500 hover:text-blue-500 hover:border-blue-500 transition-colors"
                    aria-label="Share on Twitter"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://about.quitmate.app/${locale}/blog/${slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-600 transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://about.quitmate.app/${locale}/blog/${slug}`)}&title=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-gray-200 text-gray-500 hover:text-blue-700 hover:border-blue-700 transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  } catch (error) {
    // エラーが発生しても最小限の内容を表示する
    return (
      <div className="min-h-screen bg-[#f8fbf7]">
        <main className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="bg-red-50 p-5 rounded-lg border border-red-100">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-red-800">
                    エラーが発生しました
                  </h3>
                  <div className="mt-2 text-red-700 text-sm">
                    <p>ブログ記事の表示中にエラーが発生しました。</p>
                    <pre className="mt-2 text-xs bg-red-50 p-2 rounded border border-red-100 overflow-auto">
                      {error instanceof Error ? error.message : "不明なエラー"}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/blog"
                className="inline-flex items-center text-sm text-green-700 hover:text-green-800"
              >
                <svg
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                    clipRule="evenodd"
                  />
                </svg>
                ブログに戻る
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

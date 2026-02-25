import type { MetadataRoute } from "next";

import { getAllPosts } from "@/utils/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = "https://about.quitmate.app";

  // 静的なページのサイトマップエントリー
  const defaultPages: MetadataRoute.Sitemap = [
    {
      url: url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${url}/en/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${url}/ja/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${url}/en/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${url}/ja/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${url}/en/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${url}/ja/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${url}/en/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${url}/ja/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // LP: 禁酒チャレンジ(/challenge), 禁酒メイト(/alcohol), porn, tobacco（各 locale のトップ + terms / privacy / contact）
  const lpPathSlugs: Record<string, string> = {
    alcohol: "challenge",
    kinshu: "alcohol",
    porn: "porn",
    tobacco: "tobacco",
  };
  const lpNamespaces = ["alcohol", "kinshu", "porn", "tobacco"] as const;
  const lpSubPaths = ["", "/terms", "/privacy", "/contact"] as const;
  const locales = ["en", "ja"] as const;
  const lpPages: MetadataRoute.Sitemap = [];
  for (const lp of lpNamespaces) {
    const slug = lpPathSlugs[lp];
    for (const loc of locales) {
      for (const sub of lpSubPaths) {
        lpPages.push({
          url: `${url}/${loc}/${slug}${sub}`,
          lastModified: new Date(),
          changeFrequency: sub === "" ? ("daily" as const) : ("monthly" as const),
          priority: sub === "" ? 0.9 : 0.5,
        });
      }
    }
  }

  // 英語のブログ記事を取得
  const enPosts = await Promise.resolve(getAllPosts("en"));
  const enBlogPages = enPosts.map((post) => ({
    url: `${url}/en/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 日本語のブログ記事を取得
  const jaPosts = await Promise.resolve(getAllPosts("ja"));
  const jaBlogPages = jaPosts.map((post) => ({
    url: `${url}/ja/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // すべてのページを結合して返す
  return [...defaultPages, ...lpPages, ...enBlogPages, ...jaBlogPages];
}

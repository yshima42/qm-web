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
  return [...defaultPages, ...enBlogPages, ...jaBlogPages];
}

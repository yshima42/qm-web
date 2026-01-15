import type { MetadataRoute } from "next";

import { appConfigs, APP_IDS } from "@/apps";
import { routing } from "@/i18n/routing";
import { getAllPosts } from "@/utils/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 各アプリ×各ロケールの組み合わせでサイトマップを生成
  for (const appId of APP_IDS) {
    const config = appConfigs[appId];
    const baseUrl = config.metadataBase;

    for (const locale of routing.locales) {
      const appPath = `/${appId}/${locale}`;

      // ホームページ
      sitemapEntries.push({
        url: `${baseUrl}${appPath}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      });

      // ブログページ
      sitemapEntries.push({
        url: `${baseUrl}${appPath}/blog`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      });

      // ブログ記事
      const posts = await Promise.resolve(getAllPosts(locale));
      for (const post of posts) {
        sitemapEntries.push({
          url: `${baseUrl}${appPath}/blog/${post.slug}`,
          lastModified: new Date(post.date),
          changeFrequency: "monthly" as const,
          priority: 0.7,
        });
      }

      // その他の静的ページ
      const staticPages = [
        { path: "/terms", priority: 0.5 },
        { path: "/privacy", priority: 0.5 },
        { path: "/contact", priority: 0.5 },
      ];

      for (const page of staticPages) {
        sitemapEntries.push({
          url: `${baseUrl}${appPath}${page.path}`,
          lastModified: new Date(),
          changeFrequency: "monthly" as const,
          priority: page.priority,
        });
      }
    }
  }

  return sitemapEntries;
}

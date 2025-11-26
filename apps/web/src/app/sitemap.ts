import type { MetadataRoute } from "next";

import { fetchArticlesXml, fetchProfilesXml, fetchStoriesXml } from "@/features/sitemap/data/data";
import { HabitCategoryName } from "@/lib/types";

import { SITEMAP_LIMITS } from "@/features/sitemap/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = process.env.NEXT_PUBLIC_URL;
  // Vercel環境では環境変数が必須、ローカル開発環境では空のsitemapを返す
  if (!url) {
    if (process.env.VERCEL) {
      throw new Error("NEXT_PUBLIC_URL is not set");
    }
    // ローカル開発環境では空のsitemapを返す
    return [];
  }

  // カテゴリーの一覧を取得
  const categories: HabitCategoryName[] = [
    "Game",
    "Tobacco",
    "Shopping",
    "Drugs",
    "Overeating",
    "Porno",
    "SNS",
    "Gambling",
    "Caffeine",
    "Cosmetic Surgery",
    "Custom",
    "Alcohol",
    "Codependency",
    "Official",
  ];

  const defaultPages: MetadataRoute.Sitemap = [
    {
      url: url,
      lastModified: new Date(),
      changeFrequency: "always",
    },
    {
      url: `${url}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily",
    },
    ...categories.map((category) => ({
      url: `${url}/stories/habits/${category.toLowerCase().replace(/ /g, "-")}`,
      lastModified: new Date(),
    })),
  ];
  const profiles = await fetchProfilesXml({
    limit: SITEMAP_LIMITS.PROFILES,
  });
  const profilesPages: MetadataRoute.Sitemap = profiles.map((profile) => ({
    url: `${url}/${profile.user_name}`,
    lastModified: new Date(profile.created_at),
  }));
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const stories = await fetchStoriesXml({
    limit: SITEMAP_LIMITS.STORIES,
  });
  const storiesPages: MetadataRoute.Sitemap = stories.map((story) => ({
    url: `${url}/${story.profiles.user_name}/stories/${story.id}`,
    lastModified: new Date(story.created_at),
  }));

  const articles = await fetchArticlesXml({
    limit: SITEMAP_LIMITS.ARTICLES,
  });
  const articlesPages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${url}/${article.profiles.user_name}/articles/${article.id}`,
    lastModified: new Date(article.created_at),
  }));
  return [...defaultPages, ...profilesPages, ...storiesPages, ...articlesPages];
}

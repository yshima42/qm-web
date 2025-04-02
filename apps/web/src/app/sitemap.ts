import type { MetadataRoute } from 'next';

import { fetchArticlesXml, fetchProfilesXml, fetchStoriesXml } from '@/lib/data';
import { HabitCategoryName } from '@/lib/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = process.env.NEXT_PUBLIC_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_URL is not set');
  }

  // カテゴリーの一覧を取得
  const categories: HabitCategoryName[] = [
    'Game',
    'Tobacco',
    'Shopping',
    'Drugs',
    'Overeating',
    'Porno',
    'SNS',
    'Gambling',
    'Caffeine',
    'Cosmetic Surgery',
    'Custom',
    'Alcohol',
    'Codependency',
    'Official',
  ];

  const defaultPages: MetadataRoute.Sitemap = [
    {
      url: url,
      lastModified: new Date(),
      changeFrequency: 'always',
    },
    {
      url: `${url}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
    },
    ...categories.map((category) => ({
      url: `${url}/stories/habits/${category.toLowerCase().replace(/ /g, '-')}`,
      lastModified: new Date(),
    })),
  ];
  const profiles = await fetchProfilesXml({
    limit: 49000,
  });
  const profilesPages: MetadataRoute.Sitemap = profiles.map((profile) => ({
    url: `${url}/${profile.user_name}`,
    lastModified: new Date(profile.created_at),
  }));
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const stories = await fetchStoriesXml({
    // sitemapの上限は50000なので、それを超えないようにする
    limit: 49000,
    startDate: threeMonthsAgo.toISOString(),
  });
  const storiesPages: MetadataRoute.Sitemap = stories.map((story) => ({
    url: `${url}/${story.profiles.user_name}/stories/${story.id}`,
    lastModified: new Date(story.created_at),
  }));

  const articles = await fetchArticlesXml({
    limit: 49000,
  });
  const articlesPages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${url}/${article.profiles.user_name}/articles/${article.id}`,
    lastModified: new Date(article.created_at),
  }));
  return [...defaultPages, ...profilesPages, ...storiesPages, ...articlesPages];
}

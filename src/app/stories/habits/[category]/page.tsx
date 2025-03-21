import { notFound } from 'next/navigation';

import { Header } from '@/components/layout/header';

import { CATEGORY_DISPLAY_NAMES } from '@/lib/categories';
import { fetchStoriesByHabitCategoryName } from '@/lib/data';
import { HabitCategoryName } from '@/lib/types';

import { StoryList } from '@/features/stories/story-list';

// pathの[category]は小文字で保存されているので、元の形式に変換する関数
function capitalizeCategory(category: string): HabitCategoryName {
  const categoryMap: Record<string, HabitCategoryName> = {
    game: 'Game',
    tobacco: 'Tobacco',
    shopping: 'Shopping',
    drugs: 'Drugs',
    overeating: 'Overeating',
    porno: 'Porno',
    sns: 'SNS',
    gambling: 'Gambling',
    caffeine: 'Caffeine',
    'cosmetic-surgery': 'Cosmetic Surgery',
    custom: 'Custom',
    alcohol: 'Alcohol',
    codependency: 'Codependency',
    official: 'Official',
  };

  const normalizedCategory = categoryMap[category.toLowerCase().replace(/%20/g, '-')] ?? notFound();
  return normalizedCategory;
}

export default async function Page(props: { params: Promise<{ category: string }> }) {
  const params = await props.params;
  const category = params.category;
  if (!category) notFound();

  const habitCategory = capitalizeCategory(category);

  // 日本語カテゴリー名を取得
  const categoryDisplayName = CATEGORY_DISPLAY_NAMES[habitCategory];

  return (
    <>
      <Header title={categoryDisplayName} backUrl="/stories" showBackButton={false} />
      <main className="p-3 sm:p-5">
        <StoryList fetchStoriesFunc={() => fetchStoriesByHabitCategoryName(habitCategory)} />
      </main>
    </>
  );
}

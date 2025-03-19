import { notFound } from 'next/navigation';

import { StoryList } from '@/components/stories/story-list';

import { fetchStoriesByHabitCategoryName } from '@/lib/data';
import { HabitCategoryName } from '@/lib/types';

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
  return <StoryList fetchStoriesFunc={() => fetchStoriesByHabitCategoryName(habitCategory)} />;
}

import { Tag } from '@quitmate/ui';

import { CATEGORY_DISPLAY_NAMES } from '@/lib/categories';

type Props = {
  category: string;
  customHabitName?: string | null;
  elapsedDays?: number;
};

export function CategoryTag({ category, customHabitName, elapsedDays }: Props) {
  const displayName = category === 'Custom' ? customHabitName : CATEGORY_DISPLAY_NAMES[category as keyof typeof CATEGORY_DISPLAY_NAMES] || category;
  return (
    <Tag>
      {displayName}{' '}
      {elapsedDays ? `- ${elapsedDays.toString()}日` : ''}
    </Tag>
  );
}


import { Tag } from '@quitmate/ui';
import { useTranslations } from 'next-intl';

type Props = {
  category: string;
  customHabitName?: string | null;
};

export function CategoryTag({ category, customHabitName }: Props) {
  const t = useTranslations('Categories');
  return <Tag>{category === 'Custom' ? customHabitName : t(category)}</Tag>;
}

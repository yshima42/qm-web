import { NotFoundBase } from '@quitmate/ui';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('articles-page');
  return <NotFoundBase message={t('notFound')} linkText={t('linkText')} linkHref="/articles" />;
}

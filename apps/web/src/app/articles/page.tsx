import { Logo } from '@quitmate/ui';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

import { Header } from '@/components/layout/header';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

import { fetchArticles } from '@/lib/data';

import { ArticleList } from '@/features/articles/article-list';

export default function Page() {
  const t = useTranslations('ArticlesPage');

  return (
    <>
      <Header
        titleElement={
          <div className="flex items-center">
            <Logo size="small" />
            <p className="ml-2 font-medium">{t('title')}</p>
          </div>
        }
      />
      <Suspense fallback={<LoadingSpinner fullHeight />}>
        <div className="p-3 sm:p-5">
          <ArticleList fetchArticlesFunc={fetchArticles} />
        </div>
      </Suspense>
    </>
  );
}

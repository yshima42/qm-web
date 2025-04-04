import { Suspense } from 'react';

import { Header } from '@/components/layout/header';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

import { fetchArticles } from '@/lib/data';

import { ArticleList } from '@/features/articles/article-list';

export default function Page() {
  return (
    <>
      <Header title="記事一覧" showBackButton={false} />
      <Suspense fallback={<LoadingSpinner fullHeight />}>
        <div className="p-3 sm:p-5">
          <ArticleList fetchArticlesFunc={fetchArticles} />
        </div>
      </Suspense>
    </>
  );
}

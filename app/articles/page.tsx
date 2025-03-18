import { fetchArticles } from '@/lib/data';

import { ArticleList } from '@/features/articles/article-list';

export default function Page() {
  return <ArticleList fetchArticlesFunc={fetchArticles} />;
}

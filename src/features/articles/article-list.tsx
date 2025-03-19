import { ArticleTileDto } from '@/lib/types';

import { ArticleTile } from './article-tile';

type ArticleListProps = {
  fetchArticlesFunc: () => Promise<ArticleTileDto[]>;
};

export async function ArticleList({ fetchArticlesFunc }: ArticleListProps) {
  const articles = await fetchArticlesFunc();

  return (
    <div className="mx-auto max-w-2xl">
      {articles.map((article) => (
        <ArticleTile key={article.id} article={article} />
      ))}
    </div>
  );
}

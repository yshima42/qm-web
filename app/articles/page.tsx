import { ArticleList } from '@/components/articles/article-list';
import { fetchArticles } from '@/lib/data';

export default function Page() {
  return <ArticleList fetchArticlesFunc={fetchArticles} />;
}

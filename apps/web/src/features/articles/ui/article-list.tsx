import { ArticleTileDto } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

import { enrichArticlesWithLikeStatus } from "@/features/articles/data/data";

import { ArticleTile } from "./article-tile";

type ArticleListProps = {
  fetchArticlesFunc: () => Promise<ArticleTileDto[]>;
};

export async function ArticleList({ fetchArticlesFunc }: ArticleListProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  const articles = await fetchArticlesFunc();

  // ログイン時はいいね状態を付与
  const articlesWithLikeStatus = isLoggedIn
    ? await enrichArticlesWithLikeStatus(articles)
    : articles;

  return (
    <div className="mx-auto max-w-2xl space-y-2">
      {articlesWithLikeStatus.map((article) => (
        <ArticleTile key={article.id} article={article} isLoggedIn={isLoggedIn} />
      ))}
    </div>
  );
}

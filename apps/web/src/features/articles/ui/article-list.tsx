import { ArticleTileDto } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

import { enrichArticlesWithLikeStatus } from "@/features/articles/data/data";

import { ArticleListContent } from "./article-list-content";

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

  return <ArticleListContent initialArticles={articlesWithLikeStatus} isLoggedIn={isLoggedIn} />;
}

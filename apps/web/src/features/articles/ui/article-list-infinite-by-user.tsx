"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { AppDownloadSection } from "@quitmate/ui";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";

import { createClient } from "@/lib/supabase/client";
import { ArticleTileDto } from "@/lib/types";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ARTICLE_SELECT_QUERY } from "../data/constants";
import { ArticleTile } from "./article-tile";

const PAGE_SIZE = 20;

type Props = {
  userId: string;
  isLoggedIn: boolean;
};

export function ArticleListInfiniteByUser({ userId, isLoggedIn }: Props) {
  const boundaryTimeRef = useRef(new Date().toISOString());
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteQuery({
      queryKey: ["articles", "user", userId],
      queryFn: async ({ pageParam }) => {
        const supabase = createClient();
        const from = pageParam * PAGE_SIZE;
        const to = (pageParam + 1) * PAGE_SIZE - 1;

        // 記事取得
        const { data: articles, error } = await supabase
          .from("articles")
          .select(ARTICLE_SELECT_QUERY)
          .eq("user_id", userId)
          .lte("created_at", boundaryTimeRef.current)
          .order("created_at", { ascending: false })
          .order("id", { ascending: false })
          .range(from, to);

        if (error) {
          throw new Error("Failed to fetch articles");
        }

        const articleList = (articles ?? []) as ArticleTileDto[];

        // いいね状態を取得
        const {
          data: { user },
        } = await supabase.auth.getUser();

        let articlesWithLikes = articleList;
        if (user && articleList.length > 0) {
          const articleIds = articleList.map((a) => a.id);
          const { data: likeData } = await supabase.rpc("article_get_published_tile_data", {
            article_ids: articleIds,
            current_user_id: user.id,
          });

          const likeMap = new Map(
            (likeData as { article_json: { id: string }; is_liked_by_user: boolean }[])?.map(
              (l) => [l.article_json.id, l.is_liked_by_user],
            ) ?? [],
          );

          articlesWithLikes = articleList.map((article) => ({
            ...article,
            isLikedByMe: likeMap.get(article.id) ?? false,
          }));
        }

        return {
          articles: articlesWithLikes,
          hasMore: articleList.length === PAGE_SIZE,
        };
      },
      getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length : undefined),
      initialPageParam: 0,
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const articles = data?.pages.flatMap((page) => page.articles) ?? [];

  if (isError) {
    return <div className="text-destructive py-8 text-center">記事の読み込みに失敗しました</div>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      {articles.map((article) => (
        <ArticleTile key={article.id} article={article} isLoggedIn={isLoggedIn} />
      ))}

      <div ref={ref} className="py-4">
        {(isLoading || isFetchingNextPage) && (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        )}
        {!hasNextPage && articles.length > 0 && (
          <p className="text-muted-foreground py-4 text-center text-sm">
            すべての記事を読み込みました
          </p>
        )}
        {articles.length === 0 && !isLoading && (
          <p className="text-muted-foreground py-8 text-center text-sm">まだ記事がありません</p>
        )}
      </div>

      <div className="mt-8">
        <AppDownloadSection />
      </div>
    </div>
  );
}

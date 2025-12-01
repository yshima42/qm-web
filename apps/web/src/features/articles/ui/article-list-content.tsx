"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import type { ArticleTileDto } from "@/lib/types";
import { usePullToRefresh } from "@/features/common/hooks/use-pull-to-refresh";
import { PullToRefreshIndicator } from "@/features/common/ui/pull-to-refresh-indicator";

import { ArticleTile } from "./article-tile";

type ArticleListContentProps = {
  initialArticles: ArticleTileDto[];
  isLoggedIn: boolean;
};

export function ArticleListContent({ initialArticles, isLoggedIn }: ArticleListContentProps) {
  const router = useRouter();
  const tPull = useTranslations("pull-to-refresh");
  const [articles, setArticles] = useState(initialArticles);

  useEffect(() => {
    setArticles(initialArticles);
  }, [initialArticles]);

  const { isRefreshing, pullProgress, shouldShowIndicator } = usePullToRefresh({
    onRefresh: async () => {
      router.refresh();
    },
  });

  return (
    <>
      <PullToRefreshIndicator
        isRefreshing={isRefreshing}
        pullProgress={pullProgress}
        shouldShow={shouldShowIndicator}
        idleLabel={tPull("pullToRefresh")}
        refreshingLabel={tPull("refreshing")}
      />
      <div className="mx-auto max-w-2xl space-y-2">
        {articles.map((article) => (
          <ArticleTile key={article.id} article={article} isLoggedIn={isLoggedIn} />
        ))}
      </div>
    </>
  );
}

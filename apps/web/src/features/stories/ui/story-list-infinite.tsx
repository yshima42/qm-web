"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useTranslations } from "next-intl";

import { TranslatedAppDownloadSection } from "@/components/ui/translated-app-download-section";

import { HabitCategoryName, HabitTileDto } from "@/lib/types";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { useInfiniteStories } from "../hooks/use-infinite-stories";
import { StoryTile } from "./story-tile";
import { StoryInlineForm } from "./story-inline-form";

type Props = {
  category: HabitCategoryName;
  isLoggedIn: boolean;
  habits?: HabitTileDto[];
  currentUserId?: string;
};

export function StoryListInfinite({ category, isLoggedIn, habits, currentUserId }: Props) {
  const t = useTranslations("stories");
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px", // 少し早めに読み込み開始
  });

  // クライアントサイドでデータを取得（Xと同様のパターン）
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    resetAndRefetch,
    addStoryToTimeline,
  } = useInfiniteStories(category);

  // スクロールで次のページを読み込み
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 全ページのストーリーをフラットに結合
  const stories = data?.pages.flatMap((page) => page.stories) ?? [];

  if (isError) {
    return (
      <div className="text-destructive py-8 text-center">
        {t("errorLoading", { defaultValue: "ストーリーの読み込みに失敗しました" })}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {habits && habits.length > 0 && (
        <StoryInlineForm
          habits={habits}
          onStoryCreated={resetAndRefetch}
          onStoryCreatedWithId={addStoryToTimeline}
        />
      )}

      {stories.map((story) => (
        <StoryTile
          key={story.id}
          story={story}
          isLoggedIn={isLoggedIn}
          currentUserId={currentUserId}
        />
      ))}

      {/* ローディング & 読み込みトリガー */}
      <div ref={ref} className="py-4">
        {(isLoading || isFetchingNextPage) && (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        )}
        {!hasNextPage && stories.length > 0 && (
          <p className="text-muted-foreground py-4 text-center text-sm">
            {t("noMoreStories", { defaultValue: "すべてのストーリーを読み込みました" })}
          </p>
        )}
        {stories.length === 0 && !isLoading && (
          <p className="text-muted-foreground py-8 text-center text-sm">
            {t("noStories", { defaultValue: "まだストーリーがありません" })}
          </p>
        )}
      </div>

      <div className="mt-8">
        <TranslatedAppDownloadSection />
      </div>
    </div>
  );
}

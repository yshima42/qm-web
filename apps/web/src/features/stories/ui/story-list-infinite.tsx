"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useTranslations } from "next-intl";

import { TranslatedAppDownloadSection } from "@/components/ui/translated-app-download-section";

import { HabitCategoryName, HabitTileDto } from "@/lib/types";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { useInfiniteStories } from "../hooks/use-infinite-stories";
import { usePullToRefresh } from "../hooks/use-pull-to-refresh";
import { StoryTile } from "./story-tile";
import { StoryInlineForm } from "./story-inline-form";
import { PullToRefreshIndicator } from "./pull-to-refresh-indicator";

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
    rootMargin: "100px",
  });

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

  const { isRefreshing, pullProgress, shouldShowIndicator } = usePullToRefresh({
    onRefresh: resetAndRefetch,
    enabled: true,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const stories = data?.pages.flatMap((page) => page.stories) ?? [];

  if (isError) {
    return (
      <div className="text-destructive py-8 text-center">
        {t("errorLoading", { defaultValue: "ストーリーの読み込みに失敗しました" })}
      </div>
    );
  }

  return (
    <>
      <PullToRefreshIndicator
        isRefreshing={isRefreshing || isLoading}
        pullProgress={pullProgress}
        shouldShow={shouldShowIndicator}
      />
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
    </>
  );
}

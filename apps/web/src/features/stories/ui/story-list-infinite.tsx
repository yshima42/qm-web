"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useTranslations } from "next-intl";

import { TranslatedAppDownloadSection } from "@/components/ui/translated-app-download-section";

import { HabitCategoryName, HabitTileDto } from "@/lib/types";
import { useInfiniteStories } from "../hooks/use-infinite-stories";
import { StoryListSkeleton } from "./story-tile-skeleton";
import { usePullToRefresh } from "@/features/common/hooks/use-pull-to-refresh";
import { StoryTile } from "./story-tile";
import { StoryInlineForm } from "./story-inline-form";
import { PullToRefreshIndicator } from "@/features/common/ui/pull-to-refresh-indicator";
import { FeedCtaCard } from "@/features/common/ui/feed-cta-card";

type Props = {
  category: HabitCategoryName;
  isLoggedIn: boolean;
  habits?: HabitTileDto[];
  currentUserId?: string;
};

export function StoryListInfinite({ category, isLoggedIn, habits, currentUserId }: Props) {
  const t = useTranslations("stories");
  const tPull = useTranslations("pull-to-refresh");
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

  if (isLoading) {
    return <StoryListSkeleton />;
  }

  return (
    <>
      <PullToRefreshIndicator
        isRefreshing={isRefreshing}
        pullProgress={pullProgress}
        shouldShow={shouldShowIndicator}
        idleLabel={tPull("pullToRefresh")}
        refreshingLabel={tPull("refreshing")}
      />
      <div className="mx-auto max-w-[600px]">
        {habits && habits.length > 0 && (
          <StoryInlineForm
            habits={habits}
            onStoryCreated={resetAndRefetch}
            onStoryCreatedWithId={addStoryToTimeline}
          />
        )}

        {stories.map((story, index) => (
          <div key={story.id}>
            <StoryTile story={story} isLoggedIn={isLoggedIn} currentUserId={currentUserId} />
            {!isLoggedIn && index === 2 && <FeedCtaCard />}
            {!isLoggedIn && index > 2 && index % 10 === 9 && <FeedCtaCard />}
          </div>
        ))}

        <div ref={ref} className="py-4">
          {isFetchingNextPage && (
            <div className="flex justify-center">
              <StoryListSkeleton count={2} />
            </div>
          )}
          {!hasNextPage && stories.length > 0 && (
            <p className="text-muted-foreground py-4 text-center text-sm">
              {t("noMoreStories", { defaultValue: "すべてのストーリーを読み込みました" })}
            </p>
          )}
          {stories.length === 0 && (
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

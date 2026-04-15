"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { FeedGate } from "@/features/common/ui/feed-cta-card";

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

  // 実際にビューポートに表示された投稿数をカウント
  const [viewedCount, setViewedCount] = useState(0);
  const viewedIdsRef = useRef(new Set<string>());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const storyRefCallback = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    observerRef.current?.observe(node);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.storyId;
            if (id && !viewedIdsRef.current.has(id)) {
              viewedIdsRef.current.add(id);
              setViewedCount(viewedIdsRef.current.size);
            }
          }
        }
      },
      { threshold: 0.5 },
    );
    return () => observerRef.current?.disconnect();
  }, []);

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

        {stories.map((story) => (
          <div key={story.id} ref={storyRefCallback} data-story-id={story.id}>
            <StoryTile story={story} isLoggedIn={isLoggedIn} currentUserId={currentUserId} />
          </div>
        ))}

        {!isLoggedIn && <FeedGate viewedCount={viewedCount} />}

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

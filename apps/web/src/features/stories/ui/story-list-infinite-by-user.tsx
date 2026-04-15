"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useTranslations } from "next-intl";

import { TranslatedAppDownloadSection } from "@/components/ui/translated-app-download-section";

import { useInfiniteStoriesByUserId } from "../hooks/use-infinite-stories-by-user";
import { StoryTile } from "./story-tile";
import { StoryListSkeleton } from "./story-tile-skeleton";

type Props = {
  userId: string;
  isLoggedIn: boolean;
  /** ストーリー投稿者がミュートされているかどうか */
  isMutedOwner?: boolean;
  currentUserId?: string;
};

export function StoryListInfiniteByUser({
  userId,
  isLoggedIn,
  isMutedOwner = false,
  currentUserId,
}: Props) {
  const t = useTranslations("stories");
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteStoriesByUserId(userId);

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
    <div className="mx-auto max-w-[600px]">
      {stories.map((story) => (
        <StoryTile
          key={story.id}
          story={story}
          isLoggedIn={isLoggedIn}
          isMutedOwner={isMutedOwner}
          currentUserId={currentUserId}
        />
      ))}

      <div ref={ref} className="py-4">
        {isFetchingNextPage && <StoryListSkeleton count={2} />}
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

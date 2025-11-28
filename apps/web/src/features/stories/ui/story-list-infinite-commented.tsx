"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useTranslations } from "next-intl";

import { TranslatedAppDownloadSection } from "@/components/ui/translated-app-download-section";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { useInfiniteCommentedStories } from "../hooks/use-infinite-commented-stories";
import { StoryTile } from "./story-tile";

type Props = {
  userId: string;
  isLoggedIn: boolean;
  currentUserId?: string;
};

export function StoryListInfiniteCommented({ userId, isLoggedIn, currentUserId }: Props) {
  const t = useTranslations("stories");
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteCommentedStories(userId);

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
    <div className="mx-auto max-w-2xl">
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
  );
}

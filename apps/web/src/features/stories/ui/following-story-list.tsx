"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useTranslations } from "next-intl";
import { UserPlus } from "lucide-react";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { HabitTileDto } from "@/lib/types";

import { useInfiniteFollowingStories } from "../hooks/use-infinite-following-stories";
import { StoryTile } from "./story-tile";
import { StoryInlineForm } from "./story-inline-form";

type Props = {
  habits?: HabitTileDto[];
  currentUserId?: string;
};

export function FollowingStoryList({ habits, currentUserId }: Props) {
  const t = useTranslations("stories-tab");
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteFollowingStories();

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
        {t("errorLoading", { defaultValue: "読み込みに失敗しました" })}
      </div>
    );
  }

  // 空状態
  if (!isLoading && stories.length === 0) {
    return (
      <div className="mx-auto max-w-2xl">
        {habits && habits.length > 0 && <StoryInlineForm habits={habits} />}
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-muted mb-4 rounded-full p-4">
            <UserPlus className="text-muted-foreground size-8" />
          </div>
          <h3 className="text-foreground mb-2 text-lg font-semibold">{t("emptyTitle")}</h3>
          <p className="text-muted-foreground max-w-sm text-sm">{t("emptyMessage")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {habits && habits.length > 0 && <StoryInlineForm habits={habits} />}

      {stories.map((story) => (
        <StoryTile key={story.id} story={story} isLoggedIn={true} currentUserId={currentUserId} />
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
            {t("noMoreStories", { defaultValue: "すべての投稿を読み込みました" })}
          </p>
        )}
      </div>
    </div>
  );
}

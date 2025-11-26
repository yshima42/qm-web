"use client";

import { AutoLinkText, CommentIcon, StoryLikeIcon } from "@quitmate/ui";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { StoryTileDto } from "@/lib/types";

import { LoginPromptDialog } from "@/components/ui/login-prompt-dialog";
import { CategoryTag } from "@/features/common/ui/category-tag";
import { UserAvatar } from "@/features/profiles/ui/user-avatar";
import { toggleStoryLike } from "@/features/stories/data/actions";

type Props = {
  story: StoryTileDto;
  disableLink?: boolean;
  showFullContent?: boolean;
  isLoggedIn?: boolean;
};

export function StoryTile({
  story,
  disableLink = false,
  showFullContent = false,
  isLoggedIn = false,
}: Props) {
  const router = useRouter();

  // いいね状態の管理（楽観的更新）
  const [isLiked, setIsLiked] = useState(story.isLikedByMe ?? false);
  const [likesCount, setLikesCount] = useState(story.likes[0]?.count ?? 0);
  const [isPending, startTransition] = useTransition();

  const handleLike = () => {
    const shouldLike = !isLiked;

    // 楽観的更新（即座にUI更新）
    setIsLiked(shouldLike);
    setLikesCount((prev) => (shouldLike ? prev + 1 : prev - 1));

    // バックグラウンドでDB保存
    startTransition(async () => {
      const result = await toggleStoryLike(story.id, shouldLike);
      if (!result.success) {
        // 失敗時はロールバック
        setIsLiked(!shouldLike);
        setLikesCount((prev) => (shouldLike ? prev - 1 : prev + 1));
      }
    });
  };

  // storyDateをUTC時間から東京時間に変換
  const storyDate = toZonedTime(new Date(story.created_at), "Asia/Tokyo");
  const currentYear = new Date().getFullYear();
  const storyYear = storyDate.getFullYear();

  // 今日の日付を取得して東京時間に変換
  const today = toZonedTime(new Date(), "Asia/Tokyo");
  const isToday =
    storyDate.getDate() === today.getDate() &&
    storyDate.getMonth() === today.getMonth() &&
    storyDate.getFullYear() === today.getFullYear();

  // 今日の場合は時間のみ、今年の場合は月日と時間、それ以外は年月日と時間を表示
  let dateFormat;
  if (isToday) {
    dateFormat = "H:mm";
  } else if (storyYear === currentYear) {
    dateFormat = "M/d H:mm";
  } else {
    dateFormat = "yyyy/M/d H:mm";
  }

  const createdAt = format(storyDate, dateFormat, {
    locale: ja,
  });

  const maxContentLength = 120;
  const isContentTruncated = !showFullContent && story.content.length > maxContentLength;
  const displayContent = isContentTruncated
    ? `${story.content.substring(0, maxContentLength)}...`
    : story.content;

  const handleClick = () => {
    if (!disableLink) {
      router.push(`/${story.profiles.user_name}/stories/${story.id}`);
    }
  };

  // リンクの伝播を止めるハンドラー
  const handleContentClick = (e: React.MouseEvent) => {
    // テキスト内のリンク（AutoLinkText内のa要素）がクリックされた場合のみ
    // イベントの伝播を停止する。それ以外はタイル全体のクリックを有効にする
    if ((e.target as HTMLElement).tagName === "A") {
      e.stopPropagation();
    }
  };

  return (
    <div
      className="hover:bg-accent/5 block cursor-pointer border-b border-gray-300 transition-colors dark:border-gray-700"
      onClick={handleClick}
    >
      <div className="flex px-0 py-4">
        {/* アバター部分 */}
        <div
          className="mr-3"
          onClick={(e) => {
            e.stopPropagation();
            // ここでプロフィールページに遷移
            router.push(`/${story.profiles.user_name}`);
          }}
        >
          <UserAvatar
            username={story.profiles.user_name}
            displayName={story.profiles.display_name}
            avatarUrl={story.profiles.avatar_url}
            size="md"
          />
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1">
          {/* ヘッダー */}
          <div
            className="mb-1 flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Link href={`/${story.profiles.user_name}`} className="hover:underline">
              <span className="text-foreground font-bold">{story.profiles.display_name}</span>
            </Link>
            <Link href={`/${story.profiles.user_name}`} className="hover:underline">
              <span className="text-muted-foreground text-sm">@{story.profiles.user_name}</span>
            </Link>
            <span className="text-muted-foreground text-sm"> </span>
            <span className="text-muted-foreground text-sm">{createdAt}</span>
          </div>

          {/* クリック可能領域 - 全体がクリック可能になったので特別なクラスは不要 */}
          <div>
            {/* 習慣カテゴリーとカウント */}
            <div className="mb-2 flex items-center gap-2">
              <CategoryTag
                category={story.habit_categories.habit_category_name}
                customHabitName={story.custom_habit_name}
                elapsedDays={story.trial_elapsed_days}
              />
            </div>

            {/* 本文 - AutoLinkTextを使用 */}
            <div className="text-foreground mb-3 whitespace-pre-wrap" onClick={handleContentClick}>
              <AutoLinkText text={displayContent} />
              {isContentTruncated && (
                <span className="ml-1 cursor-pointer text-sm font-medium text-green-800 dark:text-green-500">
                  もっと見る
                </span>
              )}
            </div>
          </div>

          {/* アクション */}
          <div className="text-muted-foreground flex gap-6">
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="inline-flex"
            >
              <div className="flex items-center gap-1">
                <CommentIcon className="size-5" />
                <span className="text-sm">{story.comments[0]?.count ?? 0}</span>
              </div>
            </div>

            <div onClick={(e) => e.stopPropagation()} className="inline-flex">
              {isLoggedIn ? (
                <button
                  onClick={handleLike}
                  disabled={isPending}
                  className="flex cursor-pointer items-center gap-1 transition-colors disabled:opacity-50"
                >
                  <StoryLikeIcon
                    className={`size-5 transition-colors ${
                      isLiked ? "fill-green-600 text-green-600" : ""
                    }`}
                  />
                  <span className={`text-sm ${isLiked ? "text-green-600" : ""}`}>{likesCount}</span>
                </button>
              ) : (
                <LoginPromptDialog className="cursor-pointer">
                  <div className="flex items-center gap-1">
                    <StoryLikeIcon className="size-5" />
                    <span className="text-sm">{likesCount}</span>
                  </div>
                </LoginPromptDialog>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

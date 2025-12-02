"use client";

import { AutoLinkText, CommentIcon, StoryLikeIcon } from "@quitmate/ui";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { MoreHorizontal, VolumeX, Volume2, Trash2, Flag } from "lucide-react";
import { useTranslations } from "next-intl";

import { StoryTileDto } from "@/lib/types";

import { LoginPromptDialog } from "@/components/ui/login-prompt-dialog";
import { CategoryTag } from "@/features/common/ui/category-tag";
import { UserAvatar } from "@/features/profiles/ui/user-avatar";
import { toggleStoryLike, deleteStory } from "@/features/stories/data/actions";
import { muteUser, unmuteUser } from "@/features/profiles/data/actions";
import { ReportDialog } from "@/features/reports/ui/report-dialog";
import { ReportType } from "@/features/reports/domain/report-dto";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type Props = {
  story: StoryTileDto;
  disableLink?: boolean;
  showFullContent?: boolean;
  isLoggedIn?: boolean;
  currentUserId?: string;
  /** ストーリー投稿者がミュートされているかどうか（プロフィールページなどで使用） */
  isMutedOwner?: boolean;
};

export function StoryTile({
  story,
  disableLink = false,
  showFullContent = false,
  isLoggedIn = false,
  currentUserId,
  isMutedOwner = false,
}: Props) {
  const router = useRouter();
  const t = useTranslations("mute");
  const tDelete = useTranslations("delete");
  const tStories = useTranslations("stories");
  const tReport = useTranslations("report");

  // いいね状態の管理（楽観的更新）
  const [isLiked, setIsLiked] = useState(story.isLikedByMe ?? false);
  const [likesCount, setLikesCount] = useState(story.likes[0]?.count ?? 0);
  const [isPending, startTransition] = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMuteSuccess, setShowMuteSuccess] = useState(false);
  const [isMuted, setIsMuted] = useState(isMutedOwner);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  // propsが変わったらstateを同期
  useEffect(() => {
    setIsMuted(isMutedOwner);
  }, [isMutedOwner]);

  const isMyStory = currentUserId === story.user_id;

  const handleMute = () => {
    startTransition(async () => {
      const result = await muteUser(story.user_id);
      if (result.success) {
        setIsMuted(true);
        setSuccessMessage(t("success"));
        setShowMuteSuccess(true);
        setTimeout(() => setShowMuteSuccess(false), 3000);
        router.refresh();
      }
      setMenuOpen(false);
    });
  };

  const handleUnmute = () => {
    startTransition(async () => {
      const result = await unmuteUser(story.user_id);
      if (result.success) {
        setIsMuted(false);
        setSuccessMessage(t("unmuteSuccess"));
        setShowMuteSuccess(true);
        setTimeout(() => setShowMuteSuccess(false), 3000);
        router.refresh();
      }
      setMenuOpen(false);
    });
  };

  const handleDelete = () => {
    if (!confirm(tDelete("confirmStory"))) {
      return;
    }
    startTransition(async () => {
      const result = await deleteStory(story.id);
      if (result.success) {
        setShowDeleteSuccess(true);
        setTimeout(() => setShowDeleteSuccess(false), 3000);
        router.refresh();
      } else {
        // エラー時はコンソールに出力（将来的にスナックバーで表示する場合は翻訳を使用）
        console.error(tDelete("error"), result.error);
      }
      setMenuOpen(false);
    });
  };

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
          className="mr-2 md:mr-3"
          onClick={(e) => {
            e.stopPropagation();
            // ここでプロフィールページに遷移
            router.push(`/${story.profiles.user_name}`);
          }}
        >
          <div className="md:hidden">
            <UserAvatar
              username={story.profiles.user_name}
              displayName={story.profiles.display_name}
              avatarUrl={story.profiles.avatar_url}
              size="sm"
            />
          </div>
          <div className="hidden md:block">
            <UserAvatar
              username={story.profiles.user_name}
              displayName={story.profiles.display_name}
              avatarUrl={story.profiles.avatar_url}
              size="md"
            />
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1">
          {/* ヘッダー */}
          <div
            className="mb-1 flex items-center justify-between"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="flex items-center gap-1.5 md:gap-2">
              <Link href={`/${story.profiles.user_name}`} className="hover:underline">
                <span className="text-foreground text-sm font-bold md:text-base">
                  {story.profiles.display_name}
                </span>
              </Link>
              <Link href={`/${story.profiles.user_name}`} className="hover:underline">
                <span className="text-muted-foreground text-xs md:text-sm">
                  @{story.profiles.user_name}
                </span>
              </Link>
              <span className="text-muted-foreground text-xs md:text-sm"> </span>
              <span className="text-muted-foreground text-xs md:text-sm">{createdAt}</span>
            </div>

            {/* 三点リーダーメニュー */}
            {isLoggedIn && (
              <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isMyStory ? (
                    <DropdownMenuItem
                      onClick={handleDelete}
                      disabled={isPending}
                      className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                    >
                      <Trash2 className="mr-2 size-4" />
                      {tDelete("deleteStory")}
                    </DropdownMenuItem>
                  ) : (
                    <>
                      {isMuted ? (
                        <DropdownMenuItem
                          onClick={handleUnmute}
                          disabled={isPending}
                          className="cursor-pointer"
                        >
                          <Volume2 className="mr-2 size-4" />
                          {t("unmute")}
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={handleMute}
                          disabled={isPending}
                          className="cursor-pointer"
                        >
                          <VolumeX className="mr-2 size-4" />
                          {t("mute")}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => {
                          setReportDialogOpen(true);
                          setMenuOpen(false);
                        }}
                        className="cursor-pointer"
                      >
                        <Flag className="mr-2 size-4" />
                        {tReport("report")}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* クリック可能領域 - 全体がクリック可能になったので特別なクラスは不要 */}
          <div>
            {/* 習慣カテゴリーとカウント */}
            <div className="mb-1.5 flex items-center gap-1.5 md:mb-2 md:gap-2">
              <CategoryTag
                category={story.habit_categories.habit_category_name}
                customHabitName={story.custom_habit_name}
                elapsedDays={story.trial_elapsed_days}
                isReason={story.is_reason}
                tags={story.story_tags}
              />
            </div>

            {/* 本文 - AutoLinkTextを使用 */}
            <div
              className="text-foreground mb-2.5 whitespace-pre-wrap text-sm md:mb-3 md:text-base"
              onClick={handleContentClick}
            >
              <AutoLinkText text={displayContent} />
              {isContentTruncated && (
                <span className="ml-1 cursor-pointer text-xs font-medium text-green-800 md:text-sm dark:text-green-500">
                  {tStories("showMore")}
                </span>
              )}
            </div>
          </div>

          {/* アクション */}
          <div className="text-muted-foreground flex gap-4 md:gap-6">
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="inline-flex"
            >
              <div className="flex items-center gap-1">
                <CommentIcon className="size-4 md:size-5" />
                <span className="text-xs md:text-sm">{story.comments[0]?.count ?? 0}</span>
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
                    className={`size-4 transition-colors md:size-5 ${
                      isLiked ? "fill-green-600 text-green-600" : ""
                    }`}
                  />
                  <span className={`text-xs md:text-sm ${isLiked ? "text-green-600" : ""}`}>
                    {likesCount}
                  </span>
                </button>
              ) : (
                <LoginPromptDialog className="cursor-pointer">
                  <div className="flex items-center gap-1">
                    <StoryLikeIcon className="size-4 md:size-5" />
                    <span className="text-xs md:text-sm">{likesCount}</span>
                  </div>
                </LoginPromptDialog>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ミュート成功スナックバー */}
      {showMuteSuccess && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-green-600 px-4 py-2 text-white shadow-lg">
          {successMessage}
        </div>
      )}

      {/* 削除成功スナックバー */}
      {showDeleteSuccess && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-green-600 px-4 py-2 text-white shadow-lg">
          {tDelete("success")}
        </div>
      )}

      {/* 報告ダイアログ */}
      {!isMyStory && (
        <ReportDialog
          open={reportDialogOpen}
          onOpenChange={setReportDialogOpen}
          reportDTO={{ type: ReportType.story, itemId: story.id }}
        />
      )}
    </div>
  );
}

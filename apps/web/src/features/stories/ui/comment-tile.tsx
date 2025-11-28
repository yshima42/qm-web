"use client";

import { AppDownloadDialogTrigger } from "@quitmate/ui";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";
import { MessageCircle, MoreHorizontal, VolumeX, Volume2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { useTranslations } from "next-intl";

import { CommentTileDto } from "@/lib/types";

import { UserAvatar } from "@/features/profiles/ui/user-avatar";
import { muteUser, unmuteUser } from "@/features/profiles/data/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type Props = {
  comment: CommentTileDto;
  onReply?: (comment: CommentTileDto) => void;
  isLoggedIn?: boolean;
  canComment?: boolean;
  currentUserId?: string;
  /** コメント投稿者がミュートされているかどうか */
  isMutedOwner?: boolean;
};

export function CommentTile({
  comment,
  onReply,
  isLoggedIn,
  canComment,
  currentUserId,
  isMutedOwner = false,
}: Props) {
  const router = useRouter();
  const t = useTranslations("mute");

  const [menuOpen, setMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showMuteSuccess, setShowMuteSuccess] = useState(false);
  const [isMuted, setIsMuted] = useState(isMutedOwner);
  const [successMessage, setSuccessMessage] = useState("");

  const isMyComment = currentUserId === comment.user_id;

  // propsが変わったらstateを同期
  useEffect(() => {
    setIsMuted(isMutedOwner);
  }, [isMutedOwner]);

  const handleMute = () => {
    startTransition(async () => {
      const result = await muteUser(comment.user_id);
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
      const result = await unmuteUser(comment.user_id);
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
  // コメント日時を東京時間に変換
  const commentDate = toZonedTime(new Date(comment.created_at), "Asia/Tokyo");

  // 今日の日付を取得して東京時間に変換
  const today = toZonedTime(new Date(), "Asia/Tokyo");
  const currentYear = new Date().getFullYear();
  const commentYear = commentDate.getFullYear();

  const isToday =
    commentDate.getDate() === today.getDate() &&
    commentDate.getMonth() === today.getMonth() &&
    commentDate.getFullYear() === today.getFullYear();

  // 今日の場合は時間のみ、今年の場合は月日と時間、それ以外は年月日と時間を表示
  let dateFormat;
  if (isToday) {
    dateFormat = "H:mm";
  } else if (commentYear === currentYear) {
    dateFormat = "M/d H:mm";
  } else {
    dateFormat = "yyyy/M/d H:mm";
  }

  const createdAt = format(commentDate, dateFormat, {
    locale: ja,
  });

  return (
    <div className="border-border flex border-b p-3 pl-12">
      {/* アバター */}
      <div className="mr-2">
        <UserAvatar
          username={comment.profiles.user_name}
          displayName={comment.profiles.display_name}
          avatarUrl={comment.profiles.avatar_url}
          size="sm"
        />
      </div>

      {/* コメント本文 */}
      <div className="flex-1">
        <div className="mb-0.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Link href={`/${comment.profiles.user_name}`} className="hover:underline">
              <span className="text-foreground text-sm font-bold">
                {comment.profiles.display_name}
              </span>
            </Link>
            <Link href={`/${comment.profiles.user_name}`} className="hover:underline">
              <span className="text-muted-foreground text-xs">@{comment.profiles.user_name}</span>
            </Link>
            <span className="text-muted-foreground text-xs">・</span>
            <span className="text-muted-foreground text-xs">{createdAt}</span>
          </div>

          {/* 三点リーダーメニュー */}
          {isLoggedIn && !isMyComment && (
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-6">
                  <MoreHorizontal className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <p className="text-foreground whitespace-pre-wrap text-sm">
          {/* 返信先表示（返信コメントの場合） */}
          {comment.parent_comment?.profiles?.display_name && (
            <span className="text-primary mr-1 font-medium">
              @{comment.parent_comment.profiles.display_name}
            </span>
          )}
          {comment.content}
        </p>

        {/* アクションボタン */}
        <div className="mt-1 flex items-center gap-4">
          {/* 返信ボタン（ログイン時かつコメント可能な場合のみ表示） */}
          {isLoggedIn && canComment && onReply && (
            <button
              onClick={() => onReply(comment)}
              className="text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              <MessageCircle className="size-4" />
              <span className="text-xs">返信</span>
            </button>
          )}

          {/* いいねボタン */}
          <AppDownloadDialogTrigger className="cursor-pointer">
            <div className="text-muted-foreground flex items-center gap-1">
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="text-xs">{comment.comment_likes[0]?.count ?? 0}</span>
            </div>
          </AppDownloadDialogTrigger>
        </div>
      </div>

      {/* ミュート成功スナックバー */}
      {showMuteSuccess && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-green-600 px-4 py-2 text-white shadow-lg">
          {successMessage}
        </div>
      )}
    </div>
  );
}

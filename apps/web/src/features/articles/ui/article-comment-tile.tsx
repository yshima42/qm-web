"use client";

import { ArticleLikeIcon, AppDownloadDialogTrigger } from "@quitmate/ui";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { MoreHorizontal, Trash2 } from "lucide-react";

import { ArticleCommentTileDto } from "@/lib/types";

import { UserAvatar } from "@/features/profiles/ui/user-avatar";
import { deleteArticleComment } from "@/features/articles/data/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type Props = {
  comment: ArticleCommentTileDto;
  isLoggedIn?: boolean;
  currentUserId?: string;
};

export function ArticleCommentTile({ comment, isLoggedIn = false, currentUserId }: Props) {
  const router = useRouter();
  const tDelete = useTranslations("delete");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const isMyComment = currentUserId === comment.user_id;

  const handleDelete = () => {
    if (!confirm(tDelete("confirmComment"))) {
      return;
    }
    startTransition(async () => {
      const result = await deleteArticleComment(comment.id);
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
  const commentDate = new Date(comment.created_at);
  const currentYear = new Date().getFullYear();
  const commentYear = commentDate.getFullYear();

  // If current year, don't display year; otherwise include year
  const dateFormat = commentYear === currentYear ? "M/d H:mm" : "yyyy/M/d H:mm";
  const createdAt = format(commentDate, dateFormat, {
    locale: enUS,
  });

  return (
    <div className="border-border flex border-b p-3">
      {/* Avatar */}
      <div className="mr-2">
        <UserAvatar
          username={comment.profiles.user_name}
          displayName={comment.profiles.display_name}
          avatarUrl={comment.profiles.avatar_url}
          size="sm"
        />
      </div>

      {/* Comment body */}
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
            <span className="text-muted-foreground text-xs"> </span>
            <span className="text-muted-foreground text-xs">{createdAt}</span>
          </div>

          {/* 三点リーダーメニュー */}
          {isLoggedIn && isMyComment && (
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-6">
                  <MoreHorizontal className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={isPending}
                  className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                >
                  <Trash2 className="mr-2 size-4" />
                  {tDelete("deleteComment")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <p className="text-foreground whitespace-pre-wrap text-sm">{comment.content}</p>

        {/* Like button */}
        <div className="text-muted-foreground mt-1 flex items-center gap-1">
          <AppDownloadDialogTrigger className="cursor-pointer">
            <div className="flex items-center gap-1">
              <ArticleLikeIcon className="size-4" />
              <span className="text-xs">{comment.article_comment_likes[0]?.count ?? 0}</span>
            </div>
          </AppDownloadDialogTrigger>
        </div>
      </div>

      {/* 削除成功スナックバー */}
      {showDeleteSuccess && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-green-600 px-4 py-2 text-white shadow-lg">
          {tDelete("success")}
        </div>
      )}
    </div>
  );
}

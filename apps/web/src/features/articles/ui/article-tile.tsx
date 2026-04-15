"use client";

import { ArticleLikeIcon, CommentIcon } from "@quitmate/ui";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { ArticleTileDto } from "@/lib/types";

import { LoginPromptDialog } from "@/components/ui/login-prompt-dialog";
import { CategoryTag } from "@/features/common/ui/category-tag";
import { UserAvatar } from "@/features/profiles/ui/user-avatar";
import { toggleArticleLike } from "@/features/articles/data/actions";

/** Markdownの記法を除去してプレーンテキストを取得 */
function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/!\[.*?\]\(.+?\)/g, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/^>\s+/gm, "")
    .replace(/---+/g, "")
    .replace(/\n{2,}/g, " ")
    .trim();
}

type Props = {
  article: ArticleTileDto;
  isLoggedIn?: boolean;
};

export function ArticleTile({ article, isLoggedIn = false }: Props) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(article.isLikedByMe ?? false);
  const [likesCount, setLikesCount] = useState(article.article_likes[0]?.count ?? 0);
  const [, startTransition] = useTransition();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();

    const shouldLike = !isLiked;
    setIsLiked(shouldLike);
    setLikesCount((prev) => (shouldLike ? prev + 1 : prev - 1));

    startTransition(async () => {
      const result = await toggleArticleLike(article.id, shouldLike);
      if (!result.success) {
        setIsLiked(!shouldLike);
        setLikesCount((prev) => (shouldLike ? prev - 1 : prev + 1));
      }
    });
  };

  const articleDate = toZonedTime(new Date(article.created_at), "Asia/Tokyo");
  const currentYear = new Date().getFullYear();
  const articleYear = articleDate.getFullYear();
  const dateFormat = articleYear === currentYear ? "M/d H:mm" : "yyyy/M/d H:mm";
  const createdAt = format(articleDate, dateFormat, { locale: enUS });

  const articleUrl = `/${article.profiles.user_name}/articles/${article.id}`;
  const excerpt = stripMarkdown(article.content).slice(0, 160);

  const handleClick = () => {
    router.push(articleUrl);
  };

  return (
    <div
      className="border-border cursor-pointer overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md"
      onClick={handleClick}
    >
      <div className="p-4 md:p-5">
        {/* タイトル */}
        <h2 className="text-foreground mb-2 line-clamp-2 text-lg font-bold md:text-xl">
          {article.title}
        </h2>

        {/* カテゴリバッジ + 日付 */}
        <div className="mb-2 flex items-center justify-between">
          <CategoryTag
            category={article.habit_categories?.habit_category_name ?? "General"}
            customHabitName={article.custom_habit_name}
          />
          <span className="text-muted-foreground text-xs">{createdAt}</span>
        </div>

        {/* プレーンテキスト抜粋 */}
        <p className="text-muted-foreground mb-3 line-clamp-3 text-sm leading-relaxed">{excerpt}</p>

        {/* アクション + 著者情報 */}
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex gap-4">
            <div className="flex items-center gap-1">
              <CommentIcon className="size-4" />
              <span className="text-xs">{article.article_comments[0]?.count ?? 0}</span>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              {isLoggedIn ? (
                <button
                  onClick={handleLike}
                  className="flex cursor-pointer items-center gap-1 transition-colors"
                >
                  <ArticleLikeIcon
                    className={`size-4 transition-colors ${isLiked ? "fill-red-500 text-red-500" : ""}`}
                  />
                  <span className={`text-xs ${isLiked ? "text-red-500" : ""}`}>{likesCount}</span>
                </button>
              ) : (
                <LoginPromptDialog className="cursor-pointer" type="article">
                  <div className="flex items-center gap-1">
                    <ArticleLikeIcon className="size-4" />
                    <span className="text-xs">{likesCount}</span>
                  </div>
                </LoginPromptDialog>
              )}
            </div>
          </div>

          {/* 著者情報 */}
          <div className="flex items-center gap-2">
            <UserAvatar
              username={article.profiles.user_name}
              displayName={article.profiles.display_name}
              avatarUrl={article.profiles.avatar_url}
              size="sm"
              linkable={false}
            />
            <span className="text-foreground text-xs font-medium">
              {article.profiles.display_name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

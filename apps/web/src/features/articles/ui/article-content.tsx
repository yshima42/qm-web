"use client";

import { CommentIcon, ArticleLikeIcon, ShareButton } from "@quitmate/ui";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { MoreHorizontal, Trash2, Flag } from "lucide-react";
import { toast } from "sonner";

import { MarkdownRenderer } from "@/lib/markdown-render";
import type { ArticleTileDto, ArticleCommentTileDto } from "@/lib/types";

import { LoginPromptDialog } from "@/components/ui/login-prompt-dialog";

import { ArticleCommentForm } from "@/features/articles/ui/article-comment-form";
import { ArticleCommentTile } from "@/features/articles/ui/article-comment-tile";
import { toggleArticleLike, deleteArticle } from "@/features/articles/data/actions";
import { UserAvatar } from "@/features/profiles/ui/user-avatar";
import { ReportDialog } from "@/features/reports/ui/report-dialog";
import { ReportType } from "@/features/reports/domain/report-dto";
import { TranslatedAppDownloadSection } from "@/components/ui/translated-app-download-section";

import { CategoryTag } from "@/features/common/ui/category-tag";
import { usePullToRefresh } from "@/features/common/hooks/use-pull-to-refresh";
import { PullToRefreshIndicator } from "@/features/common/ui/pull-to-refresh-indicator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type ArticleContentProps = {
  article: ArticleTileDto;
  comments: ArticleCommentTileDto[] | null;
  isLoggedIn?: boolean;
  currentUserId?: string;
};

export function ArticleContent({
  article,
  comments,
  isLoggedIn = false,
  currentUserId,
}: ArticleContentProps) {
  const router = useRouter();
  const t = useTranslations("articles-page");
  const tPull = useTranslations("pull-to-refresh");
  const tDelete = useTranslations("delete");
  const tReport = useTranslations("report");
  // いいね状態の管理（楽観的更新）
  const [isLiked, setIsLiked] = useState(article.isLikedByMe ?? false);
  const [likesCount, setLikesCount] = useState(article.article_likes[0]?.count ?? 0);
  const [isPending, startTransition] = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const isMyArticle = currentUserId === article.user_id;

  const handleLike = () => {
    const shouldLike = !isLiked;

    // 楽観的更新（即座にUI更新）
    setIsLiked(shouldLike);
    setLikesCount((prev) => (shouldLike ? prev + 1 : prev - 1));

    // バックグラウンドでDB保存
    startTransition(async () => {
      const result = await toggleArticleLike(article.id, shouldLike);
      if (!result.success) {
        // 失敗時はロールバック
        setIsLiked(!shouldLike);
        setLikesCount((prev) => (shouldLike ? prev - 1 : prev + 1));
      }
    });
  };

  const handleDelete = () => {
    if (!confirm(tDelete("confirmArticle"))) {
      return;
    }
    startTransition(async () => {
      const result = await deleteArticle(article.id);
      if (result.success) {
        toast.success(tDelete("success"));
        router.push(`/${article.profiles.user_name}`);
      } else {
        // エラー時はコンソールに出力（将来的にスナックバーで表示する場合は翻訳を使用）
        console.error(tDelete("error"), result.error);
      }
      setMenuOpen(false);
    });
  };

  const articleDate = toZonedTime(new Date(article.created_at), "Asia/Tokyo");
  const currentYear = new Date().getFullYear();
  const articleYear = articleDate.getFullYear();
  const dateFormat = articleYear === currentYear ? "M/d H:mm" : "yyyy/M/d H:mm";
  const createdAt = format(articleDate, dateFormat, { locale: enUS });

  const { isRefreshing, pullProgress, shouldShowIndicator } = usePullToRefresh({
    onRefresh: async () => {
      router.refresh();
    },
  });

  return (
    <>
      <PullToRefreshIndicator
        isRefreshing={isRefreshing}
        pullProgress={pullProgress}
        shouldShow={shouldShowIndicator}
        idleLabel={tPull("pullToRefresh")}
        refreshingLabel={tPull("refreshing")}
      />
      <main className="w-full p-3 sm:p-5">
        <div className="text-foreground mx-auto w-full max-w-[600px]">
          {/* Article header */}
          <div className="mb-8">
            <h1 className="text-foreground mb-6 text-2xl font-bold sm:hidden">{article.title}</h1>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CategoryTag
                  category={article.habit_categories?.habit_category_name ?? "General"}
                  customHabitName={article.custom_habit_name}
                />
                <span className="text-muted-foreground text-sm">{createdAt}</span>
              </div>

              <div className="flex items-center gap-4">
                {isLoggedIn ? (
                  <button
                    onClick={handleLike}
                    className="flex cursor-pointer items-center gap-1 transition-colors"
                  >
                    <ArticleLikeIcon
                      className={`size-5 transition-colors ${
                        isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`text-sm ${isLiked ? "text-red-500" : "text-muted-foreground"}`}
                    >
                      {likesCount}
                    </span>
                  </button>
                ) : (
                  <LoginPromptDialog className="cursor-pointer" type="article">
                    <div className="flex items-center gap-1">
                      <ArticleLikeIcon className="text-muted-foreground size-5" />
                      <span className="text-muted-foreground text-sm">{likesCount}</span>
                    </div>
                  </LoginPromptDialog>
                )}

                {isLoggedIn && (
                  <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {isMyArticle ? (
                        <DropdownMenuItem
                          onClick={handleDelete}
                          disabled={isPending}
                          className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                        >
                          <Trash2 className="mr-2 size-4" />
                          {tDelete("deleteArticle")}
                        </DropdownMenuItem>
                      ) : (
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
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                <ShareButton
                  url={`${process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.quitmate.app"}/${article.profiles.user_name}/articles/${article.id}`}
                  title={article.title}
                  text={`${article.title} | ${article.profiles.display_name}`}
                  dialogTitle={t("shareDialogTitle")}
                  className="p-0"
                />
              </div>
            </div>

            <div className="mb-8 flex items-center gap-3">
              <UserAvatar
                username={article.profiles.user_name}
                displayName={article.profiles.display_name}
                avatarUrl={article.profiles.avatar_url}
                size="md"
              />
              <div>
                <Link href={`/${article.profiles.user_name}`} className="hover:underline">
                  <p className="text-foreground font-medium">{article.profiles.display_name}</p>
                </Link>
                <p className="text-muted-foreground text-xs">@{article.profiles.user_name}</p>
              </div>
            </div>
          </div>

          <article className="prose dark:prose-invert lg:prose-lg max-w-none overflow-x-hidden break-words">
            <MarkdownRenderer content={article.content} />
          </article>

          <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {isLoggedIn ? (
                  <button
                    onClick={handleLike}
                    className="flex cursor-pointer items-center gap-2 transition-colors"
                  >
                    <ArticleLikeIcon
                      className={`size-5 transition-colors ${
                        isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
                      }`}
                    />
                    <span className={isLiked ? "text-red-500" : "text-muted-foreground"}>
                      {likesCount}
                    </span>
                  </button>
                ) : (
                  <LoginPromptDialog className="cursor-pointer" type="article">
                    <div className="flex items-center gap-2">
                      <ArticleLikeIcon className="text-muted-foreground size-5" />
                      <span className="text-muted-foreground">{likesCount}</span>
                    </div>
                  </LoginPromptDialog>
                )}
                <div className="flex items-center gap-2">
                  <CommentIcon className="text-muted-foreground size-5" />
                  <span className="text-muted-foreground">
                    {article.article_comments[0]?.count ?? 0}
                  </span>
                </div>
              </div>

              <ShareButton
                url={`${process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.quitmate.app"}/${article.profiles.user_name}/articles/${article.id}`}
                title={article.title}
                text={`${article.title} | ${article.profiles.display_name}`}
                dialogTitle={t("shareDialogTitle")}
              />
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-foreground mb-4 text-lg font-bold">
              Comments ({article.article_comments[0]?.count ?? 0})
            </h2>

            {/* コメントフォーム（ログイン時のみ表示） */}
            {isLoggedIn && <ArticleCommentForm articleId={article.id} />}

            <div className="border-border space-y-2 border-t">
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <ArticleCommentTile
                    key={comment.id}
                    comment={comment}
                    isLoggedIn={isLoggedIn}
                    currentUserId={currentUserId}
                  />
                ))
              ) : (
                <p className="text-muted-foreground py-4 text-center">No comments yet</p>
              )}
            </div>
          </div>

          <TranslatedAppDownloadSection
            customMessage={`${t("preFollowMessage")}${article.profiles.display_name}${t("postFollowMessage")}`}
          />
        </div>

        {/* 報告ダイアログ */}
        {!isMyArticle && (
          <ReportDialog
            open={reportDialogOpen}
            onOpenChange={setReportDialogOpen}
            reportDTO={{ type: ReportType.article, itemId: article.id }}
          />
        )}
      </main>
    </>
  );
}

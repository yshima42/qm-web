'use client';

import {
  CommentIcon,
  ArticleLikeIcon,
  AppDownloadDialogTrigger,
  ShareButton,
  AppDownloadSection,
} from '@quitmate/ui';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';
import Link from 'next/link';

import { MarkdownRenderer } from '@/lib/markdown-render';
import type { ArticleTileDto, ArticleCommentTileDto } from '@/lib/types';

import { ArticleCommentTile } from '@/features/articles/article-comment-tile';
import { UserAvatar } from '@/features/profiles/user-avatar';

import { CategoryTag } from '../common/category-tag';

type ArticleContentProps = {
  article: ArticleTileDto;
  comments: ArticleCommentTileDto[] | null;
};

export function ArticleContent({ article, comments }: ArticleContentProps) {
  const articleDate = toZonedTime(new Date(article.created_at), 'Asia/Tokyo');
  const currentYear = new Date().getFullYear();
  const articleYear = articleDate.getFullYear();
  const dateFormat = articleYear === currentYear ? 'M/d H:mm' : 'yyyy/M/d H:mm';
  const createdAt = format(articleDate, dateFormat, { locale: enUS });

  return (
    <main className="p-3 sm:p-5">
      <div className="mx-auto max-w-2xl bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        {/* Article header */}
        <div className="mb-8">
          <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white sm:hidden">
            {article.title}
          </h1>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CategoryTag
                category={article.habit_categories?.habit_category_name ?? 'General'}
                customHabitName={article.custom_habit_name}
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">{createdAt}</span>
            </div>

            <div className="flex items-center gap-4">
              <AppDownloadDialogTrigger className="cursor-pointer">
                <div className="flex items-center gap-1">
                  <ArticleLikeIcon className="size-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {article.article_likes[0]?.count ?? 0}
                  </span>
                </div>
              </AppDownloadDialogTrigger>

              <ShareButton
                url={`${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.quitmate.app'}/${article.profiles.user_name}/articles/${article.id}`}
                title={article.title}
                text={`${article.title} | ${article.profiles.display_name}`}
                dialogTitle="Share Article"
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
                <p className="font-medium text-gray-900 dark:text-white">
                  {article.profiles.display_name}
                </p>
              </Link>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                @{article.profiles.user_name}
              </p>
            </div>
          </div>
        </div>

        <article className="prose max-w-none dark:prose-invert lg:prose-lg">
          <MarkdownRenderer content={article.content} />
        </article>

        <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <AppDownloadDialogTrigger className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <ArticleLikeIcon className="size-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {article.article_likes[0]?.count ?? 0}
                  </span>
                </div>
              </AppDownloadDialogTrigger>
              <AppDownloadDialogTrigger className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <CommentIcon className="size-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {article.article_comments[0]?.count ?? 0}
                  </span>
                </div>
              </AppDownloadDialogTrigger>
            </div>

            <ShareButton
              url={`${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.quitmate.app'}/${article.profiles.user_name}/articles/${article.id}`}
              title={article.title}
              text={`${article.title} | ${article.profiles.display_name}`}
              dialogTitle="Share Article"
            />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
            Comments ({article.article_comments[0]?.count ?? 0})
          </h2>
          <div className="space-y-2 border-t border-gray-200 dark:border-gray-800">
            {comments && comments.length > 0 ? (
              comments.map((comment) => <ArticleCommentTile key={comment.id} comment={comment} />)
            ) : (
              <p className="py-4 text-center text-gray-500 dark:text-gray-400">No comments yet</p>
            )}
          </div>
        </div>

        <AppDownloadSection
          message={`Follow ${article.profiles.display_name} on the app`}
        />
      </div>
    </main>
  );
}


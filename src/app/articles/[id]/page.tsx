import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { DefaultAvatar } from '@/components/custom/default-avatar';
import { CommentIcon, ArticleLikeIcon } from '@/components/custom/icon';
import { Tag } from '@/components/custom/tag';
import { Header } from '@/components/layout/header';

import { CATEGORY_DISPLAY_NAMES } from '@/lib/categories';
import { fetchArticleById, fetchCommentsByArticleId } from '@/lib/data';
import { HabitCategoryName } from '@/lib/types';

import { ArticleCommentTile } from '@/features/articles/article-comment-tile';

type Props = {
  params: {
    id: string;
  };
};

export default async function ArticlePage({ params }: Props) {
  // 後で子コンポーネントに移動し、suspenseで読み込む。多分
  const [article, comments] = await Promise.all([
    fetchArticleById(params.id),
    fetchCommentsByArticleId(params.id),
  ]);

  if (!article) {
    notFound();
  }

  const articleDate = new Date(article.created_at);
  const currentYear = new Date().getFullYear();
  const articleYear = articleDate.getFullYear();

  // 今年の場合は年を表示せず、そうでない場合は年を含める
  const dateFormat = articleYear === currentYear ? 'M/d H:mm' : 'yyyy/M/d H:mm';
  const createdAt = format(articleDate, dateFormat, {
    locale: ja,
  });

  // カテゴリー名を日本語に変換
  const categoryDisplayName =
    CATEGORY_DISPLAY_NAMES[article.habit_categories.habit_category_name as HabitCategoryName] ||
    article.habit_categories.habit_category_name;

  return (
    <>
      <Header title={article.title} backUrl="/articles" />
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <main className="mx-auto max-w-2xl px-2 py-6 sm:px-3">
          {/* 記事ヘッダー */}
          <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* 英語名を日本語名に変換して表示 */}
                <Tag>{categoryDisplayName}</Tag>
                <span className="text-sm text-gray-500 dark:text-gray-400">{createdAt}</span>
              </div>

              {/* いいねとコメントカウント（上部に表示） */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <ArticleLikeIcon className="size-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {article.article_likes[0]?.count ?? 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6 flex items-center gap-3">
              <Link href={`/profiles/${article.user_id}`} className="block">
                <div className="size-9 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  {article.profiles.avatar_url ? (
                    <Image
                      src={article.profiles.avatar_url}
                      alt="プロフィール画像"
                      width={36}
                      height={36}
                      className="object-cover"
                    />
                  ) : (
                    <DefaultAvatar size="md" className="size-full bg-gray-200 dark:bg-gray-700" />
                  )}
                </div>
              </Link>
              <div>
                <Link href={`/profiles/${article.user_id}`} className="hover:underline">
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

          {/* 記事本文 (Markdown) */}
          <div className="prose prose-gray prose-base dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
          </div>

          {/* 記事フッター */}
          <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <ArticleLikeIcon className="size-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {article.article_likes[0]?.count ?? 0}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CommentIcon className="size-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {article.article_comments[0]?.count ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* コメントセクション - 背景色を削除 */}
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              コメント ({article.article_comments[0]?.count ?? 0})
            </h2>
            <div className="space-y-2 border-t border-gray-200 dark:border-gray-800">
              {comments.length > 0 ? (
                comments.map((comment) => <ArticleCommentTile key={comment.id} comment={comment} />)
              ) : (
                <p className="py-4 text-center text-gray-500 dark:text-gray-400">
                  コメントはまだありません
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

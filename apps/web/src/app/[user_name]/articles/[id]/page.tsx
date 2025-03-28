import { CommentIconWithDownload, ArticleLikeIconWithDownload, Tag } from '@quitmate/ui';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Header } from '@/components/layout/header';

import { CATEGORY_DISPLAY_NAMES, getCategoryDisplayName } from '@/lib/categories';
import { fetchArticleById, fetchCommentsByArticleId } from '@/lib/data';
import { MarkdownRenderer } from '@/lib/markdown-render';
import { HabitCategoryName } from '@/lib/types';

import { ArticleCommentTile } from '@/features/articles/article-comment-tile';
import { UserAvatar } from '@/features/profiles/user-avatar';

// Props型を修正して現在のページコンポーネントと整合させる
type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const article = await fetchArticleById(id);

  if (!article) {
    return {
      title: '記事が見つかりません',
    };
  }

  const categoryDisplayName = getCategoryDisplayName(
    article.habit_categories.habit_category_name,
    article.custom_habit_name,
  );

  return {
    title: `${article.title} | ${categoryDisplayName}`,
    description: article.content.substring(0, 300) || '記事詳細ページです',
  };
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  // 後で子コンポーネントに移動し、suspenseで読み込む。多分
  const [article, comments] = await Promise.all([
    fetchArticleById(id),
    fetchCommentsByArticleId(id),
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
      <Header
        title={article.title}
        backUrl="/articles"
        hideTitle={{ mobile: true, desktop: true }}
      />
      <main className="p-3 sm:p-5">
        <div className="mx-auto max-w-2xl bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
          {/* 記事ヘッダー */}
          <div className="mb-8">
            {/* 常に表示されるタイトル（モバイルとデスクトップ両方） */}
            <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              {article.title}
            </h1>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* 英語名を日本語名に変換して表示 */}
                <Tag>{categoryDisplayName}</Tag>
                <span className="text-sm text-gray-500 dark:text-gray-400">{createdAt}</span>
              </div>

              {/* いいねとコメントカウント（上部に表示） */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <ArticleLikeIconWithDownload className="size-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {article.article_likes[0]?.count ?? 0}
                  </span>
                </div>
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

          {/* 記事本文 (Markdown) */}
          <article className="prose max-w-none dark:prose-invert lg:prose-lg">
            <MarkdownRenderer content={article.content} />
          </article>

          {/* 記事フッター */}
          <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <ArticleLikeIconWithDownload className="size-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {article.article_likes[0]?.count ?? 0}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CommentIconWithDownload className="size-5 text-gray-500 dark:text-gray-400" />
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
        </div>
      </main>
    </>
  );
}

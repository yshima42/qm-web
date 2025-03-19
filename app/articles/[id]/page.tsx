import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArticleCommentTile } from '@/components/articles/article-comment-tile';
import { Tag } from '@/components/ui/tag';

import { fetchArticleById, fetchCommentsByArticleId } from '@/lib/data';

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

  const createdAt = formatDistanceToNow(new Date(article.created_at), {
    addSuffix: true,
    locale: ja,
  });

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 border-b border-gray-200">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/articles" className="text-gray-600 hover:text-gray-900">
            ← 記事一覧に戻る
          </Link>
          {/* いいねボタンなどのアクションボタンをここに追加予定 */}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* 記事ヘッダー */}
        <div className="mb-8">
          <div className="mb-6 flex items-center gap-4">
            <Link href={`/profiles/${article.user_id}`} className="block">
              <div className="size-16 overflow-hidden rounded-full">
                {article.profiles.avatar_url ? (
                  <Image
                    src={article.profiles.avatar_url}
                    alt="プロフィール画像"
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                ) : (
                  <div className="size-full bg-gray-200" />
                )}
              </div>
            </Link>
            <div>
              <Link href={`/profiles/${article.user_id}`} className="hover:underline">
                <p className="text-lg font-bold">{article.profiles.display_name}</p>
              </Link>
              <p className="text-gray-500">@{article.profiles.user_name}</p>
            </div>
          </div>

          <h1 className="mb-4 text-3xl font-bold">{article.title}</h1>

          <div className="mb-4 flex items-center gap-4 text-sm text-gray-500">
            <span>{createdAt}</span>
            <Tag>{article.habit_categories.habit_category_name}</Tag>
          </div>
        </div>

        {/* 記事本文 */}
        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap">{article.content}</div>
        </div>

        {/* 記事フッター */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>{article.article_likes[0]?.count ?? 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>{article.article_comments[0]?.count ?? 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* コメントセクション */}
        <div className="mt-12">
          <h2 className="mb-6 text-xl font-bold">
            コメント ({article.article_comments[0]?.count ?? 0})
          </h2>
          <div className="space-y-2">
            {comments.map((comment) => (
              <ArticleCommentTile key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

import { ArticleLikeIcon, CommentIcon, DefaultAvatar, Tag } from '@quitmate/ui';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { getCategoryDisplayName } from '@/lib/categories';
import { ArticleTileDto } from '@/lib/types';

type Props = {
  article: ArticleTileDto;
};

export function ArticleTile({ article }: Props) {
  const articleDate = new Date(article.created_at);
  const currentYear = new Date().getFullYear();
  const articleYear = articleDate.getFullYear();

  // 今年の場合は年を表示せず、そうでない場合は年を含める
  const dateFormat = articleYear === currentYear ? 'M/d H:mm' : 'yyyy/M/d H:mm';
  const createdAt = format(articleDate, dateFormat, {
    locale: ja,
  });

  // カテゴリー名を日本語に変換
  const categoryDisplayName = getCategoryDisplayName(
    article.habit_categories.habit_category_name,
    article.custom_habit_name,
  );

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md dark:border-gray-700">
      <Link href={`/${article.profiles.user_name}/articles/${article.id}`} className="block">
        <div className="p-4">
          {/* タイトル */}
          <h2 className="mb-1 line-clamp-2 text-xl font-bold text-gray-900 dark:text-white">
            {article.title}
          </h2>

          {/* カテゴリータグと日付 - 日本語表示に修正 */}
          <div className="mb-1 flex items-center justify-between">
            <Tag>{categoryDisplayName}</Tag>
            <span className="text-xs text-gray-500 dark:text-gray-400">{createdAt}</span>
          </div>

          {/* 記事の説明文 (Markdown) */}
          <div className="prose-sm mb-4 line-clamp-3 text-gray-700 dark:prose-invert prose-headings:my-0 prose-p:my-0 prose-li:my-0 dark:text-gray-300">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
          </div>

          {/* アクションとユーザー情報 */}
          <div className="flex items-center justify-between">
            {/* コメントといいね */}
            <div className="flex gap-4 text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <CommentIcon />
                <span className="text-sm">{article.article_comments[0]?.count ?? 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <ArticleLikeIcon />
                <span className="text-sm">{article.article_likes[0]?.count ?? 0}</span>
              </div>
            </div>

            {/* ユーザー情報 */}
            <div className="flex items-center">
              <div className="mr-2 size-6 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                {article.profiles.avatar_url ? (
                  <Image
                    src={article.profiles.avatar_url}
                    alt="プロフィール画像"
                    width={24}
                    height={24}
                    className="object-cover"
                  />
                ) : (
                  <DefaultAvatar size="sm" className="size-full bg-gray-200 dark:bg-gray-700" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {article.profiles.display_name}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

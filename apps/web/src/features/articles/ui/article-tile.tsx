import { ArticleLikeIcon, CommentIcon, DefaultAvatar } from '@quitmate/ui';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { ArticleTileDto } from '@/lib/types';

import { CategoryTag } from '@/features/common/ui/category-tag';

type Props = {
  article: ArticleTileDto;
};

export function ArticleTile({ article }: Props) {
  // Convert article date to Tokyo time
  const articleDate = toZonedTime(new Date(article.created_at), 'Asia/Tokyo');
  const currentYear = new Date().getFullYear();
  const articleYear = articleDate.getFullYear();

  // If current year, don't display year; otherwise include year
  const dateFormat = articleYear === currentYear ? 'M/d H:mm' : 'yyyy/M/d H:mm';
  const createdAt = format(articleDate, dateFormat, {
    locale: enUS,
  });

  const articleUrl = `/${article.profiles.user_name}/articles/${article.id}`;

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md dark:border-gray-700">
      <div className="p-4">
        <Link href={articleUrl} className="block">
          {/* Title */}
          <h2 className="mb-1 line-clamp-2 text-xl font-bold text-gray-900 dark:text-white">
            {article.title}
          </h2>

          {/* Category tag and date */}
          <div className="mb-1 flex items-center justify-between">
            <CategoryTag
              category={article.habit_categories?.habit_category_name ?? 'General'}
              customHabitName={article.custom_habit_name}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">{createdAt}</span>
          </div>
        </Link>

        {/* Article description (Markdown) */}
        <div className="prose-sm mb-4 line-clamp-3 text-gray-700 dark:prose-invert prose-headings:my-0 prose-p:my-0 prose-li:my-0 dark:text-gray-300">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children, ...props }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-green-800 no-underline hover:underline dark:text-green-400"
                  {...props}
                >
                  {children}
                </a>
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {/* Actions and user info */}
        <div className="flex items-center justify-between">
          {/* Comments and likes */}
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

          {/* User info */}
          <Link href={articleUrl}>
            <div className="flex items-center">
              <div className="mr-2 size-6 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                {article.profiles.avatar_url ? (
                  <Image
                    src={article.profiles.avatar_url}
                    alt="Profile image"
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
          </Link>
        </div>
      </div>
    </div>
  );
}


import { ArticleTileDto } from "@/lib/types";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import { Tag } from "@/components/ui/tag";

type Props = {
  article: ArticleTileDto;
};

export function ArticleTile({ article }: Props) {
  const createdAt = formatDistanceToNow(new Date(article.created_at), {
    addSuffix: true,
    locale: ja,
  });

  return (
    <div className="block border-b border-gray-300 dark:border-gray-700">
      <div className="flex p-4">
        {/* アバター部分 */}
        <div className="mr-3">
          <Link href={`/profiles/${article.user_id}`} className="block">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              {article.profiles.avatar_url ? (
                <Image
                  src={article.profiles.avatar_url}
                  alt="プロフィール画像"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted" />
              )}
            </div>
          </Link>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1">
          {/* ヘッダー */}
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/profiles/${article.user_id}`}
              className="hover:underline"
            >
              <span className="font-bold text-foreground">{article.profiles.display_name}</span>
            </Link>
            <Link
              href={`/profiles/${article.user_id}`}
              className="hover:underline"
            >
              <span className="text-sm text-muted-foreground">
                @{article.profiles.user_name}
              </span>
            </Link>
            <span className="text-sm text-muted-foreground">・</span>
            <span className="text-sm text-muted-foreground">{createdAt}</span>
          </div>

          <Link
            href={`/articles/${article.id}`}
            className="block hover:bg-accent/5 transition-colors"
          >
            {/* タイトルと習慣カテゴリー */}
            <h2 className="text-xl font-bold mb-2 text-foreground">{article.title}</h2>
            <div className="flex items-center gap-2 mb-2">
              <Tag>
                {article.habit_categories.habit_category_name}
              </Tag>
            </div>

            {/* 記事の説明文 */}
            <p className="mb-3 text-secondary-foreground line-clamp-3">{article.content}</p>

            {/* アクション */}
            <div className="flex gap-6 text-muted-foreground">
              <div className="flex items-center gap-1">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span className="text-sm">
                  {article.article_comments[0]?.count ?? 0}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="text-sm">
                  {article.article_likes[0]?.count ?? 0}
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

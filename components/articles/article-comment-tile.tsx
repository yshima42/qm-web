import { ArticleCommentTileDto } from "@/lib/types";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";

type Props = {
  comment: ArticleCommentTileDto;
};

export function ArticleCommentTile({ comment }: Props) {
  const createdAt = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
    locale: ja,
  });

  return (
    <div className="flex p-3 pl-12 border-b border-border">
      {/* アバター */}
      <div className="mr-2">
        <Link href={`/profiles/${comment.user_id}`} className="block">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            {comment.profiles.avatar_url ? (
              <Image
                src={comment.profiles.avatar_url}
                alt="プロフィール画像"
                width={32}
                height={32}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted" />
            )}
          </div>
        </Link>
      </div>

      {/* コメント本文 */}
      <div className="flex-1">
        <div className="flex items-center gap-1.5 mb-0.5">
          <Link
            href={`/profiles/${comment.user_id}`}
            className="hover:underline"
          >
            <span className="font-bold text-sm text-foreground">
              {comment.profiles.display_name}
            </span>
          </Link>
          <Link
            href={`/profiles/${comment.user_id}`}
            className="hover:underline"
          >
            <span className="text-xs text-muted-foreground">
              @{comment.profiles.user_name}
            </span>
          </Link>
          <span className="text-xs text-muted-foreground">・</span>
          <span className="text-xs text-muted-foreground">{createdAt}</span>
        </div>
        <p className="text-sm whitespace-pre-wrap text-foreground">{comment.content}</p>

        {/* いいねボタン */}
        <div className="flex items-center gap-1 mt-1 text-muted-foreground">
          <svg
            className="w-4 h-4"
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
          <span className="text-xs">
            {comment.article_comment_likes[0]?.count ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
}

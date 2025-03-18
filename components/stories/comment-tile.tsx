import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';

import { CommentTileDto } from '@/lib/types';

type Props = {
  comment: CommentTileDto;
};

export function CommentTile({ comment }: Props) {
  const createdAt = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
    locale: ja,
  });

  return (
    <div className="flex border-b border-border p-3 pl-12">
      {/* アバター */}
      <div className="mr-2">
        <Link href={`/profiles/${comment.user_id}`} className="block">
          <div className="size-8 overflow-hidden rounded-full">
            {comment.profiles.avatar_url ? (
              <Image
                src={comment.profiles.avatar_url}
                alt="プロフィール画像"
                width={32}
                height={32}
                className="object-cover"
              />
            ) : (
              <div className="size-full bg-muted" />
            )}
          </div>
        </Link>
      </div>

      {/* コメント本文 */}
      <div className="flex-1">
        <div className="mb-0.5 flex items-center gap-1.5">
          <Link href={`/profiles/${comment.user_id}`} className="hover:underline">
            <span className="text-sm font-bold text-foreground">
              {comment.profiles.display_name}
            </span>
          </Link>
          <Link href={`/profiles/${comment.user_id}`} className="hover:underline">
            <span className="text-xs text-muted-foreground">@{comment.profiles.user_name}</span>
          </Link>
          <span className="text-xs text-muted-foreground">・</span>
          <span className="text-xs text-muted-foreground">{createdAt}</span>
        </div>
        <p className="whitespace-pre-wrap text-sm text-foreground">{comment.content}</p>

        {/* いいねボタン */}
        <div className="mt-1 flex items-center gap-1 text-muted-foreground">
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span className="text-xs">{comment.comment_likes[0]?.count ?? 0}</span>
        </div>
      </div>
    </div>
  );
}

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';

import { DefaultAvatar } from '@/components/custom/default-avatar';
import { ArticleLikeIcon } from '@/components/custom/icon';

import { ArticleCommentTileDto } from '@/lib/types';

type Props = {
  comment: ArticleCommentTileDto;
};

export function ArticleCommentTile({ comment }: Props) {
  const commentDate = new Date(comment.created_at);
  const currentYear = new Date().getFullYear();
  const commentYear = commentDate.getFullYear();

  // 今年の場合は年を表示せず、そうでない場合は年を含める
  const dateFormat = commentYear === currentYear ? 'M/d H:mm' : 'yyyy/M/d H:mm';
  const createdAt = format(commentDate, dateFormat, {
    locale: ja,
  });

  return (
    <div className="flex border-b border-border p-3">
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
              <DefaultAvatar size="md" className="size-full bg-muted" />
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
          <span className="text-xs text-muted-foreground"> </span>
          <span className="text-xs text-muted-foreground">{createdAt}</span>
        </div>
        <p className="whitespace-pre-wrap text-sm text-foreground">{comment.content}</p>

        {/* いいねボタン */}
        <div className="mt-1 flex items-center gap-1 text-muted-foreground">
          <ArticleLikeIcon className="size-4" />
          <span className="text-xs">{comment.article_comment_likes[0]?.count ?? 0}</span>
        </div>
      </div>
    </div>
  );
}

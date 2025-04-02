import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';
import Link from 'next/link';

import { CommentTileDto } from '@/lib/types';

import { UserAvatar } from '../profiles/user-avatar';

type Props = {
  comment: CommentTileDto;
};

export function CommentTile({ comment }: Props) {
  // コメント日時を東京時間に変換
  const commentDate = toZonedTime(new Date(comment.created_at), 'Asia/Tokyo');

  // 今日の日付を取得して東京時間に変換
  const today = toZonedTime(new Date(), 'Asia/Tokyo');
  const currentYear = new Date().getFullYear();
  const commentYear = commentDate.getFullYear();

  const isToday =
    commentDate.getDate() === today.getDate() &&
    commentDate.getMonth() === today.getMonth() &&
    commentDate.getFullYear() === today.getFullYear();

  // 今日の場合は時間のみ、今年の場合は月日と時間、それ以外は年月日と時間を表示
  let dateFormat;
  if (isToday) {
    dateFormat = 'H:mm';
  } else if (commentYear === currentYear) {
    dateFormat = 'M/d H:mm';
  } else {
    dateFormat = 'yyyy/M/d H:mm';
  }

  const createdAt = format(commentDate, dateFormat, {
    locale: ja,
  });

  return (
    <div className="flex border-b border-border p-3 pl-12">
      {/* アバター */}
      <div className="mr-2">
        <UserAvatar
          username={comment.profiles.user_name}
          displayName={comment.profiles.display_name}
          avatarUrl={comment.profiles.avatar_url}
          size="sm"
        />
      </div>

      {/* コメント本文 */}
      <div className="flex-1">
        <div className="mb-0.5 flex items-center gap-1.5">
          <Link href={`/${comment.profiles.user_name}`} className="hover:underline">
            <span className="text-sm font-bold text-foreground">
              {comment.profiles.display_name}
            </span>
          </Link>
          <Link href={`/${comment.profiles.user_name}`} className="hover:underline">
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

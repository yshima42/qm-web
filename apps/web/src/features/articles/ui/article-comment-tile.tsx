import { ArticleLikeIcon, AppDownloadDialogTrigger } from "@quitmate/ui";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import Link from "next/link";

import { ArticleCommentTileDto } from "@/lib/types";

import { UserAvatar } from "@/features/profiles/ui/user-avatar";

type Props = {
  comment: ArticleCommentTileDto;
};

export function ArticleCommentTile({ comment }: Props) {
  const commentDate = new Date(comment.created_at);
  const currentYear = new Date().getFullYear();
  const commentYear = commentDate.getFullYear();

  // If current year, don't display year; otherwise include year
  const dateFormat = commentYear === currentYear ? "M/d H:mm" : "yyyy/M/d H:mm";
  const createdAt = format(commentDate, dateFormat, {
    locale: enUS,
  });

  return (
    <div className="border-border flex border-b p-3">
      {/* Avatar */}
      <div className="mr-2">
        <UserAvatar
          username={comment.profiles.user_name}
          displayName={comment.profiles.display_name}
          avatarUrl={comment.profiles.avatar_url}
          size="sm"
        />
      </div>

      {/* Comment body */}
      <div className="flex-1">
        <div className="mb-0.5 flex items-center gap-1.5">
          <Link href={`/${comment.profiles.user_name}`} className="hover:underline">
            <span className="text-foreground text-sm font-bold">
              {comment.profiles.display_name}
            </span>
          </Link>
          <Link href={`/${comment.profiles.user_name}`} className="hover:underline">
            <span className="text-muted-foreground text-xs">@{comment.profiles.user_name}</span>
          </Link>
          <span className="text-muted-foreground text-xs"> </span>
          <span className="text-muted-foreground text-xs">{createdAt}</span>
        </div>
        <p className="text-foreground whitespace-pre-wrap text-sm">{comment.content}</p>

        {/* Like button */}
        <div className="text-muted-foreground mt-1 flex items-center gap-1">
          <AppDownloadDialogTrigger className="cursor-pointer">
            <div className="flex items-center gap-1">
              <ArticleLikeIcon className="size-4" />
              <span className="text-xs">{comment.article_comment_likes[0]?.count ?? 0}</span>
            </div>
          </AppDownloadDialogTrigger>
        </div>
      </div>
    </div>
  );
}

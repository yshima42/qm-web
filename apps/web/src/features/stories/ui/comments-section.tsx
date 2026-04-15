"use client";

import { useState } from "react";

import { CommentTileDto, ParentCommentInfo } from "@/lib/types";
import { useCurrentUser } from "@/features/common/providers/current-user-provider";

import { CommentForm } from "./comment-form";
import { CommentTile } from "./comment-tile";

type Props = {
  storyId: string;
  comments: CommentTileDto[] | null;
  isLoggedIn: boolean;
  canComment: boolean;
  currentUserId?: string;
};

export function CommentsSection({
  storyId,
  comments,
  isLoggedIn,
  canComment,
  currentUserId,
}: Props) {
  const [replyTarget, setReplyTarget] = useState<ParentCommentInfo | null>(null);
  const [optimisticComments, setOptimisticComments] = useState<CommentTileDto[]>([]);
  const [prevComments, setPrevComments] = useState(comments);
  const { profile } = useCurrentUser();

  // サーバーからコメントが更新されたら楽観的コメントをクリア（propsに基づくstate調整）
  if (prevComments !== comments) {
    setPrevComments(comments);
    if (optimisticComments.length > 0) {
      setOptimisticComments([]);
    }
  }

  const handleReply = (comment: CommentTileDto) => {
    setReplyTarget({
      id: comment.id,
      profiles: comment.profiles,
    });
  };

  const handleCancelReply = () => {
    setReplyTarget(null);
  };

  const handleCommentCreated = (content: string, parentComment?: ParentCommentInfo | null) => {
    if (!profile) return;

    const optimistic: CommentTileDto = {
      id: `optimistic-${Date.now()}`,
      story_id: storyId,
      user_id: currentUserId ?? "",
      content,
      created_at: new Date().toISOString(),
      parent_comment_id: parentComment?.id ?? null,
      profiles: {
        user_name: profile.user_name,
        display_name: profile.display_name,
        avatar_url: profile.avatar_url,
      },
      comment_likes: [{ count: 0 }],
      parent_comment: parentComment ?? null,
    };

    setOptimisticComments((prev) => [...prev, optimistic]);
  };

  const allComments = [...(comments ?? []), ...optimisticComments];

  return (
    <>
      {/* コメントフォーム */}
      {isLoggedIn && canComment && (
        <CommentForm
          storyId={storyId}
          replyTarget={replyTarget}
          onCancelReply={handleCancelReply}
          onOptimisticAdd={handleCommentCreated}
        />
      )}

      {/* コメント一覧 */}
      {allComments.length > 0 && (
        <div className="mt-4">
          {allComments.map((comment) => (
            <CommentTile
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              isLoggedIn={isLoggedIn}
              canComment={canComment}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </>
  );
}

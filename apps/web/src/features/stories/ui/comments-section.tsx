"use client";

import { useState } from "react";

import { CommentTileDto, ParentCommentInfo } from "@/lib/types";

import { CommentForm } from "./comment-form";
import { CommentTile } from "./comment-tile";

type Props = {
  storyId: string;
  comments: CommentTileDto[] | null;
  isLoggedIn: boolean;
  canComment: boolean;
};

export function CommentsSection({ storyId, comments, isLoggedIn, canComment }: Props) {
  const [replyTarget, setReplyTarget] = useState<ParentCommentInfo | null>(null);

  const handleReply = (comment: CommentTileDto) => {
    setReplyTarget({
      id: comment.id,
      profiles: comment.profiles,
    });
  };

  const handleCancelReply = () => {
    setReplyTarget(null);
  };

  return (
    <>
      {/* コメントフォーム */}
      {isLoggedIn && canComment && (
        <CommentForm
          storyId={storyId}
          replyTarget={replyTarget}
          onCancelReply={handleCancelReply}
        />
      )}

      {/* コメント一覧 */}
      {comments && comments.length > 0 && (
        <div className="mt-4">
          {comments.map((comment) => (
            <CommentTile
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              isLoggedIn={isLoggedIn}
              canComment={canComment}
            />
          ))}
        </div>
      )}
    </>
  );
}

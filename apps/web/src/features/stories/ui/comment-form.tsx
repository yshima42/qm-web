"use client";

import { Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

import { useCharacterCount } from "@/features/common/hooks/use-character-count";
import { CharacterCountIndicator } from "@/features/common/components/character-count-indicator";
import { createComment } from "@/features/stories/data/actions";

import { ParentCommentInfo } from "@/lib/types";

type Props = {
  storyId: string;
  replyTarget?: ParentCommentInfo | null;
  onCancelReply?: () => void;
};

export function CommentForm({ storyId, replyTarget, onCancelReply }: Props) {
  const t = useTranslations("comment-form");
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 返信先が設定されたらフォーカス
  useEffect(() => {
    if (replyTarget && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyTarget]);

  // Calculate character count and remaining
  const { remaining, isOverLimit, showCount, progress } = useCharacterCount(content);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError(t("contentRequired"));
      return;
    }

    if (isOverLimit) {
      setError(t("contentTooLong"));
      return;
    }

    startTransition(async () => {
      const result = await createComment(storyId, content, replyTarget?.id);

      if (result.success) {
        setContent("");
        setError(null);
        onCancelReply?.(); // 返信モードをリセット
      } else {
        setError(t("postFailed"));
      }
    });
  };

  return (
    <div className="border-border bg-card border-b">
      <form onSubmit={handleSubmit} className="space-y-3 p-4">
        {/* 返信先表示セクション */}
        {replyTarget && (
          <div className="text-muted-foreground ml-13 flex items-center gap-2 text-sm">
            <span>
              {t("replyingTo")}{" "}
              <span className="text-foreground font-semibold">
                {replyTarget.profiles.display_name}
              </span>
            </span>
            <button type="button" onClick={onCancelReply} className="hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex gap-3">
          {/* アバタープレースホルダー */}
          <div className="bg-muted flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium">
            U
          </div>

          {/* 入力エリア */}
          <div className="flex-1 space-y-3">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={replyTarget ? t("replyPlaceholder") : t("placeholder")}
              disabled={isPending}
              rows={2}
              className="placeholder:text-muted-foreground w-full resize-none rounded-md border-0 bg-transparent px-0 py-2 text-base focus-visible:outline-none"
            />
          </div>
        </div>

        {/* エラーメッセージ */}
        {error && <div className="ml-13 text-sm text-red-500">{error}</div>}

        {/* アクションボタン */}
        <div className="ml-13 flex items-center justify-end gap-3">
          <CharacterCountIndicator
            remaining={remaining}
            isOverLimit={isOverLimit}
            showCount={showCount}
            progress={progress}
          />

          <Button
            type="submit"
            disabled={isPending || !content.trim() || isOverLimit}
            size="sm"
            className="rounded-full"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("submitButton")}
          </Button>
        </div>
      </form>
    </div>
  );
}

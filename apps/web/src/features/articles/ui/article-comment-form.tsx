"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

import { useCharacterCount } from "@/features/common/hooks/use-character-count";
import { CharacterCountIndicator } from "@/features/common/components/character-count-indicator";
import { createArticleComment } from "@/features/articles/data/actions";

type Props = {
  articleId: string;
};

export function ArticleCommentForm({ articleId }: Props) {
  const t = useTranslations("comment-form");
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

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
      const result = await createArticleComment(articleId, content);

      if (result.success) {
        setContent("");
        setError(null);
      } else {
        setError(t("postFailed"));
      }
    });
  };

  return (
    <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <form onSubmit={handleSubmit} className="space-y-3 p-4">
        <div className="flex gap-3">
          {/* アバタープレースホルダー */}
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-medium dark:bg-gray-700">
            U
          </div>

          {/* 入力エリア */}
          <div className="flex-1 space-y-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("placeholder")}
              disabled={isPending}
              rows={2}
              className="w-full resize-none rounded-md border-0 bg-transparent px-0 py-2 text-base placeholder:text-gray-400 focus-visible:outline-none dark:placeholder:text-gray-500"
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

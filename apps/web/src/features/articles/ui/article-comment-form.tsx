'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';

import { MAX_CHARACTERS, SHOW_COUNT_THRESHOLD } from '@/features/common/constants';
import { createArticleComment } from '@/features/articles/data/actions';

type Props = {
  articleId: string;
};

// Count characters, treating multibyte characters as 2
function countCharacters(text: string): number {
  let count = 0;
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code > 0x7f) {
      count += 2;
    } else {
      count += 1;
    }
  }
  return count;
}

export function ArticleCommentForm({ articleId }: Props) {
  const t = useTranslations('comment-form');
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Calculate character count and remaining
  const charCount = useMemo(() => countCharacters(content), [content]);
  const remaining = MAX_CHARACTERS - charCount;
  const isOverLimit = remaining < 0;
  const showCount = remaining <= SHOW_COUNT_THRESHOLD;

  // Calculate progress for circular indicator (0-1)
  const progress = Math.min(charCount / MAX_CHARACTERS, 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError(t('contentRequired'));
      return;
    }

    if (isOverLimit) {
      setError(t('contentTooLong'));
      return;
    }

    startTransition(async () => {
      const result = await createArticleComment(articleId, content);

      if (result.success) {
        setContent('');
        setError(null);
      } else {
        setError(t('postFailed'));
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
              placeholder={t('placeholder')}
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
          {/* Character count indicator */}
          <div className="relative flex items-center justify-center">
            {/* Background circle */}
            <svg className="h-8 w-8 -rotate-90">
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-200 dark:text-gray-700"
                opacity="0.5"
              />
              {/* Progress circle */}
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 14}`}
                strokeDashoffset={`${2 * Math.PI * 14 * (1 - progress)}`}
                className={
                  isOverLimit
                    ? 'text-red-500'
                    : remaining <= 20
                      ? 'text-yellow-500'
                      : 'text-primary'
                }
                strokeLinecap="round"
              />
            </svg>
            {/* Character count text */}
            {showCount && (
              <span
                className={`absolute text-xs font-medium ${
                  isOverLimit ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {remaining}
              </span>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending || !content.trim() || isOverLimit}
            size="sm"
            className="rounded-full"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('submitButton')}
          </Button>
        </div>
      </form>
    </div>
  );
}

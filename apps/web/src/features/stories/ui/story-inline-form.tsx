'use client';

import { useState, useTransition, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { createStory } from '../data/actions';
import { Loader2 } from 'lucide-react';
import { HabitTileDto } from '@/lib/types';

type StoryInlineFormProps = {
  habits: HabitTileDto[];
};

const MAX_CHARACTERS = 300;
const SHOW_COUNT_THRESHOLD = 20;

// Count characters, treating multibyte characters as 2
function countCharacters(text: string): number {
  let count = 0;
  for (const char of text) {
    // Check if character is multibyte (e.g., Japanese, emoji, etc.)
    const code = char.charCodeAt(0);
    if (code > 0x7F) {
      count += 2; // Multibyte character counts as 2
    } else {
      count += 1; // ASCII character counts as 1
    }
  }
  return count;
}

export function StoryInlineForm({ habits }: StoryInlineFormProps) {
  const t = useTranslations('story-post');
  const tCategory = useTranslations('categories');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState('');

  // Filter for active habits (has at least one trial with no ended_at)
  const activeHabits = habits.filter((habit) =>
    habit.trials?.some((trial) => !trial.ended_at)
  );

  const hasActiveHabit = activeHabits.length > 0;
  const showHabitSelect = activeHabits.length > 1;

  // Calculate character count and remaining
  const charCount = useMemo(() => countCharacters(content), [content]);
  const remaining = MAX_CHARACTERS - charCount;
  const isOverLimit = remaining < 0;
  const showCount = remaining <= SHOW_COUNT_THRESHOLD;

  // Calculate progress for circular indicator (0-1)
  const progress = Math.min(charCount / MAX_CHARACTERS, 1);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (isOverLimit) {
      setError(t('contentTooLong'));
      return;
    }

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await createStory(formData);
        setContent(''); // Clear the form on success
      } catch (err) {
        // Ignore NEXT_REDIRECT errors as they are not actual errors
        if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
          return;
        }
        setError(err instanceof Error ? err.message : t('createFailed'));
      }
    });
  };

  if (!hasActiveHabit) {
    return null; // Don't show the form if no active habits
  }

  return (
    <div className="border-b border-border bg-card">
      <form onSubmit={handleSubmit} className="p-4 space-y-3">
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
            {/* User avatar placeholder */}
            U
          </div>
          <div className="flex-1 space-y-3">
            {showHabitSelect && (
              <select
                name="habit_id"
                required
                className="w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {activeHabits.map((habit) => (
                  <option key={habit.id} value={habit.id}>
                    {habit.custom_habit_name ||
                      (habit.habit_categories?.habit_category_name
                        ? tCategory(habit.habit_categories.habit_category_name)
                        : habit.habit_categories?.habit_category_name)}
                  </option>
                ))}
              </select>
            )}
            {!showHabitSelect && (
              <input type="hidden" name="habit_id" value={activeHabits[0].id} />
            )}
            
            <textarea
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={3}
              className="w-full resize-none rounded-md border-0 bg-transparent px-0 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none"
              placeholder={t('placeholder')}
            />
          </div>
        </div>

        {error && (
          <div className="ml-13 text-sm text-red-500">{error}</div>
        )}

        <div className="flex items-center justify-end gap-3 ml-13">
          {/* Character count indicator */}
          <div className="relative flex items-center justify-center">
            {/* Background circle */}
            <svg className="w-8 h-8 -rotate-90">
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted"
                opacity="0.2"
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
                  isOverLimit ? 'text-red-500' : 'text-muted-foreground'
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
            {t('postButton')}
          </Button>
        </div>
      </form>
    </div>
  );
}

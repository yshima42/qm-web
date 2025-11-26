'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { createStory } from '../data/actions';
import { Loader2 } from 'lucide-react';
import { HabitTileDto } from '@/lib/types';

type StoryInlineFormProps = {
  habits: HabitTileDto[];
};

export function StoryInlineForm({ habits }: StoryInlineFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState('');

  // Filter for active habits (has at least one trial with no ended_at)
  const activeHabits = habits.filter((habit) =>
    habit.trials?.some((trial) => !trial.ended_at)
  );

  const hasActiveHabit = activeHabits.length > 0;
  const showHabitSelect = activeHabits.length > 1;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await createStory(formData);
        setContent(''); // Clear the form on success
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
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
                      habit.habit_categories?.habit_category_name}
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
              placeholder="What's happening?"
            />
          </div>
        </div>

        {error && (
          <div className="ml-13 text-sm text-red-500">{error}</div>
        )}

        <div className="flex justify-end ml-13">
          <Button 
            type="submit" 
            disabled={isPending || !content.trim()}
            size="sm"
            className="rounded-full"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post
          </Button>
        </div>
      </form>
    </div>
  );
}

'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createStory } from '../data/actions';
import { Loader2 } from 'lucide-react';
import { HabitTileDto } from '@/lib/types';

type StoryCreateFormProps = {
  habits: HabitTileDto[];
};

export function StoryCreateForm({ habits }: StoryCreateFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Filter for active habits (has at least one trial with no ended_at)
  const activeHabits = habits.filter((habit) =>
    habit.trials?.some((trial) => !trial.ended_at)
  );

  const hasActiveHabit = activeHabits.length > 0;
  const showHabitSelect = activeHabits.length > 1;

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      try {
        await createStory(formData);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong');
      }
    });
  };

  if (!hasActiveHabit) {
    return (
      <div className="text-center p-4 border rounded-md bg-muted/50">
        <p className="text-muted-foreground">
          You need an active habit to post a story. Please start a habit first.
        </p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {showHabitSelect ? (
        <div className="space-y-2">
          <Label htmlFor="habit_id">Select Habit</Label>
          <select
            id="habit_id"
            name="habit_id"
            required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          >
            {activeHabits.map((habit) => (
              <option key={habit.id} value={habit.id}>
                {habit.custom_habit_name ||
                  habit.habit_categories?.habit_category_name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="space-y-2">
          <Label>Habit</Label>
          <div className="text-sm font-medium p-2 border rounded-md bg-muted/20">
            {activeHabits[0].custom_habit_name ||
              activeHabits[0].habit_categories?.habit_category_name}
          </div>
          <input type="hidden" name="habit_id" value={activeHabits[0].id} />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="content">Your Story</Label>
        <textarea
          id="content"
          name="content"
          required
          rows={5}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          placeholder="Share your journey..."
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Post Story
      </Button>
    </form>
  );
}

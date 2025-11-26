'use server';

import { createClient } from '@/lib/supabase/server';
import { fetchHabits } from '@/features/habits/data/data';
import { differenceInDays } from 'date-fns';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createStory(formData: FormData) {
  const content = formData.get('content') as string;

  if (!content || content.trim() === '') {
    throw new Error('Content is required');
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const habitId = formData.get('habit_id') as string;

  // Fetch user's habits to find the active one
  const habits = await fetchHabits(user.id);

  let activeHabit = null;
  let activeTrial = null;

  for (const habit of habits) {
    // If a specific habit was requested, skip others
    if (habitId && habit.id !== habitId) continue;

    // Check trials
    if (habit.trials && habit.trials.length > 0) {
      // Find active trial (ended_at is null)
      const currentActiveTrial = habit.trials.find((t) => !t.ended_at);

      if (currentActiveTrial) {
        activeHabit = habit;
        activeTrial = currentActiveTrial;
        break; // Found the target active habit
      }
    }
  }

  if (!activeHabit || !activeTrial) {
    // Fallback or error?
    // If no active habit, we can't link the story to a trial.
    // The DB requires habit_category_id and trial_started_at.
    // We could try to find ANY habit and use its latest trial (even if ended), or throw error.
    // Let's throw an error for now as this is a "QuitMate" app.
    throw new Error('No active habit found. Please start a habit first.');
  }

  const trialStartedAt = new Date(activeTrial.started_at);
  const now = new Date();
  const trialElapsedDays = differenceInDays(now, trialStartedAt);

  const { error } = await supabase.from('stories').insert({
    content: content.trim(),
    user_id: user.id,
    habit_category_id: activeHabit.habit_category_id,
    trial_started_at: activeTrial.started_at,
    trial_elapsed_days: trialElapsedDays,
    comment_setting: 'enabled', // Default to enabled
    is_reason: false,
  });

  if (error) {
    console.error('Error creating story:', error);
    throw new Error('Failed to create story');
  }

  revalidatePath('/stories');
  redirect('/stories');
}

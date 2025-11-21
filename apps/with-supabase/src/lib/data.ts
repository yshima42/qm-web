import { createAnonServerClient, createClient } from '@/lib/supabase/server';

import {
  HabitCategoryName,
  StoryTileDto,
} from './types';

const STORY_SELECT_QUERY = `*, 
  habit_categories!inner(habit_category_name), 
  profiles!stories_user_id_fkey(user_name, display_name, avatar_url), 
  likes(count), 
  comments(count)`;

const FETCH_LIMIT = 100;

export async function fetchStoriesByHabitCategoryName(name: HabitCategoryName) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('stories')
    .select(STORY_SELECT_QUERY)
    .eq('habit_categories.habit_category_name', name)
    .order('created_at', { ascending: false })
    .limit(FETCH_LIMIT);

  return data as StoryTileDto[];
}


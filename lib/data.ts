import { createClient } from "@/utils/supabase/server";
import { StoryTileDto, CommentTileDto } from "./types";

const STORY_SELECT_QUERY = `*, 
  habit_categories!inner(habit_category_name), 
  profiles!stories_user_id_fkey(user_name, display_name, avatar_url), 
  likes(count), 
  comments(count)`;

export async function fetchStories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("stories")
    .select(STORY_SELECT_QUERY)
    .order("created_at", { ascending: false })
    .limit(10);

  return data as StoryTileDto[];
}

export async function fetchStoryById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("stories")
    .select(STORY_SELECT_QUERY)
    .eq("id", id)
    .single();
  return data as StoryTileDto;
}

export async function fetchCommentsByStoryId(storyId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("comments")
    .select(
      "*, profiles!comments_user_id_fkey(user_name, display_name, avatar_url), comment_likes(count)"
    )
    .eq("story_id", storyId);
  return data as CommentTileDto[];
}

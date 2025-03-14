import { createClient } from "@/utils/supabase/server";
import {
  StoryTileDto,
  CommentTileDto,
  ProfileTileDto,
  HabitCategoryName,
} from "./types";

const STORY_SELECT_QUERY = `*, 
  habit_categories!inner(habit_category_name), 
  profiles!stories_user_id_fkey(user_name, display_name, avatar_url), 
  likes(count), 
  comments(count)`;

const FETCH_LIMIT = 100;

export async function fetchStories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("stories")
    .select(STORY_SELECT_QUERY)
    .order("created_at", { ascending: false })
    .limit(FETCH_LIMIT);

  return data as StoryTileDto[];
}

export async function fetchStoriesByHabitCategoryName(name: HabitCategoryName) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("stories")
    .select(STORY_SELECT_QUERY)
    .eq("habit_categories.habit_category_name", name)
    .order("created_at", { ascending: false })
    .limit(FETCH_LIMIT);

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

export async function fetchStoriesByUserId(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("stories")
    .select(STORY_SELECT_QUERY)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(FETCH_LIMIT);
  return data as StoryTileDto[];
}

export async function fetchCommentedStoriesByUserId(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("distinct_user_story_comments")
    .select(`*, stories(${STORY_SELECT_QUERY})`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(FETCH_LIMIT);
  const stories = data?.map((comment) => comment.stories) ?? [];
  return stories as StoryTileDto[];
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

export async function fetchProfileById(id: string) {
  const supabase = await createClient();

  const [profileResult, followersResult, followingResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("*, followers!followers_followed_id_fkey(count)")
      .eq("id", id)
      .single(),
    // profileと一緒に二つ同時に取得できなかったため、このようにした
    supabase.from("followers").select("count").eq("followed_id", id),
    supabase.from("followers").select("count").eq("follower_id", id),
  ]);

  return {
    ...profileResult.data,
    followers: followersResult.data?.[0]?.count ?? 0,
    following: followingResult.data?.[0]?.count ?? 0,
  } as ProfileTileDto;
}

import { createClient } from "@/utils/supabase/server";

import {
  ArticleCommentTileDto,
  ArticleTileDto,
  CommentTileDto,
  HabitCategoryName,
  ProfileTileDto,
  StoryTileDto,
} from "./types";

const STORY_SELECT_QUERY = `*, 
  habit_categories!inner(habit_category_name), 
  profiles!stories_user_id_fkey(user_name, display_name, avatar_url), 
  likes(count), 
  comments(count)`;

const ARTICLE_SELECT_QUERY = `*, 
  habit_categories!inner(habit_category_name), 
  profiles!articles_user_id_fkey(user_name, display_name, avatar_url), 
  article_likes(count), 
  article_comments(count)`;

const FETCH_LIMIT = 100;

export async function fetchArticles() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT_QUERY)
    .order("created_at", { ascending: false })
    .limit(FETCH_LIMIT);
  return data as ArticleTileDto[];
}

export async function fetchArticleById(id: string) {
  const supabase = await createClient();
  const result = await supabase
    .from("articles")
    .select(ARTICLE_SELECT_QUERY)
    .eq("id", id)
    .maybeSingle();
  return result.data as ArticleTileDto | null;
}

export async function fetchCommentsByArticleId(articleId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("article_comments")
    .select(
      "*, profiles!article_comments_user_id_fkey(user_name, display_name, avatar_url), article_comment_likes(count)"
    )
    .eq("article_id", articleId);
  return data as ArticleCommentTileDto[];
}

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
  // サーバーエラー確認用
  // throw new Error("Not implemented");
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
  const result = await supabase
    .from("stories")
    .select(STORY_SELECT_QUERY)
    .eq("id", id)
    .maybeSingle();
  return result.data as StoryTileDto | null;
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
  const stories = data?.map((comment: { stories: StoryTileDto }) => comment.stories) ?? [];
  return stories;
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
      .maybeSingle(),
    // profileと一緒に二つ同時に取得できなかったため、このようにした
    supabase.from("followers").select("count").eq("followed_id", id),
    supabase.from("followers").select("count").eq("follower_id", id),
  ]);

  if (!profileResult.data) {
    return null;
  }

  return {
    ...profileResult.data,
    followers: followersResult.data?.[0]?.count ?? 0,
    following: followingResult.data?.[0]?.count ?? 0,
  } as ProfileTileDto;
}

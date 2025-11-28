import { createAnonServerClient, createClient } from "@/lib/supabase/server";

import { CommentTileDto, HabitCategoryName, StoryTileDto } from "@/lib/types";
import { STORY_SELECT_QUERY } from "./constants";

const FETCH_LIMIT = 100;

export async function fetchStories() {
  const supabase = createAnonServerClient();
  const { data } = await supabase
    .from("stories")
    .select(STORY_SELECT_QUERY)
    .order("created_at", { ascending: false })
    .limit(FETCH_LIMIT);

  return data as StoryTileDto[];
}

export async function fetchStoryById(id: string) {
  const supabase = createAnonServerClient();
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

export async function fetchCommentsByStoryId(storyId: string, currentUserId?: string) {
  // const supabase = createAnonServerClient();
  const supabase = await createClient();

  // ログイン中の場合はRPCでミュートユーザーを除外してコメントIDを取得
  if (currentUserId) {
    const { data: rpcData, error } = await supabase.rpc("get_comments_by_story", {
      p_story_id: storyId,
      p_user_id: currentUserId,
    });

    if (error) {
      console.error("[fetchCommentsByStoryId] RPC error", error);
      return null;
    }

    if (!rpcData || rpcData.length === 0) {
      return null;
    }

    const commentIds = (rpcData as { id: string }[]).map((c) => c.id);

    // コメント詳細を取得（ミュートユーザー除外済み）
    const { data } = await supabase
      .from("comments")
      .select(
        `*, 
         profiles!comments_user_id_fkey(user_name, display_name, avatar_url), 
         comment_likes(count)`,
      )
      .in("id", commentIds)
      .order("created_at", { ascending: true });

    if (!data) return null;

    return enrichCommentsWithParent(data);
  }

  // 未ログイン時は全コメント取得
  const { data } = await supabase
    .from("comments")
    .select(
      `*, 
       profiles!comments_user_id_fkey(user_name, display_name, avatar_url), 
       comment_likes(count)`,
    )
    .eq("story_id", storyId)
    .order("created_at", { ascending: true });

  if (!data) return null;

  return enrichCommentsWithParent(data);
}

// ヘルパー関数（重複コード削減）
function enrichCommentsWithParent(data: CommentTileDto[]): CommentTileDto[] {
  const commentMap = new Map(data.map((c) => [c.id, c]));

  const commentsWithParent = data.map((comment) => {
    if (!comment.parent_comment_id) {
      return { ...comment, parent_comment: null };
    }

    const parentComment = commentMap.get(comment.parent_comment_id);
    return {
      ...comment,
      parent_comment: parentComment
        ? {
            id: parentComment.id,
            profiles: parentComment.profiles,
          }
        : null,
    };
  });

  return commentsWithParent as CommentTileDto[];
}

export async function fetchStoryDetailPageStaticParams(limit?: number) {
  const supabase = createAnonServerClient();
  const now = new Date().toISOString();
  let allStories: { id: string; profiles: { user_name: string } }[] = [];
  let page = 0;
  const pageSize = 1000;

  while (page < Number.MAX_SAFE_INTEGER) {
    const result = await supabase
      .from("stories")
      .select(STORY_SELECT_QUERY)
      .lte("created_at", now)
      .range(page * pageSize, (page + 1) * pageSize - 1)
      .order("created_at", { ascending: false });

    if (!result.data || result.data.length === 0) break;

    allStories = [
      ...allStories,
      ...(result.data as unknown as { id: string; profiles: { user_name: string } }[]),
    ];

    // Exit loop if specified limit is reached
    if (limit && allStories.length >= limit) {
      allStories = allStories.slice(0, limit);
      break;
    }

    if (result.data.length < pageSize) break;

    page++;
  }

  return allStories;
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

// RPC関数を使って複数ストーリーのいいね状態を一括取得
export async function fetchHasLikedByStoryIds(storyIds: string[]): Promise<Map<string, boolean>> {
  if (storyIds.length === 0) return new Map();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return new Map();

  const { data, error } = await supabase.rpc("get_has_liked_by_story_ids", {
    p_story_ids: storyIds,
    p_user_id: user.id,
  });

  if (error || !data) return new Map();

  const result = new Map<string, boolean>();
  for (const row of data as { story_id: string; has_liked: boolean }[]) {
    result.set(row.story_id, row.has_liked);
  }
  return result;
}

// ストーリーリストにいいね状態を付与
export async function enrichStoriesWithLikeStatus(
  stories: StoryTileDto[],
): Promise<StoryTileDto[]> {
  const storyIds = stories.map((s) => s.id);
  const hasLikedMap = await fetchHasLikedByStoryIds(storyIds);

  return stories.map((story) => ({
    ...story,
    isLikedByMe: hasLikedMap.get(story.id) ?? false,
  }));
}

// 単一ストーリーのいいね状態チェック（詳細ページ用）
export async function checkIsLikedByMe(storyId: string): Promise<boolean> {
  const hasLikedMap = await fetchHasLikedByStoryIds([storyId]);
  return hasLikedMap.get(storyId) ?? false;
}

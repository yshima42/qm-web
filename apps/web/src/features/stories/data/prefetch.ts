import type { QueryClient } from "@tanstack/react-query";

import { createClient } from "@/lib/supabase/server";
import { HabitCategoryName, StoryTileDto } from "@/lib/types";

import { PAGE_SIZE, STORY_SELECT_QUERY } from "./constants";

type Page = {
  stories: StoryTileDto[];
  hasMore: boolean;
};

// boundaryTime のキャッシュキー（useInfiniteStories と一致させる必要あり）
const getBoundaryTimeKey = (category: HabitCategoryName, locale: string) =>
  ["stories", "boundaryTime", category, locale] as const;

// ストーリー一覧のキャッシュキー（useInfiniteStories と一致させる必要あり）
const getStoriesInfiniteKey = (category: HabitCategoryName, locale: string) =>
  ["stories", "category", category, locale] as const;

/**
 * サーバー側でストーリー1ページを取得する。
 * useInfiniteStories の queryFn と同じ結果（RPC → detail → いいね状態）を返す。
 */
async function fetchStoriesPage(params: {
  category: HabitCategoryName;
  locale: string;
  boundaryTime: string;
  pageParam: number;
}): Promise<Page> {
  const { category, locale, boundaryTime, pageParam } = params;
  const supabase = await createClient();

  const from = pageParam * PAGE_SIZE;
  const to = (pageParam + 1) * PAGE_SIZE - 1;

  const languageCode = locale === "ja" || locale === "en" ? locale : "ja";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: storyIdsData, error: rpcError } = await supabase.rpc(
    "get_ranged_stories_by_habit_including_official_with_language",
    {
      input_habit_category_name: category === "All" ? null : category,
      from_pos: from,
      to_pos: to,
      before_timestamp: boundaryTime,
      input_language_code: languageCode,
    },
  );

  if (rpcError || !storyIdsData || storyIdsData.length === 0) {
    if (rpcError) {
      console.error("[prefetchStoriesInfinite] RPC error", rpcError);
    }
    return { stories: [], hasMore: false };
  }

  const storyIds = (storyIdsData as { id: string }[]).map((item) => item.id);

  const { data: stories, error: storiesError } = await supabase
    .from("stories")
    .select(STORY_SELECT_QUERY)
    .in("id", storyIds);

  if (storiesError || !stories) {
    console.error("[prefetchStoriesInfinite] stories fetch error", storiesError);
    return { stories: [], hasMore: false };
  }

  // RPC で返ってきた順序を保持
  const storyMap = new Map(stories.map((s) => [s.id, s]));
  const ordered = storyIds
    .map((id) => storyMap.get(id))
    .filter((s): s is NonNullable<typeof s> => s !== undefined) as StoryTileDto[];

  // いいね状態（ログイン時のみ）
  let storiesWithLikes: StoryTileDto[] = ordered;
  if (user && ordered.length > 0) {
    const { data: likeData } = await supabase.rpc("get_has_liked_by_story_ids", {
      p_story_ids: ordered.map((s) => s.id),
      p_user_id: user.id,
    });

    const likeMap = new Map(
      (likeData as { story_id: string; has_liked: boolean }[])?.map((l) => [
        l.story_id,
        l.has_liked,
      ]) ?? [],
    );

    storiesWithLikes = ordered.map((s) => ({
      ...s,
      isLikedByMe: likeMap.get(s.id) ?? false,
    }));
  }

  return {
    stories: storiesWithLikes,
    hasMore: storyIdsData.length === PAGE_SIZE,
  };
}

/**
 * ストーリー一覧の1ページ目を SSR で prefetch して QueryClient に入れる。
 * - boundaryTime はここで固定し、setQueryData でキャッシュに入れる
 *   （CSR 側の useInfiniteStories が同じキーから読み取る）
 * - 失敗してもページ描画は継続（空状態でクライアントが再取得する）
 */
export async function prefetchStoriesInfinite(
  queryClient: QueryClient,
  params: { category: HabitCategoryName; locale: string },
) {
  const { category, locale } = params;
  const boundaryTime = new Date().toISOString();

  // CSR 側のフックが getBoundaryTime() で読み取るキーに合わせて保存
  queryClient.setQueryData(getBoundaryTimeKey(category, locale), boundaryTime);

  try {
    await queryClient.prefetchInfiniteQuery({
      queryKey: getStoriesInfiniteKey(category, locale),
      queryFn: ({ pageParam }: { pageParam: number }) =>
        fetchStoriesPage({ category, locale, boundaryTime, pageParam }),
      initialPageParam: 0,
      staleTime: Infinity,
    });
  } catch (e) {
    // prefetch の失敗はページ描画を止めない（CSR 側で再取得される）
    console.error("[prefetchStoriesInfinite] prefetch failed", e);
  }
}

import { createAnonServerClient, createClient } from "@/lib/supabase/server";

import { ProfileTileDto } from "@/lib/types";

export async function fetchProfilePageStaticParams(limit?: number) {
  const supabase = createAnonServerClient();
  let allUsernames: { user_name: string }[] = [];
  let page = 0;
  const pageSize = 1000; // Supabase default maximum

  while (page < Number.MAX_SAFE_INTEGER) {
    const result = await supabase
      .from("profiles")
      .select("user_name")
      .range(page * pageSize, (page + 1) * pageSize - 1)
      .order("user_name", { ascending: true });

    if (!result.data || result.data.length === 0) break;

    allUsernames = [...allUsernames, ...result.data];
    if (limit && allUsernames.length >= limit) {
      allUsernames = allUsernames.slice(0, limit);
      break;
    }

    if (result.data.length < pageSize) break;

    page++;
  }

  return allUsernames;
}

export async function fetchProfileByUsername(username: string) {
  const supabase = createAnonServerClient();

  const profileResult = await supabase
    .from("profiles")
    .select("*, followers!followers_followed_id_fkey(count)")
    .eq("user_name", username)
    .maybeSingle();

  if (!profileResult.data) {
    return null;
  }

  // Type the entire profile data
  type ProfileData = { id: string; [key: string]: unknown };
  const profileData = profileResult.data as ProfileData;
  const userId = profileData.id;

  // Execute as separate queries
  const [followersResult, followingResult] = await Promise.all([
    supabase.from("followers").select("count").eq("followed_id", userId),
    supabase.from("followers").select("count").eq("follower_id", userId),
  ]);

  return {
    ...profileResult.data,
    followers: followersResult.data?.[0]?.count ?? 0,
    following: followingResult.data?.[0]?.count ?? 0,
  } as ProfileTileDto;
}

/**
 * 現在のユーザーが対象ユーザーをフォローしているかチェック
 */
export async function checkIsFollowing(targetUserId: string): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;
  if (user.id === targetUserId) return false;

  const { data, error } = await supabase
    .from("followers")
    .select("follower_id")
    .eq("follower_id", user.id)
    .eq("followed_id", targetUserId)
    .maybeSingle();

  if (error) {
    console.error("[checkIsFollowing] error", error);
    return false;
  }

  return !!data;
}

/**
 * 現在のユーザーが対象ユーザーをミュートしているかチェック
 */
export async function checkIsMuted(targetUserId: string): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;
  if (user.id === targetUserId) return false;

  const { data, error } = await supabase
    .from("blocked_users")
    .select("blocker_id")
    .eq("blocker_id", user.id)
    .eq("blocked_id", targetUserId)
    .maybeSingle();

  if (error) {
    console.error("[checkIsMuted] error", error);
    return false;
  }

  return !!data;
}

// ミュートしているユーザーの型
export type MutedUser = {
  id: string;
  user_name: string;
  display_name: string;
  avatar_url: string | null;
};

/**
 * ミュートしているユーザー一覧を取得
 */
export async function fetchMutedUsers(): Promise<MutedUser[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("blocked_users")
    .select("profiles!blocked_users_blocked_id_fkey(id, user_name, display_name, avatar_url)")
    .eq("blocker_id", user.id);

  if (error) {
    console.error("[fetchMutedUsers] error", error);
    return [];
  }

  return data
    .map((item) => {
      const profiles = item.profiles as unknown as MutedUser | MutedUser[] | null;
      // 配列の場合は最初の要素を返す、オブジェクトの場合はそのまま返す
      if (Array.isArray(profiles)) {
        return profiles[0] ?? null;
      }
      return profiles;
    })
    .filter((profile): profile is MutedUser => profile !== null);
}

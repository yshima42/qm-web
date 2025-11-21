import { createAnonServerClient } from "@/lib/supabase/server";

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

import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

/**
 * プロファイルが存在するか確認
 */
async function checkProfileExists(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .single();

  return !!profile;
}

/**
 * ユーザーメタデータからdisplay_nameを取得
 */
function getDisplayName(user: User): string {
  return (
    user.user_metadata?.full_name || user.user_metadata?.name || "New User"
  );
}

/**
 * UUIDからuser_nameを生成（先頭10桁、ハイフン除去）
 */
function generateUserName(userId: string): string {
  return userId.replace(/-/g, "").substring(0, 10);
}

/**
 * ユーザーメタデータからavatar_urlを取得
 */
// function getAvatarUrl(user: User): string | null {
//   return user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
// }

/**
 * プロファイルを作成
 * @returns エラーがある場合はエラーオブジェクト、成功時はnull
 */
export async function createProfileIfNotExists(
  supabase: SupabaseClient,
  user: User
): Promise<{ error: Error } | null> {
  // プロファイル存在確認
  const profileExists = await checkProfileExists(supabase, user.id);

  if (profileExists) {
    return null; // 既に存在する場合は何もしない
  }

  // display_nameの取得
  const displayName = getDisplayName(user);

  // user_nameの生成
  const userName = generateUserName(user.id);

  // avatar_urlの取得
  // const avatarUrl = getAvatarUrl(user);

  // プロファイル作成
  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.id,
    user_name: userName,
    display_name: displayName,
    // avatar_url: avatarUrl,
    bio: null,
  });
  if (profileError) {
    return { error: new Error(profileError.message) };
  }

  return null; // 成功
}

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

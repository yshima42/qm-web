import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Admin Client (Service Role Key)
 *
 * このクライアントはRLSをバイパスし、管理者権限で操作を行います。
 * - app_metadataの更新
 * - 管理者専用の操作
 *
 * ⚠️ 注意: サーバーサイドでのみ使用すること（Server Actions, API Routes）
 * クライアントには絶対に露出させないこと
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY. Required for admin operations.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

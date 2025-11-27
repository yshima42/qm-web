"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * アカウント削除の結果
 */
export type DeleteAccountResult = {
  success: boolean;
  error?: string;
};

/**
 * アカウント削除を実行する
 * Flutterプロジェクトの実装を参考に、以下の手順で実行：
 * 1. handle_delete_user_created_objects RPC関数を呼び出してユーザーが作成したオブジェクトを削除
 * 2. delete_user RPC関数を呼び出してユーザーを削除
 * 3. サインアウト
 */
export async function deleteAccount(): Promise<DeleteAccountResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // 1. ユーザーが作成したオブジェクトを削除
    const { error: deleteObjectsError, data: deleteObjectsResult } = await supabase.rpc(
      "handle_delete_user_created_objects",
    );

    if (deleteObjectsError) {
      console.error("Error deleting user objects:", deleteObjectsError);
      return {
        success: false,
        error: `Failed to delete user objects: ${deleteObjectsError.message}`,
      };
    }

    if (deleteObjectsResult === false) {
      return {
        success: false,
        error: "Failed to delete user objects",
      };
    }

    // 2. ユーザーを削除
    const { error: deleteUserError, data: deleteUserResult } = await supabase.rpc("delete_user");

    if (deleteUserError) {
      console.error("Error deleting user:", deleteUserError);
      return {
        success: false,
        error: `Failed to delete user: ${deleteUserError.message}`,
      };
    }

    if (deleteUserResult === false) {
      return {
        success: false,
        error: "Failed to delete user",
      };
    }

    // 3. サインアウト
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      console.error("Error signing out:", signOutError);
      // ユーザーは既に削除されているので、エラーでもリダイレクトする
    }

    // 成功を返す（クライアント側でリダイレクトする）
    return { success: true };
  } catch (error) {
    console.error("Unexpected error during account deletion:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

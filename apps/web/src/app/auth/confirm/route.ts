import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { getDefaultCommunityPath } from "@/lib/utils/page-helpers";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");

  // code パラメータを使用する場合（PKCEフロー）
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // ユーザーの最初の習慣のコミュニティにリダイレクト
      const defaultPath = await getDefaultCommunityPath();
      redirect(defaultPath);
    } else {
      redirect(`/auth/error?error=${encodeURIComponent(error.message)}`);
    }
  }

  // token_hash と type を使用する場合
  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // typeに応じて安全なリダイレクト先を決定
      let redirectPath: string;

      switch (type) {
        case "recovery":
          redirectPath = "/auth/update-password";
          break;
        case "signup":
        case "email_change":
        case "email":
        default:
          // ユーザーの最初の習慣のコミュニティにリダイレクト
          redirectPath = await getDefaultCommunityPath();
          break;
      }

      redirect(redirectPath);
    } else {
      redirect(`/auth/error?error=${encodeURIComponent(error?.message || "Unknown error")}`);
    }
  }

  // どちらもない場合はエラー
  redirect(`/auth/error?error=${encodeURIComponent("No token hash, type, or code")}`);
}

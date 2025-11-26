import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

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
      // typeに応じてリダイレクト先を決定（セキュリティのため固定パス）
      redirect("/stories/habits/alcohol");
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
      // typeに応じて安全なリダイレクト先を決定（オープンリダイレクトを防ぐため固定パス）
      let redirectPath = "/stories/habits/alcohol";

      switch (type) {
        case "signup":
          redirectPath = "/stories/habits/alcohol";
          break;
        case "recovery":
          redirectPath = "/auth/update-password";
          break;
        case "email_change":
        case "email":
          redirectPath = "/stories/habits/alcohol";
          break;
        default:
          redirectPath = "/stories/habits/alcohol";
      }

      redirect(redirectPath);
    } else {
      redirect(`/auth/error?error=${encodeURIComponent(error?.message || "Unknown error")}`);
    }
  }

  // どちらもない場合はエラー
  redirect(`/auth/error?error=${encodeURIComponent("No token hash, type, or code")}`);
}

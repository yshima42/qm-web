import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/lib/supabase/server";
import { getDefaultCommunityPath } from "@/lib/utils/page-helpers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      const disableCsp = process.env.DISABLE_CSP === "true";
      const finalOrigin =
        isLocalEnv || !forwardedHost || disableCsp ? origin : `https://${forwardedHost}`;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: existingProfile, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("[oauth] failed to verify profile", profileError);
        } else if (!existingProfile) {
          // オンボーディングが必要な場合、ログイン後にデフォルトパスを取得
          const defaultPath = await getDefaultCommunityPath();
          const onboardingNext = next && next.startsWith("/") ? next : defaultPath;
          const onboardingUrl = new URL("/auth/onboarding", finalOrigin);
          onboardingUrl.searchParams.set("next", onboardingNext);
          return NextResponse.redirect(onboardingUrl);
        }
      }

      // ログイン後にデフォルトパスを取得（習慣データが正しく取得できる）
      const defaultPath = await getDefaultCommunityPath();
      const redirectPath = next && next.startsWith("/") ? next : defaultPath;
      return NextResponse.redirect(`${finalOrigin}${redirectPath}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error`);
}

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";
import { createAdminClient } from "./admin";

const ONBOARDING_PATH = "/auth/onboarding";
const DEFAULT_NEXT = "/stories/habits/alcohol";

type PendingCookie = {
  name: string;
  value: string;
  options?: Parameters<NextResponse["cookies"]["set"]>[2];
};

function applyPendingCookies(response: NextResponse, pendingCookies: PendingCookie[]) {
  pendingCookies.forEach(({ name, value, options }) => {
    if (options) {
      response.cookies.set(name, value, options);
    } else {
      response.cookies.set(name, value);
    }
  });

  return response;
}

export async function updateSession(request: NextRequest) {
  const pendingCookies: PendingCookie[] = [];

  if (!hasEnvVars) {
    return NextResponse.next({ request });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            pendingCookies.push({ name, value, options });
          });
        },
      },
    },
  );

  const pathname = request.nextUrl.pathname;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return applyPendingCookies(NextResponse.next({ request }), pendingCookies);
  }

  // app_metadataにprofile_completedフラグがあればDBクエリをスキップ
  if (user.app_metadata?.profile_completed) {
    return applyPendingCookies(NextResponse.next({ request }), pendingCookies);
  }

  // フラグがない場合のみDBでprofileを確認
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile && !pathname.startsWith(ONBOARDING_PATH)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = ONBOARDING_PATH;

    const intendedPath = `${pathname}${request.nextUrl.search}` || DEFAULT_NEXT;
    redirectUrl.searchParams.set("next", intendedPath);

    return applyPendingCookies(NextResponse.redirect(redirectUrl), pendingCookies);
  }

  // profileが存在するがフラグがない場合（既存モバイルアプリユーザー等）
  // バックグラウンドでapp_metadataを更新（レスポンスは待たない）
  if (profile && !user.app_metadata?.profile_completed) {
    setProfileCompletedFlag(user.id).catch((error) => {
      console.error("[proxy] failed to set profile_completed flag", error);
    });
  }

  return applyPendingCookies(NextResponse.next({ request }), pendingCookies);
}

/**
 * 既存ユーザーのapp_metadataにprofile_completedフラグを設定
 * モバイルアプリ等で既にprofileが作成されているユーザー向け
 */
async function setProfileCompletedFlag(userId: string) {
  try {
    const supabaseAdmin = createAdminClient();
    await supabaseAdmin.auth.admin.updateUserById(userId, {
      app_metadata: { profile_completed: true },
    });
  } catch (error) {
    console.error("[proxy] failed to update app_metadata", error);
  }
}

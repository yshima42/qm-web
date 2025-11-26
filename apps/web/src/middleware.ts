import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ONBOARDING_PATH = "/auth/onboarding";
const DEFAULT_NEXT = "/stories/habits/alcohol";

type PendingCookie = {
  name: string;
  value: string;
  options: Parameters<NextResponse["cookies"]["set"]>[2];
};

function applyCookies(response: NextResponse, cookies: PendingCookie[]) {
  cookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });
  return response;
}

export async function middleware(request: NextRequest) {
  const pendingCookies: PendingCookie[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies) {
          cookies.forEach((cookie) => pendingCookies.push(cookie));
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return applyCookies(NextResponse.next(), pendingCookies);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  const pathname = request.nextUrl.pathname;

  if (!profile && !pathname.startsWith(ONBOARDING_PATH)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = ONBOARDING_PATH;

    const intendedPath = `${pathname}${request.nextUrl.search}` || DEFAULT_NEXT;
    redirectUrl.searchParams.set("next", intendedPath);

    return applyCookies(NextResponse.redirect(redirectUrl), pendingCookies);
  }

  return applyCookies(NextResponse.next(), pendingCookies);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest).*)",
  ],
};


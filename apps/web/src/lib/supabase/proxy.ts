import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

const ONBOARDING_PATH = "/auth/onboarding";
const DEFAULT_NEXT = "/stories/habits/alcohol";

type PendingCookie = {
  name: string;
  value: string;
  options?: Parameters<NextResponse["cookies"]["set"]>[2];
};

function shouldSkipAuth(pathname: string) {
  return (
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/login")
  );
}

function applyPendingCookies(
  response: NextResponse,
  pendingCookies: PendingCookie[]
) {
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
    }
  );

  const pathname = request.nextUrl.pathname;

  const { data: claimsData } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(claimsData?.claims);

  if (!isAuthenticated) {
    if (shouldSkipAuth(pathname)) {
      return applyPendingCookies(NextResponse.next({ request }), pendingCookies);
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";

    return applyPendingCookies(
      NextResponse.redirect(loginUrl),
      pendingCookies
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return applyPendingCookies(NextResponse.next({ request }), pendingCookies);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile && !pathname.startsWith(ONBOARDING_PATH)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = ONBOARDING_PATH;

    const intendedPath =
      `${pathname}${request.nextUrl.search}` || DEFAULT_NEXT;
    redirectUrl.searchParams.set("next", intendedPath);

    return applyPendingCookies(
      NextResponse.redirect(redirectUrl),
      pendingCookies
    );
  }

  return applyPendingCookies(NextResponse.next({ request }), pendingCookies);
}

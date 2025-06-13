import { NextRequest, NextResponse } from "next/server";

import { routing } from "@/i18n/routing";

// OGPクローラーのUser-Agentパターン
const OGP_CRAWLERS =
  /facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|skypeuri|line|discordbot/i;

function getLocale(request: NextRequest): string {
  // OGPクローラーの場合は明示的にデフォルト言語を返す
  const userAgent = request.headers.get("user-agent") ?? "";
  if (OGP_CRAWLERS.test(userAgent)) {
    // Accept-Languageから判定するが、クローラーの場合は信頼性が低いため慎重に
    const acceptLanguage = request.headers.get("accept-language") ?? "";
    return acceptLanguage.includes("ja") ? "ja" : routing.defaultLocale;
  }

  // 通常のユーザー向けの言語判定
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const languages = acceptLanguage
    .split(",")
    .map((lang) => lang.split(";")[0].trim());

  for (const lang of languages) {
    if (routing.locales.includes(lang as "ja" | "en")) {
      return lang;
    }
    // 部分一致チェック（例：ja-JP -> ja）
    const baseLang = lang.split("-")[0];
    if (routing.locales.includes(baseLang as "ja" | "en")) {
      return baseLang;
    }
  }

  return routing.defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // パブリックファイルと Next.js 内部パスをスキップ
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return;
  }

  // 既に言語プレフィックスがある場合は処理しない
  const pathnameHasLocale = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return;

  // ルートパス（/）の場合に言語を判定してリダイレクト
  const locale = getLocale(request);
  const newUrl = new URL(`/${locale}${pathname}`, request.url);

  // OGPクローラーの場合は301リダイレクト（永続的）
  const userAgent = request.headers.get("user-agent") ?? "";
  const statusCode = OGP_CRAWLERS.test(userAgent) ? 301 : 307;

  return NextResponse.redirect(newUrl, statusCode);
}

export const config = {
  // ルートパスと言語プレフィックス付きのパスに対してミドルウェアを適用
  matcher: [
    // 内部パス（_next）をスキップ
    "/((?!_next).*)",
    // オプション：ルートURLのみに制限する場合
    // "/"
  ],
};

import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { APP_IDS } from "@/apps";
import { routing } from "@/i18n/routing";

// ドメインからアプリIDへのマッピング
const APP_DOMAINS: Record<string, string> = {
  "about.quitmate.app": "quitmate",
  // 将来的に他のドメインも追加可能
};

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // まず、/[app]/[locale] 形式のパスをチェック（パスベースのルーティング）
  const appLocaleMatch = pathname.match(/^\/([^/]+)\/(en|ja)(\/.*|$)/);
  if (appLocaleMatch) {
    const appId = appLocaleMatch[1];

    // 有効なアプリIDかチェック
    if (APP_IDS.includes(appId as (typeof APP_IDS)[number])) {
      // /[app]/[locale] 形式なので、next-intlのミドルウェアをスキップ
      // Next.jsのルーティングシステムに直接渡す
      return NextResponse.next();
    }
  }

  // ドメインベースのルーティング（about.quitmate.app または localhost）
  const isQuitmateDomain = APP_DOMAINS[hostname] || hostname.startsWith("localhost");
  if (isQuitmateDomain) {
    const appId = APP_DOMAINS[hostname] || "quitmate";

    // 既に /[app]/[locale] 形式の場合はそのままnext-intlミドルウェアを適用
    if (pathname.startsWith(`/${appId}/`)) {
      return intlMiddleware(request);
    }

    // QuitMateアプリの場合、/[locale] 形式のパスを /[app]/[locale] にリライト（内部的に）
    // 初回ロード時のみ有効（サーバーサイド）
    const localeMatch = pathname.match(/^\/(en|ja)(\/.*|$)/);
    if (localeMatch) {
      const locale = localeMatch[1];
      const restPath = pathname.slice(localeMatch[0].length);
      // restPathが空の場合は空文字列のまま（ルートパス）
      const newPath = `/${appId}/${locale}${restPath}`;
      const url = new URL(newPath, request.url);
      return NextResponse.rewrite(url);
    }

    // ルートパスの場合はデフォルトロケールでリライト
    if (pathname === "/" || pathname === "") {
      const newPath = `/${appId}/${routing.defaultLocale}`;
      return NextResponse.rewrite(new URL(newPath, request.url));
    }

    // その他のパスも /[app] プレフィックスを追加
    const newPath = `/${appId}${pathname}`;
    return NextResponse.rewrite(new URL(newPath, request.url));
  }

  // それ以外のパスはnext-intlのミドルウェアを適用
  // /[locale]/... 形式を期待
  return intlMiddleware(request);
}

export const config = {
  // 静的ファイル、API、Next.js内部ファイルを除外
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

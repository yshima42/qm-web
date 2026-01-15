"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import type { ComponentProps } from "react";

type AppLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

/**
 * アプリIDとロケールを自動的に含むLinkコンポーネント
 * クライアントサイドナビゲーションが正しく動作するように、実際のファイルシステム構造に合わせて
 * /[app]/[locale]/... 形式のURLを生成する
 */
export function AppLink({ href, ...props }: AppLinkProps) {
  const params = useParams();
  const locale = useLocale();
  const app = params?.app as string | undefined;

  // アプリIDとロケールを含む完全なパスを生成
  // クライアントサイドナビゲーションが正しく動作するように、常に /[app]/[locale]/... 形式を使用
  let finalHref = href;

  if (app) {
    // アプリIDがある場合は /[app]/[locale] プレフィックスを追加
    if (href === "/") {
      finalHref = `/${app}/${locale}`;
    } else if (
      href.startsWith("/") &&
      !href.startsWith(`/${app}/${locale}/`) &&
      !href.startsWith(`/${app}/${locale}`)
    ) {
      finalHref = `/${app}/${locale}${href}`;
    }
  } else {
    // アプリIDがない場合は、/[locale] プレフィックスのみ追加
    if (href === "/") {
      finalHref = `/${locale}`;
    } else if (
      href.startsWith("/") &&
      !href.startsWith(`/${locale}/`) &&
      !href.startsWith(`/${locale}`)
    ) {
      finalHref = `/${locale}${href}`;
    }
  }

  return <Link href={finalHref} {...props} />;
}

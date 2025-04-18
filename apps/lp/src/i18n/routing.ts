import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

// 利用可能な言語とデフォルト言語を設定
export const routing = defineRouting({
  locales: ["en", "ja"],
  defaultLocale: "en", // グローバルなフォールバックとしてenを設定
});

// ナビゲーション用のユーティリティを作成
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

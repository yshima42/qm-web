import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

import { AuthButton } from "@/components/auth-button";
import { BackButton } from "@/components/layout/back-button";
import { MobileHeaderSidebar } from "@/components/layout/mobile-header-sidebar";

import type { ProfileTileDto } from "@/lib/types";

export type HeaderProps = {
  title?: string;
  titleElement?: React.ReactNode;
  showBackButton?: boolean;
  backUrl?: string;
  rightElement?: React.ReactNode;
  hideTitle?: {
    mobile?: boolean;
    desktop?: boolean;
  };
  icon?: React.ReactNode;
  currentUserProfile?: ProfileTileDto | null;
  hideHeader?: boolean;
};

export function Header({
  title,
  titleElement,
  showBackButton,
  backUrl,
  rightElement,
  hideTitle,
  icon,
  currentUserProfile,
  hideHeader,
}: HeaderProps) {
  // ヘッダーを完全に非表示にする場合
  if (hideHeader) {
    return null;
  }

  // ログイン中でデスクトップサイズの場合はヘッダーを非表示（戻るボタンがある場合は除く）
  const isLoggedIn = !!currentUserProfile;
  const hideOnDesktop = isLoggedIn && !showBackButton;

  // 戻るボタン + タイトル左寄せレイアウト
  if (showBackButton) {
    return (
      <header className="border-border bg-background/80 sticky top-0 z-20 border-b backdrop-blur-sm">
        <div className="flex h-14 items-center px-4">
          <div className="flex items-center gap-4">
            <BackButton backUrl={backUrl} />
            {titleElement ? titleElement : <h1 className="text-lg font-bold">{title}</h1>}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {rightElement}
            <AuthButton />
          </div>
        </div>
      </header>
    );
  }

  // 通常の中央寄せレイアウト
  return (
    <header
      className={`border-border bg-background/80 sticky top-0 z-20 border-b backdrop-blur-sm ${
        hideOnDesktop ? "md:hidden" : ""
      }`}
    >
      <div className="relative flex h-14 items-center justify-between px-4">
        <div className="flex w-24 items-center">
          <MobileHeaderSidebar currentUserProfile={currentUserProfile} />
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          {isLoggedIn && !titleElement && !title && !icon ? (
            // ログイン時、タイトルがない場合はロゴを表示（スマホのみ）
            <Link href="/" className="md:hidden">
              <div className="flex items-center gap-1">
                <Image
                  src="/images/icon-web.png"
                  alt="QuitMate Logo"
                  width={20}
                  height={20}
                  className="h-5 w-auto"
                />
                <span className="text-lg font-medium leading-tight">QuitMate</span>
              </div>
            </Link>
          ) : titleElement ? (
            <>
              <div
                className={clsx(
                  hideTitle?.mobile ? "hidden" : "",
                  hideTitle?.desktop ? "md:hidden" : "md:block",
                )}
              >
                {titleElement}
              </div>
              {!titleElement && (
                <h1
                  className={clsx(
                    "whitespace-nowrap text-base font-medium",
                    "md:hidden",
                    hideTitle?.desktop ? "hidden" : "block",
                  )}
                >
                  {title}
                </h1>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center gap-2">
              {icon && <div className="text-foreground">{icon}</div>}
              <h1
                className={`whitespace-nowrap text-base font-medium ${hideTitle?.mobile ? "hidden md:block" : ""} ${hideTitle?.desktop ? "md:hidden" : ""}`}
              >
                {title}
              </h1>
            </div>
          )}
        </div>

        <div className="flex w-24 items-center justify-end gap-2">
          {rightElement}
          <AuthButton />
        </div>
      </div>
    </header>
  );
}

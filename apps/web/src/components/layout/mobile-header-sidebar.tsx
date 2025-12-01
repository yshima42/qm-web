"use client";

import { DefaultAvatar, Sheet, SheetContent, SheetHeader, SheetTitle } from "@quitmate/ui";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";

import type { ProfileTileDto } from "@/lib/types";
import { MobileSidebarContent } from "./mobile-sidebar-content";

type MobileHeaderSidebarProps = {
  currentUserProfile?: ProfileTileDto | null;
};

export function MobileHeaderSidebar({ currentUserProfile }: MobileHeaderSidebarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const t = useTranslations("sidebar");
  const tProfile = useTranslations("profile-header");

  return (
    <>
      {/* サイドバーを開くボタン（ヘッダーに表示） */}
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="text-muted-foreground hover:text-foreground flex items-center justify-center rounded-full p-1 transition-colors md:hidden"
        aria-label={t("openMenu")}
      >
        {currentUserProfile ? (
          currentUserProfile.avatar_url ? (
            <Image
              src={currentUserProfile.avatar_url}
              alt={currentUserProfile.display_name}
              width={32}
              height={32}
              className="size-8 rounded-full object-cover"
            />
          ) : (
            <DefaultAvatar size="sm" className="size-8" />
          )
        ) : (
          <Menu className="size-6" />
        )}
      </button>

      {/* サイドバーシート */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="left" className="w-64 p-0 sm:max-w-xs [&>button]:hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>{t("navigationMenu")}</SheetTitle>
          </SheetHeader>
          <div className="bg-background flex h-full flex-col">
            {/* ロゴ（ログインしていない時のみ表示） */}
            {!currentUserProfile && (
              <div className="shrink-0 px-4 pb-3 pt-6">
                <Link href="/" onClick={() => setSheetOpen(false)} className="flex items-end gap-1">
                  <Image
                    src="/images/icon-web.png"
                    alt="QuitMate Logo"
                    width={24}
                    height={24}
                    className="h-8 w-auto"
                  />
                  <span className="text-2xl font-medium leading-tight">QuitMate</span>
                </Link>
              </div>
            )}

            {/* プロフィール情報（ログイン時のみ表示） */}
            {currentUserProfile && (
              <div className="px-6 pb-4 pt-3">
                <Link
                  href={`/${currentUserProfile.user_name}`}
                  onClick={() => setSheetOpen(false)}
                  className="flex flex-col gap-3"
                >
                  {currentUserProfile.avatar_url ? (
                    <Image
                      src={currentUserProfile.avatar_url}
                      alt={currentUserProfile.display_name}
                      width={64}
                      height={64}
                      className="size-16 rounded-full object-cover"
                    />
                  ) : (
                    <DefaultAvatar size="lg" className="size-16" />
                  )}
                  <div className="flex flex-col gap-1">
                    <h2 className="text-foreground text-xl font-bold">
                      {currentUserProfile.display_name}
                    </h2>
                    <p className="text-muted-foreground text-sm">@{currentUserProfile.user_name}</p>
                    <div className="text-muted-foreground mt-2 flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-foreground font-semibold">
                          {currentUserProfile.following}
                        </span>
                        <span>{tProfile("following")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-foreground font-semibold">
                          {currentUserProfile.followers}
                        </span>
                        <span>{tProfile("followers")}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* サイドバーコンテンツ */}
            <div className="flex-1 overflow-y-auto">
              <MobileSidebarContent
                onLinkClick={() => {
                  setSheetOpen(false);
                }}
                currentUserUsername={currentUserProfile?.user_name ?? null}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

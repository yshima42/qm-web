"use client";

import { Button, CategoryIcon, SidebarIcon, AppDownloadDialogTrigger } from "@quitmate/ui";
import {
  BookOpen,
  ClipboardCheck,
  Pen,
  ChevronDown,
  ChevronRight,
  Users,
  Compass,
  Settings,
  Smartphone,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

import { CATEGORY_ICONS, HABIT_CATEGORIES, getCategoryUrl } from "@/lib/categories";
import { HabitCategoryName } from "@/lib/types";
import { useHabits } from "@/features/habits/providers/habits-provider";
import {
  categorizeHabitCategories,
  getFirstHabitCommunityUrl,
  isMyCommunityLinkActive,
} from "./sidebar-utils";

type SidebarContentProps = {
  habitCategories: HabitCategoryName[];
  compact?: boolean;
  onLinkClick?: () => void;
  skipLogo?: boolean;
  currentUserUsername?: string | null;
  currentUserProfile?: {
    user_name: string;
    display_name: string;
    avatar_url: string | null;
  } | null;
};

export function SidebarContent({
  habitCategories,
  compact = false,
  onLinkClick,
  skipLogo = false,
  currentUserUsername,
  currentUserProfile,
}: SidebarContentProps) {
  const pathname = usePathname();
  const t = useTranslations("sidebar");
  const tCategory = useTranslations("categories");
  const tAppDownload = useTranslations("app-download-dialog");
  const [isOtherCommunityOpen, setIsOtherCommunityOpen] = useState(false); // デフォルトは閉じた状態

  // 習慣データを取得（Providerから、存在しない場合は空配列）
  // React Hooksのルールに従い、常に同じ順序で呼び出す
  const habits = useHabits();

  const handleLinkClick = () => {
    if (onLinkClick) onLinkClick();
  };

  // 登録済みカテゴリーとその他カテゴリーを分ける
  const { myCategories, otherCategories } = useMemo(() => {
    const categorized = categorizeHabitCategories(habits);
    // habitCategoriesから"Official"を除外して、登録済み以外のカテゴリーを取得
    const filteredCategories = habitCategories.filter((cat) => cat !== "Official");
    const otherCats = filteredCategories.filter((cat) => !categorized.myCategories.includes(cat));

    return { myCategories: categorized.myCategories, otherCategories: otherCats };
  }, [habits, habitCategories]);

  // 現在のパスが「その他コミュニティ」に含まれる場合は開く（初回のみ、デフォルトは閉じた状態）
  useEffect(() => {
    const currentCategory = habitCategories
      .filter((cat) => cat !== "Official") // "Official"は除外
      .find((cat) => {
        const href = getCategoryUrl(cat);
        return pathname === href;
      });
    if (currentCategory && otherCategories.includes(currentCategory)) {
      setIsOtherCommunityOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 初回のみ実行（現在のページがその他コミュニティの場合のみ開く）

  return (
    <div className="flex h-full flex-col">
      {!skipLogo && (
        <div className={`mb-6 shrink-0 py-3 ${compact ? "flex justify-center" : "px-4"}`}>
          <Link
            href="/"
            className={`flex items-end gap-1 ${compact ? "justify-center" : ""}`}
            onClick={handleLinkClick}
          >
            <Image
              src="/images/icon-web.png"
              alt="QuitMate Logo"
              width={24}
              height={24}
              className="h-8 w-auto"
            />
            {!compact && <span className="text-2xl font-medium leading-tight">QuitMate</span>}
          </Link>
        </div>
      )}

      <div className="scrollbar-hide mb-6 min-h-0 flex-1 space-y-1 overflow-y-auto">
        {currentUserUsername && (
          <Link
            href={`/${currentUserUsername}`}
            className={cn(
              "flex items-center gap-4 rounded-lg px-4 py-3 transition-colors",
              pathname === `/${currentUserUsername}`
                ? "bg-accent text-foreground font-semibold"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
              compact && "justify-center px-2",
            )}
            title={t("profile")}
            onClick={handleLinkClick}
          >
            <div className="shrink-0">
              {currentUserProfile?.avatar_url ? (
                <Image
                  src={currentUserProfile.avatar_url}
                  alt={currentUserProfile.display_name}
                  width={compact ? 28 : 24}
                  height={compact ? 28 : 24}
                  className={cn("rounded-full object-cover", compact ? "size-7" : "size-6")}
                />
              ) : (
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700",
                    compact ? "size-7" : "size-6",
                  )}
                >
                  <UserRound
                    size={compact ? 18 : 16}
                    className="text-white"
                    strokeWidth={pathname === `/${currentUserUsername}` ? 2.5 : 2}
                  />
                </div>
              )}
            </div>
            {!compact && <span className="text-sm font-medium">{t("profile")}</span>}
          </Link>
        )}
        {currentUserUsername && (
          <SidebarIcon
            icon={ClipboardCheck}
            label={t("habits")}
            href="/habits"
            active={pathname === "/habits"}
            showLabel={!compact}
            onClick={handleLinkClick}
          />
        )}
        {/* マイコミュニティ */}
        {myCategories.length > 0 && (
          <>
            {compact ? (
              // コンパクトモード（中間サイズ）の時はリンクとして機能
              <Link
                href={getFirstHabitCommunityUrl(habits)}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center justify-center gap-4 rounded-md px-2 py-2 transition-colors",
                  isMyCommunityLinkActive(pathname, habits)
                    ? "bg-accent text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
                title={t("myCommunity")}
              >
                <Users size={24} strokeWidth={2} className="transition-all" />
              </Link>
            ) : (
              // PCサイズの時はリンクではなく、通常のdivとして表示
              <div
                className="text-muted-foreground flex items-center gap-4 rounded-md px-4 py-2"
                title={t("myCommunity")}
              >
                <Users size={18} strokeWidth={2} className="transition-all" />
                <span>{t("myCommunity")}</span>
              </div>
            )}
            {/* マイコミュニティのカテゴリー */}
            <div className={compact ? "" : "pl-4"}>
              {/* 「すべて」を一番上に表示 */}
              <CategoryIcon
                icon={CATEGORY_ICONS["All"]}
                label={tCategory("All")}
                href={getCategoryUrl("All")}
                active={pathname === getCategoryUrl("All")}
                showLabel={!compact}
                onClick={handleLinkClick}
              />
              {myCategories.map((category) => {
                const href = getCategoryUrl(category);
                const Icon = CATEGORY_ICONS[category];
                const displayName = tCategory(category);

                return (
                  <CategoryIcon
                    key={category}
                    icon={Icon}
                    label={displayName}
                    href={href}
                    active={pathname === href}
                    showLabel={!compact}
                    onClick={handleLinkClick}
                  />
                );
              })}
            </div>
          </>
        )}
        {/* ログインしていない or 習慣未登録の場合：「Communities」セクションを表示 */}
        {myCategories.length === 0 && (
          <>
            <div
              className={`flex items-center gap-4 rounded-md px-4 py-2 transition-colors ${
                !compact ? "" : "justify-center px-2"
              } text-muted-foreground`}
              title={!compact ? t("communities") : undefined}
            >
              <Compass size={compact ? 24 : 18} strokeWidth={2} className="transition-all" />
              {!compact && <span>{t("communities")}</span>}
            </div>
            <div className={compact ? "" : "pl-4"}>
              {/* 「すべて」を一番上に表示 */}
              <CategoryIcon
                icon={CATEGORY_ICONS["All"]}
                label={tCategory("All")}
                href={getCategoryUrl("All")}
                active={pathname === getCategoryUrl("All")}
                showLabel={!compact}
                onClick={handleLinkClick}
              />
              {/* 全カテゴリを表示（Officialを除く） */}
              {habitCategories
                .filter((cat) => cat !== "Official")
                .map((category) => {
                  const href = getCategoryUrl(category);
                  const Icon = CATEGORY_ICONS[category];
                  const displayName = tCategory(category);

                  return (
                    <CategoryIcon
                      key={category}
                      icon={Icon}
                      label={displayName}
                      href={href}
                      active={pathname === href}
                      showLabel={!compact}
                      onClick={handleLinkClick}
                    />
                  );
                })}
            </div>
          </>
        )}
        {/* その他コミュニティ - myCategoriesがある場合のみ表示 */}
        {myCategories.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setIsOtherCommunityOpen(!isOtherCommunityOpen)}
              className={`flex items-center rounded-md py-2 transition-colors ${
                !compact ? "w-full justify-between gap-4 px-4" : "w-full justify-center px-2"
              } text-muted-foreground hover:bg-primary-light/10 hover:text-primary-light dark:hover:bg-primary-dark/10 dark:hover:text-primary-dark hover:font-medium`}
              title={!compact ? t("otherCommunity") : undefined}
            >
              {compact ? (
                <Compass size={24} strokeWidth={2} className="transition-all" />
              ) : (
                <>
                  <div className="flex min-w-0 items-center gap-4">
                    <Compass size={18} strokeWidth={2} className="shrink-0 transition-all" />
                    <span className="truncate">{t("otherCommunity")}</span>
                  </div>
                  <div className="shrink-0">
                    {isOtherCommunityOpen ? (
                      <ChevronDown className="size-4" />
                    ) : (
                      <ChevronRight className="size-4" />
                    )}
                  </div>
                </>
              )}
            </button>
            {/* その他コミュニティのカテゴリー（開いた時のみ表示） */}
            {isOtherCommunityOpen && (
              <div className={compact ? "" : "pl-4"}>
                {otherCategories.map((category) => {
                  const href = getCategoryUrl(category);
                  const Icon = CATEGORY_ICONS[category];
                  const displayName = tCategory(category);

                  return (
                    <CategoryIcon
                      key={category}
                      icon={Icon}
                      label={displayName}
                      href={href}
                      active={pathname === href}
                      showLabel={!compact}
                      onClick={handleLinkClick}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
        {/* 記事 */}
        <SidebarIcon
          icon={BookOpen}
          label={t("articles")}
          href="/articles"
          active={pathname === "/articles"}
          showLabel={!compact}
          onClick={handleLinkClick}
        />
        {/* アプリ */}
        <AppDownloadDialogTrigger
          title={tAppDownload("title")}
          description={tAppDownload("description")}
          qrCodeLabel={tAppDownload("qrCodeLabel")}
          qrCodeAlt={tAppDownload("qrCodeAlt")}
          storeLabel={tAppDownload("storeLabel")}
        >
          <div
            className={`flex items-center gap-4 rounded-md px-4 py-2 transition-colors ${
              !compact ? "" : "justify-center px-2"
            } text-muted-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer`}
            title={!compact ? t("app") : undefined}
          >
            <Smartphone size={compact ? 24 : 18} strokeWidth={2} className="transition-all" />
            {!compact && <span>{t("app")}</span>}
          </div>
        </AppDownloadDialogTrigger>
        {/* 設定 */}
        {currentUserUsername && (
          <SidebarIcon
            icon={Settings}
            label={t("settings")}
            href="/settings"
            active={pathname.startsWith("/settings")}
            showLabel={!compact}
            onClick={handleLinkClick}
          />
        )}
        {/* Post Story Button - 設定の下に配置 */}
        {currentUserUsername && (
          <>
            {compact ? (
              <div className="px-2 pt-2">
                <button
                  className="flex w-full items-center justify-center rounded-full bg-black p-3 text-white shadow-sm transition-colors hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("openStoryModal"));
                    handleLinkClick();
                  }}
                  aria-label={t("postStory")}
                >
                  <Pen size={20} strokeWidth={2} />
                </button>
              </div>
            ) : (
              <div className="px-4 pt-2">
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-full rounded-lg text-sm font-semibold"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("openStoryModal"));
                    handleLinkClick();
                  }}
                >
                  {t("postStory")}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

type SidebarProps = {
  currentUserUsername?: string | null;
  currentUserProfile?: {
    user_name: string;
    display_name: string;
    avatar_url: string | null;
  } | null;
};

export function Sidebar({ currentUserUsername, currentUserProfile }: SidebarProps) {
  return (
    <>
      <aside className="border-border sticky top-0 hidden h-screen w-64 shrink-0 border-r pt-4 lg:block">
        <SidebarContent
          habitCategories={HABIT_CATEGORIES}
          currentUserUsername={currentUserUsername}
          currentUserProfile={currentUserProfile}
        />
      </aside>

      <aside className="border-border sticky top-0 hidden h-screen w-16 shrink-0 border-r pt-4 md:block lg:hidden">
        <SidebarContent
          habitCategories={HABIT_CATEGORIES}
          compact
          currentUserUsername={currentUserUsername}
          currentUserProfile={currentUserProfile}
        />
      </aside>
    </>
  );
}

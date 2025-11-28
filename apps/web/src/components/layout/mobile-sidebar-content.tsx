"use client";

import { AppDownloadDialogTrigger, CategoryIcon, SidebarIcon } from "@quitmate/ui";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Compass,
  Settings,
  Smartphone,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { CATEGORY_ICONS, HABIT_CATEGORIES, getCategoryUrl } from "@/lib/categories";
import { useHabits } from "@/features/habits/providers/habits-provider";
import { categorizeHabitCategories } from "./sidebar-utils";

type MobileSidebarContentProps = {
  onLinkClick?: () => void;
  currentUserUsername?: string | null;
};

export function MobileSidebarContent({
  onLinkClick,
  currentUserUsername,
}: MobileSidebarContentProps) {
  const pathname = usePathname();
  const t = useTranslations("sidebar");
  const tCategory = useTranslations("categories");
  const tAppDownload = useTranslations("app-download-dialog");
  const [isOtherCommunityOpen, setIsOtherCommunityOpen] = useState(false);

  // 習慣データを取得（Providerから、存在しない場合は空配列）
  const habits = useHabits();

  const handleLinkClick = () => {
    if (onLinkClick) onLinkClick();
  };

  // 登録済みカテゴリーとその他カテゴリーを分ける
  const { myCategories, otherCategories } = useMemo(
    () => categorizeHabitCategories(habits),
    [habits],
  );

  // 現在のパスが「その他コミュニティ」に含まれる場合は開く（初回のみ）
  useEffect(() => {
    const currentCategory = HABIT_CATEGORIES.filter((cat) => cat !== "Official").find((cat) => {
      const href = getCategoryUrl(cat);
      return pathname === href;
    });
    if (currentCategory && otherCategories.includes(currentCategory)) {
      setIsOtherCommunityOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="scrollbar-hide min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2">
        {/* 記事 */}
        <SidebarIcon
          icon={BookOpen}
          label={t("articles")}
          href="/articles"
          active={pathname === "/articles"}
          showLabel
          onClick={handleLinkClick}
        />

        {/* マイコミュニティ */}
        {myCategories.length > 0 && (
          <>
            <div className="text-muted-foreground flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium">
              <Users size={20} strokeWidth={2} className="transition-all" />
              <span>{t("myCommunity")}</span>
            </div>
            {/* マイコミュニティのカテゴリー */}
            <div className="pl-2">
              {/* 「すべて」を一番上に表示 */}
              <CategoryIcon
                icon={CATEGORY_ICONS["All"]}
                label={tCategory("All")}
                href="/stories/habits/all"
                active={pathname === "/stories/habits/all"}
                showLabel
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
                    showLabel
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
            <div className="text-muted-foreground flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium">
              <Compass size={20} strokeWidth={2} className="transition-all" />
              <span>{t("communities")}</span>
            </div>
            <div className="pl-2">
              {/* 「すべて」を一番上に表示 */}
              <CategoryIcon
                icon={CATEGORY_ICONS["All"]}
                label={tCategory("All")}
                href="/stories/habits/all"
                active={pathname === "/stories/habits/all"}
                showLabel
                onClick={handleLinkClick}
              />
              {/* 全カテゴリを表示（Officialを除く） */}
              {HABIT_CATEGORIES.filter((cat) => cat !== "Official").map((category) => {
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
                    showLabel
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
              className="text-muted-foreground hover:bg-accent hover:text-foreground flex w-full items-center justify-between gap-4 rounded-lg px-4 py-3 transition-colors"
            >
              <div className="flex min-w-0 items-center gap-4">
                <Compass size={20} strokeWidth={2} className="shrink-0 transition-all" />
                <span className="truncate text-sm font-medium">{t("otherCommunity")}</span>
              </div>
              <div className="shrink-0">
                {isOtherCommunityOpen ? (
                  <ChevronDown className="size-4" />
                ) : (
                  <ChevronRight className="size-4" />
                )}
              </div>
            </button>
            {/* その他コミュニティのカテゴリー（開いた時のみ表示） */}
            {isOtherCommunityOpen && (
              <div className="pl-2">
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
                      showLabel
                      onClick={handleLinkClick}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* アプリ */}
        <AppDownloadDialogTrigger
          title={tAppDownload("title")}
          description={tAppDownload("description")}
          qrCodeLabel={tAppDownload("qrCodeLabel")}
          qrCodeAlt={tAppDownload("qrCodeAlt")}
          storeLabel={tAppDownload("storeLabel")}
        >
          <div className="text-muted-foreground hover:bg-accent hover:text-foreground flex cursor-pointer items-center gap-4 rounded-lg px-4 py-3 transition-colors">
            <Smartphone size={20} strokeWidth={2} className="transition-all" />
            <span className="text-sm font-medium">{t("app")}</span>
          </div>
        </AppDownloadDialogTrigger>

        {/* 設定 */}
        {currentUserUsername && (
          <SidebarIcon
            icon={Settings}
            label={t("settings")}
            href="/settings"
            active={pathname.startsWith("/settings")}
            showLabel
            onClick={handleLinkClick}
          />
        )}
      </div>
    </div>
  );
}

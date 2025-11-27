"use client";

import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetTitle,
  ThemeSwitcher,
  CategoryIcon,
  SidebarIcon,
  StoreBadges,
} from "@quitmate/ui";
import {
  Home,
  BookOpen,
  Menu,
  Target,
  Pen,
  ChevronDown,
  ChevronRight,
  Users,
  Compass,
  Settings,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect, useMemo } from "react";

import { CATEGORY_ICONS, HABIT_CATEGORIES } from "@/lib/categories";
import { HabitCategoryName } from "@/lib/types";
import { useHabits } from "@/features/habits/providers/habits-provider";

type SidebarContentProps = {
  habitCategories: HabitCategoryName[];
  compact?: boolean;
  onLinkClick?: () => void;
  skipLogo?: boolean;
  currentUserUsername?: string | null;
};

export function SidebarContent({
  habitCategories,
  compact = false,
  onLinkClick,
  skipLogo = false,
  currentUserUsername,
}: SidebarContentProps) {
  const pathname = usePathname();
  const t = useTranslations("sidebar");
  const tCategory = useTranslations("categories");
  const [isOtherCommunityOpen, setIsOtherCommunityOpen] = useState(false); // デフォルトは閉じた状態

  // 習慣データを取得（Providerから、存在しない場合は空配列）
  // React Hooksのルールに従い、常に同じ順序で呼び出す
  const habits = useHabits();

  const handleLinkClick = () => {
    if (onLinkClick) onLinkClick();
  };

  // 登録済みカテゴリーとその他カテゴリーを分ける
  const { myCategories, otherCategories } = useMemo(() => {
    const myCategoryNames = new Set<HabitCategoryName>(
      habits.map((habit) => habit.habit_categories.habit_category_name as HabitCategoryName),
    );
    // "Official"は除外
    const filteredCategories = habitCategories.filter((cat) => cat !== "Official");
    const myCats: HabitCategoryName[] = [];
    const otherCats: HabitCategoryName[] = [];

    filteredCategories.forEach((cat) => {
      if (myCategoryNames.has(cat)) {
        myCats.push(cat);
      } else {
        otherCats.push(cat);
      }
    });

    return { myCategories: myCats, otherCategories: otherCats };
  }, [habits, habitCategories]);

  // 現在のパスが「その他コミュニティ」に含まれる場合は開く（初回のみ、デフォルトは閉じた状態）
  useEffect(() => {
    const currentCategory = habitCategories.find((cat) => {
      const href = `/stories/habits/${cat.toLowerCase().replace(/\s+/g, "-")}`;
      return pathname === href;
    });
    if (currentCategory && otherCategories.includes(currentCategory)) {
      setIsOtherCommunityOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 初回のみ実行（現在のページがその他コミュニティの場合のみ開く）

  return (
    <div className="flex h-full flex-col">
      {!compact && !skipLogo && (
        <div className="mb-6 shrink-0 px-4 py-3">
          <Link href="/" className="flex items-end gap-1" onClick={handleLinkClick}>
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

      <div className="mb-6 min-h-0 flex-1 space-y-1 overflow-y-auto pr-2">
        <SidebarIcon
          icon={Home}
          label={t("home")}
          href="/"
          active={pathname === "/"}
          showLabel={!compact}
          onClick={handleLinkClick}
        />
        {currentUserUsername && (
          <SidebarIcon
            icon={User}
            label={t("profile")}
            href={`/${currentUserUsername}`}
            active={pathname === `/${currentUserUsername}`}
            showLabel={!compact}
            onClick={handleLinkClick}
          />
        )}
        <SidebarIcon
          icon={Target}
          label="Habits"
          href="/habits"
          active={pathname === "/habits"}
          showLabel={!compact}
          onClick={handleLinkClick}
        />
        <SidebarIcon
          icon={BookOpen}
          label={t("articles")}
          href="/articles"
          active={pathname === "/articles"}
          showLabel={!compact}
          onClick={handleLinkClick}
        />
        {/* マイコミュニティ */}
        {myCategories.length > 0 && (
          <>
            <div
              className={`flex items-center gap-4 rounded-md px-4 py-2 transition-colors ${
                !compact ? "" : "justify-center px-2"
              } text-muted-foreground`}
              title={!compact ? t("myCommunity") : undefined}
            >
              <Users size={18} strokeWidth={2} className="transition-all" />
              {!compact && <span>{t("myCommunity")}</span>}
            </div>
            {/* マイコミュニティのカテゴリー */}
            <div className="pl-4">
              {myCategories.map((category) => {
                const href = `/stories/habits/${category.toLowerCase().replace(/\s+/g, "-")}`;
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
        {/* その他コミュニティ */}
        <button
          type="button"
          onClick={() => setIsOtherCommunityOpen(!isOtherCommunityOpen)}
          className={`flex items-center gap-4 rounded-md px-4 py-2 transition-colors ${
            !compact ? "w-full justify-between" : "justify-center px-2"
          } text-muted-foreground hover:bg-primary-light/10 hover:text-primary-light dark:hover:bg-primary-dark/10 dark:hover:text-primary-dark hover:font-medium`}
          title={!compact ? t("otherCommunity") : undefined}
        >
          <div className="flex min-w-0 items-center gap-4">
            <Compass size={18} strokeWidth={2} className="shrink-0 transition-all" />
            {!compact && <span className="truncate">{t("otherCommunity")}</span>}
          </div>
          {!compact && (
            <div className="shrink-0">
              {isOtherCommunityOpen ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </div>
          )}
        </button>
        {/* その他コミュニティのカテゴリー（開いた時のみ表示） */}
        {isOtherCommunityOpen && (
          <div className="pl-4">
            {otherCategories.map((category) => {
              const href = `/stories/habits/${category.toLowerCase().replace(/\s+/g, "-")}`;
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
        {/* 設定 */}
        <SidebarIcon
          icon={Settings}
          label={t("settings")}
          href="/settings"
          active={pathname.startsWith("/settings")}
          showLabel={!compact}
          onClick={handleLinkClick}
        />
      </div>

      {/* Post Story Button - moved below Articles */}
      <div className="shrink-0">
        {compact ? (
          <div className="pr-2">
            <button
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-center rounded-md px-4 py-2 transition-colors"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("openStoryModal"));
                handleLinkClick();
              }}
              aria-label={t("postStory")}
            >
              <Pen className="size-5" />
            </button>
          </div>
        ) : (
          <div className="px-4 pb-4">
            <Button
              className="w-full rounded-full font-semibold"
              size="lg"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("openStoryModal"));
                handleLinkClick();
              }}
            >
              {t("postStory")}
            </Button>
          </div>
        )}
      </div>

      <div className="mt-auto shrink-0 space-y-4 px-4 py-3">
        {!compact && (
          <div className="border-border bg-card hidden rounded-lg border p-3 shadow-sm lg:block">
            <h4 className="mb-2 text-center text-sm font-medium">{t("downloadTitle")}</h4>
            <div className="mb-3 flex justify-center">
              <div className="rounded bg-white p-0">
                <Image
                  src="/images/qr-code.svg"
                  alt={t("qrCodeAlt")}
                  width={100}
                  height={100}
                  className="rounded-none"
                />
              </div>
            </div>
            <StoreBadges size="small" />
          </div>
        )}
        <ThemeSwitcher />
      </div>
    </div>
  );
}

type SidebarProps = {
  currentUserUsername?: string | null;
};

export function Sidebar({ currentUserUsername }: SidebarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("sidebar");

  // クライアント側でのみマウントする（ハイドレーションエラーを防ぐため）
  useEffect(() => {
    setMounted(true);
  }, []);

  // 画面サイズが大きくなったときにモバイル用サイドバーを閉じる
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // md breakpoint以上になったら閉じる
        setSheetOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <aside className="border-border sticky top-0 hidden h-screen w-64 shrink-0 border-r pt-4 lg:block">
        <SidebarContent
          habitCategories={HABIT_CATEGORIES}
          currentUserUsername={currentUserUsername}
        />
      </aside>

      <aside className="border-border sticky top-0 hidden h-screen w-16 shrink-0 border-r pt-4 md:block lg:hidden">
        <SidebarContent
          habitCategories={HABIT_CATEGORIES}
          compact
          currentUserUsername={currentUserUsername}
        />
      </aside>

      <div className="fixed left-4 top-[7px] z-50 md:hidden">
        {mounted ? (
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full shadow-md"
                aria-label={t("openMenu")}
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 sm:max-w-xs">
              <SheetHeader className="pb-2">
                <SheetTitle className="sr-only">{t("navigationMenu")}</SheetTitle>
                <Link
                  href="/"
                  className="flex items-end gap-1"
                  onClick={() => {
                    setSheetOpen(false);
                  }}
                >
                  <Image
                    src="/images/icon-web.png"
                    alt="QuitMate Logo"
                    width={24}
                    height={24}
                    className="h-8 w-auto"
                  />
                  <span className="text-2xl font-medium leading-tight">QuitMate</span>
                </Link>
              </SheetHeader>
              <div className="pt-4">
                <SidebarContent
                  habitCategories={HABIT_CATEGORIES}
                  onLinkClick={() => {
                    setSheetOpen(false);
                  }}
                  skipLogo
                  currentUserUsername={currentUserUsername}
                />
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <Button
            size="icon"
            variant="outline"
            className="rounded-full shadow-md"
            aria-label={t("openMenu")}
            disabled
          >
            <Menu className="size-5" />
          </Button>
        )}
      </div>
    </>
  );
}

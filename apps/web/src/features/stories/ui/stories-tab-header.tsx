"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { HabitCategoryName } from "@/lib/types";
import { CATEGORY_ICONS } from "@/lib/categories";
import { Button } from "@quitmate/ui";
import { TimelineLanguageSelector } from "@/components/layout/timeline-language-selector";

type StoriesTabHeaderProps = {
  categoryName: HabitCategoryName;
  categoryDisplayName: string;
  categoryPath: string;
  isLoggedIn: boolean;
};

export function StoriesTabHeader({
  categoryName,
  categoryDisplayName,
  categoryPath,
  isLoggedIn,
}: StoriesTabHeaderProps) {
  const t = useTranslations("stories-tab");
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") ?? "category";

  // Client Component内でアイコンを取得
  const CategoryIcon = CATEGORY_ICONS[categoryName];

  const tabs = [
    {
      id: "category",
      label: categoryDisplayName,
      hasIcon: true,
      href: categoryPath,
    },
    ...(isLoggedIn
      ? [
          {
            id: "following",
            label: t("following"),
            hasIcon: false,
            href: `${categoryPath}?tab=following`,
          },
        ]
      : []),
  ];

  const tLogin = useTranslations("login-prompt");

  return (
    <div className="border-border bg-card sticky top-0 z-10 border-b">
      <div className="flex items-center">
        {/* タブ部分 */}
        <div className="flex flex-1">
          {tabs.map((tab) => {
            const isActive = tab.id === currentTab;

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-colors",
                  "hover:bg-accent/50",
                  isActive
                    ? "text-foreground border-primary border-b-2"
                    : "text-muted-foreground border-b-2 border-transparent",
                )}
              >
                {tab.hasIcon && CategoryIcon && (
                  <CategoryIcon className="size-4 stroke-[2.5px] text-green-800" />
                )}
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>

        {/* 言語設定とログインボタン */}
        <div className="flex items-center gap-2 px-4">
          {/* タイムライン言語設定 */}
          <TimelineLanguageSelector compact={true} />
          {/* 未ログイン時はログインボタンを表示 */}
          {!isLoggedIn && (
            <>
              <Button asChild size="sm" variant="outline">
                <Link href="/auth/login">{tLogin("login")}</Link>
              </Button>
              <Button asChild size="sm" variant="default">
                <Link href="/auth/sign-up">{tLogin("sign-up")}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

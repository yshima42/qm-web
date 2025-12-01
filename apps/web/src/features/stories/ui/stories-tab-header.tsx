"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { HabitCategoryName } from "@/lib/types";
import { CATEGORY_ICONS } from "@/lib/categories";
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

  // 未ログイン時はHeaderで表示するため、このコンポーネントは表示しない
  if (!isLoggedIn) {
    return null;
  }

  const tabs = [
    {
      id: "category",
      label: categoryDisplayName,
      hasIcon: true,
      href: categoryPath,
    },
    {
      id: "following",
      label: t("following"),
      hasIcon: false,
      href: `${categoryPath}?tab=following`,
    },
  ];

  // ログイン時はタブ表示
  return (
    <div className="border-border bg-card sticky top-0 z-10 border-b">
      <div className="flex items-center">
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

        {/* 言語設定（デスクトップのみ表示） */}
        <div className="hidden items-center px-4 md:flex">
          <TimelineLanguageSelector compact={true} />
        </div>
      </div>
    </div>
  );
}

'use client';

import { Button, Sheet, SheetContent, SheetHeader, SheetTrigger, SheetTitle } from '@quitmate/ui';
import { Home, BookOpen, Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { ThemeSwitcher } from '@/components/custom/theme-switcher';

import { CATEGORY_DISPLAY_NAMES, CATEGORY_ICONS, HABIT_CATEGORIES } from '@/lib/categories';
import { HabitCategoryName } from '@/lib/types';

import { CategoryIcon } from '../custom/category-icon';
import { SidebarIcon } from '../custom/sidebar-icon';

type SidebarContentProps = {
  habitCategories: HabitCategoryName[];
  compact?: boolean;
  onLinkClick?: () => void; // リンククリック時の追加処理
  skipLogo?: boolean; // ロゴを表示しないフラグを追加
};

export function SidebarContent({
  habitCategories,
  compact = false,
  onLinkClick,
  skipLogo = false,
}: SidebarContentProps) {
  const pathname = usePathname();

  // リンククリック時に追加処理を行うラッパー関数
  const handleLinkClick = () => {
    if (onLinkClick) onLinkClick();
  };

  return (
    <div className="flex h-full flex-col">
      {/* ロゴエリア（新規追加） */}
      {!compact && !skipLogo && (
        <div className="mb-6 px-4 py-3">
          <Link href="/" className="flex items-end gap-1" onClick={handleLinkClick}>
            <Image
              src="/icon-web.png"
              alt="QuitMate Logo"
              width={20}
              height={20}
              className="h-6 w-auto"
            />
            <span className="font-bold leading-tight">QuitMate</span>
          </Link>
        </div>
      )}

      {/* メインナビゲーション - コンテナにパディングを追加 */}
      <div className="mb-6 space-y-1 pr-2">
        <SidebarIcon
          icon={Home}
          label="ホーム"
          href="/"
          active={pathname === '/'}
          showLabel={!compact}
          onClick={handleLinkClick}
        />
        <SidebarIcon
          icon={BookOpen}
          label="記事"
          href="/articles"
          active={pathname === '/articles'}
          showLabel={!compact}
          onClick={handleLinkClick}
        />
      </div>

      {/* 区切り線 */}
      <div className="my-4 border-b border-border" />

      {/* 習慣カテゴリー - コンテナにパディングを追加 */}
      <div className="space-y-1 overflow-y-auto pr-2">
        {!compact && (
          <h3 className="mb-2 px-4 text-sm font-medium text-muted-foreground">習慣カテゴリー</h3>
        )}
        {habitCategories.map((category) => {
          const href = `/stories/habits/${category.toLowerCase().replace(/\s+/g, '-')}`;
          const Icon = CATEGORY_ICONS[category];
          const displayName = CATEGORY_DISPLAY_NAMES[category];

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

      {/* テーマスイッチャー（サイドバー下部に追加） */}
      <div className="mt-auto px-4 py-3">
        <ThemeSwitcher />
      </div>
    </div>
  );
}

export function Sidebar() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      {/* 大画面用：フルサイドバー（アイコン＋テキスト） */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border pt-4 lg:block">
        <SidebarContent habitCategories={HABIT_CATEGORIES} />
      </aside>

      {/* 中画面用：コンパクトサイドバー（アイコンのみ） */}
      <aside className="sticky top-0 hidden h-screen w-16 shrink-0 border-r border-border pt-4 md:block lg:hidden">
        <SidebarContent habitCategories={HABIT_CATEGORIES} compact />
      </aside>

      {/* モバイル用：ハンバーガーメニュー */}
      <div className="fixed left-4 top-[7px] z-50 md:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="rounded-full shadow-md">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 sm:max-w-xs">
            <SheetHeader className="pb-2">
              <SheetTitle className="sr-only">ナビゲーションメニュー</SheetTitle>
              <Link
                href="/"
                className="flex items-end gap-1"
                onClick={() => {
                  setSheetOpen(false);
                }}
              >
                <Image
                  src="/icon-web.png"
                  alt="QuitMate Logo"
                  width={20}
                  height={20}
                  className="h-6 w-auto"
                />
                <span className="font-bold leading-tight">QuitMate</span>
              </Link>
            </SheetHeader>
            <div className="pt-4">
              <SidebarContent
                habitCategories={HABIT_CATEGORIES}
                onLinkClick={() => {
                  setSheetOpen(false);
                }}
                skipLogo
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

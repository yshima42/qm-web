'use client';

import {
  Home,
  BookOpen,
  Coffee,
  ShoppingBag,
  Cigarette,
  Gamepad2,
  Wine,
  PiggyBank,
  Pill,
  Utensils,
  Heart,
  MessageSquare,
  Sparkles,
  Users,
  BadgeCheck,
  LucideIcon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

import { HabitCategoryName } from '@/lib/types';

import { CategoryIcon } from './ui/category-icon';
import { SidebarIcon } from './ui/sidebar-icon';

type SidebarContentProps = {
  habitCategories: HabitCategoryName[];
  compact?: boolean;
  onLinkClick?: () => void; // リンククリック時の追加処理
};

export function SidebarContent({
  habitCategories,
  compact = false,
  onLinkClick,
}: SidebarContentProps) {
  const pathname = usePathname();

  // カテゴリーごとのアイコンをマッピング
  const categoryIcons: Record<HabitCategoryName, LucideIcon> = {
    Game: Gamepad2,
    Tobacco: Cigarette,
    Shopping: ShoppingBag,
    Drugs: Pill,
    Overeating: Utensils,
    Porno: Heart,
    SNS: MessageSquare,
    Gambling: PiggyBank,
    Caffeine: Coffee,
    'Cosmetic Surgery': Sparkles,
    Custom: Sparkles,
    Alcohol: Wine,
    Codependency: Users,
    Official: BadgeCheck,
  };

  // リンククリック時に追加処理を行うラッパー関数
  const handleLinkClick = () => {
    if (onLinkClick) onLinkClick();
  };

  return (
    <div className="flex h-full flex-col">
      {/* メインナビゲーション */}
      <div className="mb-6 space-y-1">
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
          label="記事一覧"
          href="/articles"
          active={pathname === '/articles'}
          showLabel={!compact}
          onClick={handleLinkClick}
        />
      </div>

      {/* 区切り線 */}
      <div className="my-4 border-b border-border" />

      {/* 習慣カテゴリー */}
      <div className="space-y-1 overflow-y-auto">
        {!compact && (
          <h3 className="mb-2 px-4 text-sm font-medium text-muted-foreground">習慣カテゴリー</h3>
        )}
        {habitCategories.map((category) => {
          const href = `/stories/habits/${category.toLowerCase().replace(/\s+/g, '-')}`;
          const Icon = categoryIcons[category];

          return (
            <CategoryIcon
              key={category}
              icon={Icon}
              label={category}
              href={href}
              active={pathname === href}
              showLabel={!compact}
              onClick={handleLinkClick}
            />
          );
        })}
      </div>
    </div>
  );
}

export function Sidebar({ habitCategories }: { habitCategories: HabitCategoryName[] }) {
  return (
    <>
      {/* 大画面用：フルサイドバー（アイコン＋テキスト） */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 pt-4 lg:block">
        <SidebarContent habitCategories={habitCategories} />
      </aside>

      {/* 中画面用：コンパクトサイドバー（アイコンのみ） */}
      <aside className="sticky top-0 hidden h-screen w-16 shrink-0 pt-4 md:block lg:hidden">
        <SidebarContent habitCategories={habitCategories} compact />
      </aside>
    </>
  );
}

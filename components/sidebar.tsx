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

type SidebarProps = {
  habitCategories: HabitCategoryName[];
};

export function Sidebar({ habitCategories }: SidebarProps) {
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

  return (
    <aside className="sticky top-0 h-screen w-64 shrink-0 pt-4">
      <div className="flex h-full flex-col">
        {/* メインナビゲーション */}
        <div className="mb-6 space-y-1">
          <SidebarIcon icon={Home} label="ホーム" href="/" active={pathname === '/'} />
          <SidebarIcon
            icon={BookOpen}
            label="記事一覧"
            href="/articles"
            active={pathname === '/articles'}
          />
        </div>

        {/* 区切り線 */}
        <div className="my-4 border-b border-border" />

        {/* 習慣カテゴリー */}
        <div className="space-y-1 overflow-y-auto">
          <h3 className="mb-2 px-4 text-sm font-medium text-muted-foreground">習慣カテゴリー</h3>
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
              />
            );
          })}
        </div>
      </div>
    </aside>
  );
}

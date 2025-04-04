import {
  Gamepad2,
  Cigarette,
  ShoppingBag,
  Pill,
  Utensils,
  Wine,
  MessageSquare,
  Users,
  BadgeCheck,
  Dice5,
  Zap,
  UserRound,
  Wrench,
  Ban,
  LucideIcon,
} from 'lucide-react';

import { HabitCategoryName } from '@/lib/types';

// 習慣カテゴリーの一覧
export const HABIT_CATEGORIES: HabitCategoryName[] = [
  'Alcohol',
  'Gambling',
  'Tobacco',
  'Game',
  'SNS',
  'Overeating',
  'Shopping',
  'Caffeine',
  'Drugs',
  'Porno',
  'Cosmetic Surgery',
  'Codependency',
  'Custom',
  'Official',
];

// カテゴリーごとのアイコンをマッピング
export const CATEGORY_ICONS: Record<HabitCategoryName, LucideIcon> = {
  Game: Gamepad2,
  Tobacco: Cigarette,
  Shopping: ShoppingBag,
  Drugs: Pill,
  Overeating: Utensils,
  Porno: Ban,
  SNS: MessageSquare,
  Gambling: Dice5,
  Caffeine: Zap,
  'Cosmetic Surgery': UserRound,
  Custom: Wrench,
  Alcohol: Wine,
  Codependency: Users,
  Official: BadgeCheck,
};

// カテゴリーの日本語表示名（必要に応じて）
export const CATEGORY_DISPLAY_NAMES: Record<HabitCategoryName, string> = {
  Game: 'ゲーム',
  Tobacco: 'たばこ',
  Shopping: '買い物',
  Drugs: '薬物',
  Overeating: '過食',
  Porno: 'ポルノ',
  SNS: 'SNS',
  Gambling: 'ギャンブル',
  Caffeine: 'カフェイン',
  'Cosmetic Surgery': '美容整形',
  Custom: 'カスタム',
  Alcohol: 'アルコール',
  Codependency: '共依存',
  Official: '運営',
};

// カテゴリーのURL生成関数
export function getCategoryUrl(category: HabitCategoryName): string {
  return `/stories/habits/${category.toLowerCase().replace(/\s+/g, '-')}`;
}

/**
 * 習慣カテゴリー名を表示用の名前に変換する
 * カスタムカテゴリーの場合はカスタム習慣名を返す
 */
export function getCategoryDisplayName(
  categoryName: string,
  customHabitName?: string | null,
): string {
  // カスタムカテゴリーでカスタム習慣名がある場合はカスタム習慣名を返す
  if (categoryName.toLowerCase() === 'custom' && customHabitName) {
    return customHabitName;
  }

  // それ以外の場合は定義済みの日本語名または元のカテゴリー名を返す
  return CATEGORY_DISPLAY_NAMES[categoryName as HabitCategoryName] || categoryName;
}

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
  'Game',
  'Tobacco',
  'Shopping',
  'Drugs',
  'Overeating',
  'Porno',
  'SNS',
  'Gambling',
  'Caffeine',
  'Cosmetic Surgery',
  'Custom',
  'Alcohol',
  'Codependency',
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
  Tobacco: 'タバコ',
  Shopping: 'ショッピング',
  Drugs: '薬物',
  Overeating: '過食',
  Porno: 'アダルト',
  SNS: 'SNS',
  Gambling: 'ギャンブル',
  Caffeine: 'カフェイン',
  'Cosmetic Surgery': '美容整形',
  Custom: 'カスタム',
  Alcohol: 'アルコール',
  Codependency: '共依存',
  Official: '公式',
};

// カテゴリーのURL生成関数
export function getCategoryUrl(category: HabitCategoryName): string {
  return `/stories/habits/${category.toLowerCase().replace(/\s+/g, '-')}`;
}

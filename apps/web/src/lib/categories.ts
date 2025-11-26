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
} from "lucide-react";

import { HabitCategoryName } from "@/lib/types";

// 習慣カテゴリーの一覧
export const HABIT_CATEGORIES: HabitCategoryName[] = [
  "Alcohol",
  "Gambling",
  "Tobacco",
  "Game",
  "SNS",
  "Overeating",
  "Shopping",
  "Caffeine",
  "Drugs",
  "Porno",
  "Cosmetic Surgery",
  "Codependency",
  "Custom",
  "Official",
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
  "Cosmetic Surgery": UserRound,
  Custom: Wrench,
  Alcohol: Wine,
  Codependency: Users,
  Official: BadgeCheck,
};

// Category display names in English
export const CATEGORY_DISPLAY_NAMES: Record<HabitCategoryName, string> = {
  Game: "Game",
  Tobacco: "Tobacco",
  Shopping: "Shopping",
  Drugs: "Drugs",
  Overeating: "Overeating",
  Porno: "Porno",
  SNS: "SNS",
  Gambling: "Gambling",
  Caffeine: "Caffeine",
  "Cosmetic Surgery": "Cosmetic Surgery",
  Custom: "Custom",
  Alcohol: "Alcohol",
  Codependency: "Codependency",
  Official: "Official",
};

// カテゴリーのURL生成関数
export function getCategoryUrl(category: HabitCategoryName): string {
  return `/stories/habits/${category.toLowerCase().replace(/\s+/g, "-")}`;
}

/**
 * Convert habit category name to display name
 * Returns custom habit name if it's a custom category
 */
export function getCategoryDisplayName(
  categoryName: string,
  customHabitName?: string | null,
): string {
  // Return custom habit name if it's a custom category
  if (categoryName.toLowerCase() === "custom" && customHabitName) {
    return customHabitName;
  }

  // Otherwise return the defined English name or the original category name
  return CATEGORY_DISPLAY_NAMES[categoryName as HabitCategoryName] || categoryName;
}

/** カテゴリ名からTailwindカラークラスを返す */
const CATEGORY_COLORS: Record<string, string> = {
  // JA
  ギャンブル: "bg-amber-600/10 text-amber-700",
  脳と心の科学: "bg-sky-600/10 text-sky-700",
  回復のヒント: "bg-primary-600/10 text-primary-600",
  // EN
  Gambling: "bg-amber-600/10 text-amber-700",
  "Brain Science": "bg-sky-600/10 text-sky-700",
  "Recovery Tips": "bg-primary-600/10 text-primary-600",
};

const DEFAULT_COLOR = "bg-gray-100 text-gray-600";

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? DEFAULT_COLOR;
}

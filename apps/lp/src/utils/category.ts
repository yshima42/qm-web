/** カテゴリ名からTailwindカラークラスを返す */
const CATEGORY_COLORS: Record<string, string> = {
  // JA
  アルコール: "bg-blue-600/10 text-blue-700",
  ギャンブル: "bg-amber-600/10 text-amber-700",
  過食: "bg-pink-400/10 text-pink-400",
  タバコ: "bg-emerald-600/10 text-emerald-700",
  ポルノ: "bg-purple-600/10 text-purple-700",
  脳と心の科学: "bg-sky-600/10 text-sky-700",
  回復のヒント: "bg-primary-600/10 text-primary-600",
  // EN
  Alcohol: "bg-blue-600/10 text-blue-700",
  Gambling: "bg-amber-600/10 text-amber-700",
  "Binge Eating": "bg-pink-400/10 text-pink-400",
  Tobacco: "bg-emerald-600/10 text-emerald-700",
  Porn: "bg-purple-600/10 text-purple-700",
  "Brain Science": "bg-sky-600/10 text-sky-700",
  "Recovery Tips": "bg-primary-600/10 text-primary-600",
};

const DEFAULT_COLOR = "bg-gray-100 text-gray-600";

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? DEFAULT_COLOR;
}

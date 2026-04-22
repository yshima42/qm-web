/** カテゴリ名からTailwindカラークラスを返す（記事カード上のバッジ用） */
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

/**
 * フィルタチップの data-[active=true] 時の塗りつぶし色
 * Tailwindに静的検出させるため、文字列リテラルで列挙する
 */
const CATEGORY_CHIP_CLASSES: Record<string, string> = {
  // JA
  アルコール:
    "data-[active=true]:bg-blue-600 data-[active=true]:border-blue-600 data-[active=true]:text-white",
  ギャンブル:
    "data-[active=true]:bg-amber-600 data-[active=true]:border-amber-600 data-[active=true]:text-white",
  過食: "data-[active=true]:bg-pink-600 data-[active=true]:border-pink-600 data-[active=true]:text-white",
  タバコ:
    "data-[active=true]:bg-emerald-600 data-[active=true]:border-emerald-600 data-[active=true]:text-white",
  ポルノ:
    "data-[active=true]:bg-purple-600 data-[active=true]:border-purple-600 data-[active=true]:text-white",
  脳と心の科学:
    "data-[active=true]:bg-sky-600 data-[active=true]:border-sky-600 data-[active=true]:text-white",
  回復のヒント:
    "data-[active=true]:bg-primary-600 data-[active=true]:border-primary-600 data-[active=true]:text-white",
  // EN
  Alcohol:
    "data-[active=true]:bg-blue-600 data-[active=true]:border-blue-600 data-[active=true]:text-white",
  Gambling:
    "data-[active=true]:bg-amber-600 data-[active=true]:border-amber-600 data-[active=true]:text-white",
  "Binge Eating":
    "data-[active=true]:bg-pink-600 data-[active=true]:border-pink-600 data-[active=true]:text-white",
  Tobacco:
    "data-[active=true]:bg-emerald-600 data-[active=true]:border-emerald-600 data-[active=true]:text-white",
  Porn: "data-[active=true]:bg-purple-600 data-[active=true]:border-purple-600 data-[active=true]:text-white",
  "Brain Science":
    "data-[active=true]:bg-sky-600 data-[active=true]:border-sky-600 data-[active=true]:text-white",
  "Recovery Tips":
    "data-[active=true]:bg-primary-600 data-[active=true]:border-primary-600 data-[active=true]:text-white",
};

const DEFAULT_CHIP_CLASSES =
  "data-[active=true]:bg-gray-900 data-[active=true]:border-gray-900 data-[active=true]:text-white";

export function getCategoryChipClasses(category: string): string {
  return CATEGORY_CHIP_CLASSES[category] ?? DEFAULT_CHIP_CLASSES;
}

/**
 * カテゴリ表示順（依存種別 → 一般トピック の順）
 * CATEGORY_CHIP_CLASSES の挿入順を正とする
 */
const CATEGORY_ORDER = Object.keys(CATEGORY_CHIP_CLASSES);

/** 既定のカテゴリ順で並び替える。未知のカテゴリは末尾に回す */
export function sortCategoriesByDefinedOrder<T extends { name: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a.name);
    const bi = CATEGORY_ORDER.indexOf(b.name);
    const ax = ai === -1 ? Number.MAX_SAFE_INTEGER : ai;
    const bx = bi === -1 ? Number.MAX_SAFE_INTEGER : bi;
    return ax - bx;
  });
}

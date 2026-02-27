/** LPの名前空間。URLパスと対応 */
export type LpNamespace = "alcohol" | "kinshu" | "porn" | "tobacco" | "";

const LP_PATH_PREFIXES: Record<Exclude<LpNamespace, "">, string> = {
  alcohol: "/challenge",
  kinshu: "/alcohol",
  porn: "/porn",
  tobacco: "/tobacco",
};

/** パスからLPの名前空間を判定 */
export function getNamespaceFromPath(pathname: string): LpNamespace {
  if (pathname.includes("/challenge")) return "alcohol";
  if (pathname.includes("/alcohol")) return "kinshu";
  if (pathname.includes("/porn")) return "porn";
  if (pathname.includes("/tobacco")) return "tobacco";
  return "";
}

/** 名前空間に対応するベースパス（例: /challenge, /alcohol, /porn） */
export function getBasePath(namespace: LpNamespace): string {
  return namespace ? LP_PATH_PREFIXES[namespace] : "";
}

/** 名前空間のサイト名（コピーライト等用） */
export const NAMESPACE_SITE_NAMES: Record<Exclude<LpNamespace, "">, string> = {
  alcohol: "禁酒チャレンジ",
  kinshu: "禁酒メイト",
  porn: "禁欲メイト",
  tobacco: "禁煙メイト",
};

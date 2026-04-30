import { getCollection } from "astro:content";
import type { Locale } from "@/i18n/config";

/**
 * 指定ロケールの全ブログ記事を日付降順で取得
 */
export async function getAllPosts(locale: Locale) {
  const collectionName = locale === "ja" ? "blog-ja" : "blog-en";
  const allPosts = await getCollection(collectionName);
  return allPosts.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
}

/**
 * 関連記事を取得: 同カテゴリを優先し、不足分は最新記事で埋める
 */
export async function getRelatedPosts(
  currentSlug: string,
  currentCategory: string | undefined,
  locale: Locale,
  limit = 4,
) {
  const all = (await getAllPosts(locale)).filter((p) => p.id.replace(/\.md$/, "") !== currentSlug);
  const sameCategory = currentCategory
    ? all.filter((p) => p.data.category === currentCategory)
    : [];
  const picked = sameCategory.slice(0, limit);
  if (picked.length < limit) {
    const pickedIds = new Set(picked.map((p) => p.id));
    for (const p of all) {
      if (picked.length >= limit) break;
      if (!pickedIds.has(p.id)) picked.push(p);
    }
  }
  return picked;
}

/**
 * Markdown内の最初の画像を抽出（カバー画像用）
 */
export function extractFirstImage(content: string): string | null {
  const imgRegex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(imgRegex);
  if (match?.[1]) {
    const src = match[1];
    if (src.startsWith("http") || src.startsWith("/")) return src;
    // "xxx.png" or "../images/xxx.png" → "/blog/images/xxx.webp"
    const filename = src.split("/").pop();
    if (filename) {
      return `/blog/images/${filename.replace(/\.png$/, ".webp")}`;
    }
  }
  return null;
}

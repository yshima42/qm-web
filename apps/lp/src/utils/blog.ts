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
 * Markdown内の最初の画像ファイル名を抽出（カバー画像用）
 */
export function extractFirstImageFilename(content: string): string | null {
  const imgRegex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(imgRegex);
  if (match?.[1]) {
    const src = match[1];
    if (src.startsWith("http")) return src;
    // "../images/xxx.png" → "xxx.png"
    const filename = src.split("/").pop();
    return filename ?? null;
  }
  return null;
}

import { getCollection } from "astro:content";

import type { Locale } from "@/i18n/config";

/* ============================================================
 *  ブック定義
 *
 *  各ブックはコンテンツディレクトリ名（slug）で識別する。
 *  例: content/learn/ja/quit-gambling-today/*.md → slug = "quit-gambling-today"
 * ============================================================ */

export type LearnCategory = "gambling" | "alcohol" | "porn" | "tobacco";

export type BookDef = {
  slug: string;
  category: LearnCategory;
  title: { ja: string; en: string };
  subtitle?: { ja: string; en: string };
  coverImage?: string;
};

export const LEARN_BOOKS: BookDef[] = [
  // ── ギャンブル ──
  {
    slug: "quit-gambling-today",
    category: "gambling",
    title: { ja: "「あと1万」が止まらない", en: '"Just One More" Won\'t Stop' },
    subtitle: {
      ja: "ギャンブル依存から抜け出すための実践ガイド",
      en: "A practical guide to breaking free from gambling addiction",
    },
    coverImage: "/learn/covers/quit-gambling-today.webp",
  },
  {
    slug: "staying-quit-gambling",
    category: "gambling",
    title: { ja: "ギャンブルより退屈が怖い", en: "Boredom Scares Me More Than Gambling" },
    subtitle: {
      ja: "やめた後の毎日をどう生きるか",
      en: "How to live each day after quitting",
    },
  },
  {
    slug: "understanding-gambling",
    category: "gambling",
    title: { ja: "勝った記憶しかない不思議", en: "I Only Remember the Wins" },
    subtitle: {
      ja: "なぜ自分がこうなったのかを知る",
      en: "Understanding why this happened to you",
    },
  },
  {
    slug: "rebuilding-from-gambling",
    category: "gambling",
    title: { ja: "借金より重い嘘の返し方", en: "Lies Heavier Than Debt" },
    subtitle: {
      ja: "家族と信頼を取り戻すために",
      en: "Rebuilding trust with the people you hurt",
    },
  },
  {
    slug: "living-without-gambling",
    category: "gambling",
    title: { ja: "賭けない朝は、静かだった", en: "Mornings Without Bets Were Quiet" },
    subtitle: {
      ja: "ギャンブルのない人生の始め方",
      en: "Starting a life without gambling",
    },
  },
];

/* ============================================================
 *  カテゴリ・パートのラベル
 * ============================================================ */

export const CATEGORY_LABELS: Record<LearnCategory, { ja: string; en: string }> = {
  gambling: { ja: "ギャンブル", en: "Gambling" },
  alcohol: { ja: "アルコール", en: "Alcohol" },
  porn: { ja: "ポルノ", en: "Pornography" },
  tobacco: { ja: "たばこ", en: "Tobacco" },
};

export const PART_LABELS: Partial<Record<string, { ja: string; en: string }>> = {
  A: { ja: "自分の状態を知る", en: "Know your state" },
  B: { ja: "いま、動き出す", en: "Act now" },
  C: { ja: "引き金とスキル", en: "Triggers and skills" },
  D: { ja: "現実に向き合う", en: "Face reality" },
  E: { ja: "立て直しを始める", en: "Start rebuilding" },
};

/* ============================================================
 *  章データの型定義
 * ============================================================ */

export type LearnChapterData = {
  category: string;
  part: string;
  chapter: number;
  title: string;
  required: boolean;
  excerpt: string;
  updatedAt?: string;
};

export type LearnChapter = {
  id: string;
  body?: string;
  collection: string;
  data: LearnChapterData;
};

/* ============================================================
 *  ID からブック slug / チャプター slug を抽出
 *
 *  entry.id の形式: "quit-gambling-today/not-willpower.md"
 *  → bookSlug = "quit-gambling-today"
 *  → chapterSlug = "not-willpower"
 * ============================================================ */

export function parseEntryId(id: string): { bookSlug: string; chapterSlug: string } {
  const parts = id.replace(/\.md$/, "").split("/");
  return {
    bookSlug: parts.length > 1 ? parts[0] : "",
    chapterSlug: parts.length > 1 ? parts[1] : parts[0],
  };
}

export function entryBookSlug(entry: LearnChapter): string {
  return parseEntryId(entry.id).bookSlug;
}

export function entryChapterSlug(entry: LearnChapter): string {
  return parseEntryId(entry.id).chapterSlug;
}

/* ============================================================
 *  ブック取得
 * ============================================================ */

export function getBookBySlug(slug: string): BookDef | undefined {
  return LEARN_BOOKS.find((b) => b.slug === slug);
}

export function getBookTitle(book: BookDef, locale: Locale): string {
  return book.title[locale];
}

export function getBookSubtitle(book: BookDef, locale: Locale): string | undefined {
  return book.subtitle?.[locale];
}

export function getBooksByCategory(category: LearnCategory): BookDef[] {
  return LEARN_BOOKS.filter((b) => b.category === category);
}

export function getCategoryLabel(category: LearnCategory, locale: Locale): string {
  return CATEGORY_LABELS[category]?.[locale] ?? category;
}

/* ============================================================
 *  章の取得
 * ============================================================ */

export async function getAllLearnPosts(locale: Locale): Promise<LearnChapter[]> {
  const collectionName = `learn-${locale}`;
  const raw = await getCollection(collectionName as never);
  const all = raw as unknown as LearnChapter[];
  return [...all].sort((a, b) => a.data.chapter - b.data.chapter);
}

export async function getBookChapters(locale: Locale, bookSlug: string): Promise<LearnChapter[]> {
  const all = await getAllLearnPosts(locale);
  return all
    .filter((ch) => entryBookSlug(ch) === bookSlug)
    .sort((a, b) => a.data.chapter - b.data.chapter);
}

export async function getChapterNav(
  locale: Locale,
  bookSlug: string,
  currentSlug: string,
): Promise<{ prev: LearnChapter | null; next: LearnChapter | null }> {
  const chapters = await getBookChapters(locale, bookSlug);
  const idx = chapters.findIndex((e) => entryChapterSlug(e) === currentSlug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? chapters[idx - 1] : null,
    next: idx < chapters.length - 1 ? chapters[idx + 1] : null,
  };
}

/* ============================================================
 *  グルーピング（Part 単位）
 * ============================================================ */

export type GroupedByPart = {
  code: string;
  chapters: LearnChapter[];
}[];

export function groupByPart(chapters: LearnChapter[]): GroupedByPart {
  const partMap = new Map<string, LearnChapter[]>();
  for (const ch of chapters) {
    const list = partMap.get(ch.data.part) ?? [];
    list.push(ch);
    partMap.set(ch.data.part, list);
  }
  return Array.from(partMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([code, chs]) => ({
      code,
      chapters: [...chs].sort((a, b) => a.data.chapter - b.data.chapter),
    }));
}

/* ============================================================
 *  URL ヘルパー
 * ============================================================ */

export function bookUrl(locale: Locale, bookSlug: string): string {
  return `/${locale}/learn/${bookSlug}/`;
}

export function chapterUrl(locale: Locale, bookSlug: string, entry: LearnChapter): string {
  return `/${locale}/learn/${bookSlug}/${entryChapterSlug(entry)}/`;
}

/* ============================================================
 *  ラベル取得
 * ============================================================ */

export function getPartLabel(part: string, locale: Locale): string {
  const label = PART_LABELS[part];
  return label ? label[locale] : `Part ${part}`;
}

import { getCollection } from "astro:content";

import type { Locale } from "@/i18n/config";

/**
 * 教科書（learn）系の collection 名は `learn-{category}-{locale}` の形
 */
export const LEARN_CATEGORIES = ["gambling"] as const;
export type LearnCategory = (typeof LEARN_CATEGORIES)[number];

/**
 * 全 Phase の番号（教科書全体の構成）
 *
 * Phase 1 のみ執筆完了。Phase 2-5 は執筆中で UI 上は「準備中」として表示する
 */
export const ALL_PHASES = [1, 2, 3, 4, 5] as const;
export const PUBLISHED_PHASES = [1] as const;
export const UPCOMING_PHASES = [2, 3, 4, 5] as const;

/**
 * Phase / Part の表示用ラベル定義
 *
 * `Partial<Record<...>>` にすることで、未定義キーへのアクセスが
 * `undefined` を返すことを型で表現する
 */
export const PHASE_LABELS: Partial<Record<number, { ja: string; en: string }>> = {
  1: { ja: "全体像と緊急対処", en: "Big picture & emergency response" },
  2: { ja: "基礎を固める", en: "Build the foundation" },
  3: { ja: "深める", en: "Go deeper" },
  4: { ja: "つながる", en: "Reconnect" },
  5: { ja: "生きる", en: "Live" },
};

export const PART_LABELS: Partial<Record<string, { ja: string; en: string }>> = {
  "1A": { ja: "自分の状態を知る", en: "Know your state" },
  "1B": { ja: "いま、動き出す", en: "Act now" },
  "1C": { ja: "引き金とスキル", en: "Triggers and skills" },
  "1D": { ja: "現実に向き合う", en: "Face reality" },
  "1E": { ja: "立て直しを始める", en: "Start rebuilding" },
};

/**
 * frontmatter スキーマに対応するデータ型
 *
 * `content.config.ts` の learnSchema と手動で同期する。
 * `getCollection` の動的 name 引数は TypeScript の型推論が効かないので、
 * このユーティリティ層で明示的な型を持たせる
 */
export type LearnChapterData = {
  phase: number;
  part: string;
  chapter: number;
  title: string;
  required: boolean;
  excerpt: string;
  updatedAt?: string;
};

/**
 * 章エントリの構造的型
 *
 * 実体は Astro の `CollectionEntry` だが、`getCollection` への動的 name は
 * 型推論が効かないので、構造的に互換な型を定義してキャストで橋渡しする。
 * `astro:content` の `render(entry)` には実行時の本物の entry なので
 * そのまま渡せる。
 */
export type LearnChapter = {
  id: string;
  slug?: string;
  body?: string;
  collection: string;
  data: LearnChapterData;
};

/**
 * 指定 category × locale の全章を phase + chapter 順で取得
 */
export async function getAllChapters(
  category: LearnCategory,
  locale: Locale,
): Promise<LearnChapter[]> {
  const collectionName = `learn-${category}-${locale}`;
  // 動的な collection name は型推論できないため unknown 経由でキャスト
  const raw = await getCollection(collectionName as never);
  const all = raw as unknown as LearnChapter[];
  return [...all].sort((a, b) => {
    if (a.data.phase !== b.data.phase) return a.data.phase - b.data.phase;
    return a.data.chapter - b.data.chapter;
  });
}

/**
 * slug から単一章を取得
 */
export async function getChapterBySlug(
  category: LearnCategory,
  locale: Locale,
  slug: string,
): Promise<LearnChapter | undefined> {
  const all = await getAllChapters(category, locale);
  return all.find((entry) => chapterSlug(entry) === slug);
}

/**
 * 現在の章の前後の章を返す
 */
export async function getChapterNav(
  category: LearnCategory,
  locale: Locale,
  currentSlug: string,
): Promise<{ prev: LearnChapter | null; next: LearnChapter | null }> {
  const all = await getAllChapters(category, locale);
  const idx = all.findIndex((entry) => chapterSlug(entry) === currentSlug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}

/**
 * 章を Phase > Part の階層構造にグルーピング
 *
 * サイドバー目次や category top の Phase 一覧で使う
 */
export type GroupedChapters = {
  phase: number;
  parts: {
    code: string;
    chapters: LearnChapter[];
  }[];
}[];

export function groupByPhasePart(chapters: LearnChapter[]): GroupedChapters {
  const phaseMap = new Map<number, Map<string, LearnChapter[]>>();
  for (const ch of chapters) {
    let partMap = phaseMap.get(ch.data.phase);
    if (!partMap) {
      partMap = new Map();
      phaseMap.set(ch.data.phase, partMap);
    }
    const list = partMap.get(ch.data.part) ?? [];
    list.push(ch);
    partMap.set(ch.data.part, list);
  }
  return Array.from(phaseMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([phase, partMap]) => ({
      phase,
      parts: Array.from(partMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([code, chs]) => ({
          code,
          chapters: [...chs].sort((a, b) => a.data.chapter - b.data.chapter),
        })),
    }));
}

/**
 * 章 entry から URL slug（拡張子なし）を取得
 */
export function chapterSlug(entry: LearnChapter): string {
  return entry.id.replace(/\.md$/, "");
}

/**
 * 章 entry から URL を生成
 */
export function chapterUrl(category: LearnCategory, locale: Locale, entry: LearnChapter): string {
  return `/${locale}/learn/${category}/${chapterSlug(entry)}`;
}

/**
 * Phase ラベルの取得
 */
export function getPhaseLabel(phase: number, locale: Locale): string {
  const label = PHASE_LABELS[phase];
  return label ? label[locale] : `Phase ${String(phase)}`;
}

/**
 * Part ラベルの取得
 */
export function getPartLabel(part: string, locale: Locale): string {
  const label = PART_LABELS[part];
  return label ? label[locale] : `Part ${part}`;
}

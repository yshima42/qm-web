import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blogSchema = z.object({
  title: z.string(),
  date: z.coerce.string(),
  updatedAt: z.coerce.string().optional(),
  excerpt: z.string(),
  category: z.string().optional(),
});

const docSchema = z.object({
  title: z.string(),
});

// 教科書（recovery study）スキーマ
// Phase > Part > Chapter の階層を frontmatter で表現する
// ファイル名・URL slug は章番号を含めない（並び替えでもリンクが壊れないように）
const learnSchema = z.object({
  phase: z.number().int().min(1).max(5),
  part: z.string(), // "1A", "1B", "2A" など
  chapter: z.number().int().min(1), // category 内の通し番号
  title: z.string(),
  required: z.boolean().default(false), // 必読フラグ
  excerpt: z.string(), // 検索・OG・listing 用
  updatedAt: z.coerce.string().optional(),
});

const blogEn = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/blog/en" }),
  schema: blogSchema,
});

const blogJa = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/blog/ja" }),
  schema: blogSchema,
});

// 法的ドキュメント（namespace × locale ごと）
const docNamespaces = ["default", "alcohol", "kinshu", "porn", "tobacco"] as const;
const docLocales = ["en", "ja"] as const;

const docCollections = Object.fromEntries(
  docNamespaces.flatMap((ns) =>
    docLocales.map((locale) => [
      `docs-${ns}-${locale}`,
      defineCollection({
        loader: glob({ pattern: "*.md", base: `./src/content/documents/${ns}/${locale}` }),
        schema: docSchema,
      }),
    ]),
  ),
);

// 教科書 collection（category × locale ごと）
// 初期は gambling のみ。alcohol/porn/tobacco は執筆完了次第追加。
const learnCategories = ["gambling"] as const;
const learnLocales = ["en", "ja"] as const;

const learnCollections = Object.fromEntries(
  learnCategories.flatMap((cat) =>
    learnLocales.map((locale) => [
      `learn-${cat}-${locale}`,
      defineCollection({
        loader: glob({ pattern: "*.md", base: `./src/content/learn/${cat}/${locale}` }),
        schema: learnSchema,
      }),
    ]),
  ),
);

export const collections = {
  "blog-en": blogEn,
  "blog-ja": blogJa,
  ...docCollections,
  ...learnCollections,
};

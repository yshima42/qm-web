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

// 教科書（learn）スキーマ
// ディレクトリ名が本の slug を決定する（例: learn/ja/quit-gambling-today/ch.md）
// category はカテゴリ分類用（gambling, alcohol 等）
const learnSchema = z.object({
  category: z.string(),
  part: z.string(),
  chapter: z.number().int().min(1),
  title: z.string(),
  required: z.boolean().default(false),
  excerpt: z.string(),
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

// 教科書 collection（locale ごと。サブディレクトリ = 本の slug）
const learnJa = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/learn/ja" }),
  schema: learnSchema,
});

const learnEn = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/learn/en" }),
  schema: learnSchema,
});

export const collections = {
  "blog-en": blogEn,
  "blog-ja": blogJa,
  ...docCollections,
  "learn-ja": learnJa,
  "learn-en": learnEn,
};

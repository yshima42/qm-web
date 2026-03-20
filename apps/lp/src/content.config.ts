import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blogSchema = z.object({
  title: z.string(),
  date: z.coerce.string(),
  excerpt: z.string(),
  author: z.string().optional().default("QuitMate"),
});

const docSchema = z.object({
  title: z.string(),
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

export const collections = {
  "blog-en": blogEn,
  "blog-ja": blogJa,
  ...docCollections,
};

import fs from "fs";
import path from "path";

import matter from "gray-matter";

// blogディレクトリのパスを変更
const blogDirectory = path.join(process.cwd(), "public", "blog");

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  author?: string;
};

/**
 * 指定された言語のすべての記事を取得する
 */
export function getAllPosts(locale: string): BlogPost[] {
  const localeDir = path.join(blogDirectory, locale);

  // 言語ディレクトリが存在しない場合は空配列を返す
  if (!fs.existsSync(localeDir)) {
    return [];
  }

  const fileNames = fs.readdirSync(localeDir);

  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith(".mdx") || fileName.endsWith(".md"))
    .map((fileName) => {
      // ファイル名からスラッグを取得
      const slug = fileName.replace(/\.mdx?$/, "");

      // マークダウンファイルを読み込む
      const fullPath = path.join(localeDir, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // メタデータと内容を解析
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title ?? "",
        date: data.date ?? "",
        excerpt: data.excerpt ?? "",
        content,
        author: data.author ?? "",
      };
    });

  // 日付で降順ソート
  return allPosts.sort((a, b) => {
    const dateA = a.date ? new Date(a.date as string).getTime() : 0;
    const dateB = b.date ? new Date(b.date as string).getTime() : 0;
    return dateB - dateA;
  });
}

/**
 * 指定された言語の特定の記事を取得する
 */
export function getPostBySlug(slug: string, locale: string): BlogPost | null {
  const localeDir = path.join(blogDirectory, locale);

  // 言語ディレクトリが存在しない場合はnullを返す
  if (!fs.existsSync(localeDir)) {
    return null;
  }

  // .mdと.mdxの両方を試す
  let fullPath = path.join(localeDir, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(localeDir, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
  }

  try {
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title ?? "",
      date: data.date ?? "",
      excerpt: data.excerpt ?? "",
      content,
      author: data.author ?? "",
    };
  } catch {
    return null;
  }
}

/**
 * 指定された言語のすべての記事のスラッグを取得する
 */
export function getAllPostSlugs(locale: string): string[] {
  const localeDir = path.join(blogDirectory, locale);

  // 言語ディレクトリが存在しない場合は空配列を返す
  if (!fs.existsSync(localeDir)) {
    return [];
  }

  const fileNames = fs.readdirSync(localeDir);

  return fileNames
    .filter((fileName) => fileName.endsWith(".mdx") || fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.mdx?$/, ""));
}

/**
 * 記事が他の言語でも存在するかチェック
 */
export function getAlternateLanguageVersions(
  slug: string,
): Record<string, boolean> {
  const languages = ["en", "ja"];
  const result: Record<string, boolean> = {};

  for (const lang of languages) {
    const localeDir = path.join(blogDirectory, lang);

    if (!fs.existsSync(localeDir)) {
      result[lang] = false;
      continue;
    }

    const mdxExists = fs.existsSync(path.join(localeDir, `${slug}.mdx`));
    const mdExists = fs.existsSync(path.join(localeDir, `${slug}.md`));

    result[lang] = mdxExists || mdExists;
  }

  return result;
}

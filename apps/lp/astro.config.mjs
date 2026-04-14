import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import remarkCjkFriendly from "remark-cjk-friendly";
import fs from "node:fs";
import path from "node:path";

import rehypeCollapsibleReferences from "./scripts/rehype-collapsible-references.mjs";

// ブログ記事の最終更新日マップを構築（サイトマップ lastmod 用）
function getBlogDateMap() {
  const map = new Map();
  for (const locale of ["ja", "en"]) {
    const dir = `./src/content/blog/${locale}`;
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".md")) continue;
      const content = fs.readFileSync(path.join(dir, file), "utf-8");
      const fm = content.match(/^---\n([\s\S]*?)\n---/);
      if (!fm) continue;
      const updatedAt = fm[1].match(/updatedAt:\s*"?(\d{4}-\d{2}-\d{2})"?/);
      const date = fm[1].match(/date:\s*"?(\d{4}-\d{2}-\d{2})"?/);
      const lastmod = updatedAt?.[1] || date?.[1];
      if (lastmod) {
        const slug = file.replace(/\.md$/, "");
        map.set(`/${locale}/blog/${slug}/`, lastmod);
      }
    }
  }
  return map;
}

// 教科書（learn）章の最終更新日マップを構築
// パターン: /{locale}/learn/{category}/{slug}/
function getLearnDateMap() {
  const map = new Map();
  const learnRoot = "./src/content/learn";
  if (!fs.existsSync(learnRoot)) return map;

  for (const category of fs.readdirSync(learnRoot)) {
    const categoryDir = path.join(learnRoot, category);
    if (!fs.statSync(categoryDir).isDirectory()) continue;

    for (const locale of ["ja", "en"]) {
      const localeDir = path.join(categoryDir, locale);
      if (!fs.existsSync(localeDir)) continue;

      for (const file of fs.readdirSync(localeDir)) {
        if (!file.endsWith(".md")) continue;
        const content = fs.readFileSync(path.join(localeDir, file), "utf-8");
        const fm = content.match(/^---\n([\s\S]*?)\n---/);
        if (!fm) continue;
        const updatedAt = fm[1].match(/updatedAt:\s*"?(\d{4}-\d{2}-\d{2})"?/);
        if (updatedAt) {
          const slug = file.replace(/\.md$/, "");
          map.set(`/${locale}/learn/${category}/${slug}/`, updatedAt[1]);
        }
      }
    }
  }
  return map;
}

const blogDateMap = getBlogDateMap();
const learnDateMap = getLearnDateMap();

export default defineConfig({
  site: "https://about.quitmate.app",
  output: "static",
  trailingSlash: "always",
  integrations: [
    sitemap({
      filter(page) {
        const url = new URL(page);
        const p = url.pathname;
        // ロケール付きページのみ
        if (!/^\/(en|ja)\//.test(p)) return false;
        // カテゴリ別 document ページは除外（default版のみ残す）
        // 例: /en/alcohol/terms/ → 除外, /en/terms/ → 残す
        const categories = ["alcohol", "tobacco", "porn", "challenge"];
        const docs = ["terms", "privacy", "contact"];
        for (const cat of categories) {
          for (const doc of docs) {
            if (p.includes(`/${cat}/${doc}`)) return false;
          }
        }
        return true;
      },
      serialize(item) {
        const url = new URL(item.url);
        const lastmod = blogDateMap.get(url.pathname) ?? learnDateMap.get(url.pathname);
        if (lastmod) {
          item.lastmod = new Date(lastmod);
        }
        return item;
      },
    }),
  ],
  markdown: {
    remarkPlugins: [remarkCjkFriendly],
    rehypePlugins: [rehypeCollapsibleReferences],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ja"],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
});

import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import remarkCjkFriendly from "remark-cjk-friendly";
import fs from "node:fs";
import path from "node:path";

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

const blogDateMap = getBlogDateMap();

export default defineConfig({
  site: "https://about.quitmate.app",
  output: "static",
  integrations: [
    sitemap({
      serialize(item) {
        const url = new URL(item.url);
        const lastmod = blogDateMap.get(url.pathname);
        if (lastmod) {
          item.lastmod = new Date(lastmod);
        }
        return item;
      },
    }),
  ],
  markdown: {
    remarkPlugins: [remarkCjkFriendly],
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

import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import remarkCjkFriendly from "remark-cjk-friendly";

export default defineConfig({
  site: "https://about.quitmate.app",
  output: "static",
  integrations: [sitemap()],
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

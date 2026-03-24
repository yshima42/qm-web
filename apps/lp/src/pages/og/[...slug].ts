import { OGImageRoute } from "astro-og-canvas";
import { getCollection } from "astro:content";

const blogJa = await getCollection("blog-ja");
const blogEn = await getCollection("blog-en");

const pages = Object.fromEntries([
  ...blogJa.map((post) => [`ja/blog/${post.id.replace(/\.md$/, "")}`, post.data]),
  ...blogEn.map((post) => [`en/blog/${post.id.replace(/\.md$/, "")}`, post.data]),
]);

export const { getStaticPaths, GET } = await OGImageRoute({
  param: "slug",
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.excerpt,
    logo: {
      path: "./src/assets/images/icon-web.png",
      size: [60],
    },
    bgGradient: [
      [46, 108, 40],
      [30, 64, 24],
    ],
    font: {
      title: {
        families: ["Noto Sans JP"],
        weight: "Bold",
        size: 52,
        lineHeight: 1.4,
        color: [255, 255, 255],
      },
      description: {
        families: ["Noto Sans JP"],
        size: 24,
        lineHeight: 1.5,
        color: [210, 236, 213],
      },
    },
    fonts: [
      "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-jp@latest/japanese-700-normal.ttf",
      "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-jp@latest/japanese-400-normal.ttf",
    ],
    padding: 60,
    border: {
      color: [137, 194, 131],
      width: 12,
      side: "inline-start",
    },
  }),
});

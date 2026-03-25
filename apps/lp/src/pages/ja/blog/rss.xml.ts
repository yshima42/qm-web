import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getAllPosts } from "@/utils/blog";

export async function GET(context: APIContext) {
  const posts = await getAllPosts("ja");
  return rss({
    title: "QuitMate Journal",
    description: "QuitMateの公式ブログ。依存症回復に関する情報や最新ニュースを発信しています。",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.excerpt,
      link: `/ja/blog/${post.id.replace(/\.md$/, "")}/`,
      categories: post.data.category ? [post.data.category] : undefined,
    })),
    customData: `<language>ja</language>`,
  });
}

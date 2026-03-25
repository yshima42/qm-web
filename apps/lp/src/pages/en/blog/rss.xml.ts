import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getAllPosts } from "@/utils/blog";

export async function GET(context: APIContext) {
  const posts = await getAllPosts("en");
  return rss({
    title: "QuitMate Journal",
    description:
      "QuitMate official blog. Find information and the latest news about addiction recovery.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.excerpt,
      link: `/en/blog/${post.id.replace(/\.md$/, "")}/`,
      categories: post.data.category ? [post.data.category] : undefined,
    })),
    customData: `<language>en</language>`,
  });
}

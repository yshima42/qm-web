import type { MetadataRoute } from "next";

// 1日ごとに再生成（sitemap.ts と同じ）
export const revalidate = 86400;

export default function robots(): MetadataRoute.Robots {
  const url = process.env.NEXT_PUBLIC_URL;

  // sitemap.ts と挙動を揃える: Vercel 環境では env 必須、それ以外では最小の robots を返す
  if (!url) {
    if (process.env.VERCEL) {
      throw new Error("NEXT_PUBLIC_URL is not set");
    }
    return {
      rules: [{ userAgent: "*", allow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // 認証/個人設定/投稿フォーム等クローラに見せる必要のないパスを除外
        disallow: ["/auth/", "/settings/", "/stories/create", "/habits/register"],
      },
    ],
    sitemap: `${url}/sitemap.xml`,
  };
}

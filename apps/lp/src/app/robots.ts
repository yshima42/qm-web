import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host: "https://about.quitmate.app",
    sitemap: "https://about.quitmate.app/sitemap.xml",
  };
}

import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";
import path from "node:path";

const blogJa = await getCollection("blog-ja");
const blogEn = await getCollection("blog-en");

const pages = Object.fromEntries([
  ...blogJa.map((post) => [`ja/blog/${post.id.replace(/\.md$/, "")}`, post.data]),
  ...blogEn.map((post) => [`en/blog/${post.id.replace(/\.md$/, "")}`, post.data]),
]);

// フォントをローカルファイルから読み込み
const fontBoldPath = path.resolve("./src/assets/fonts/NotoSansJP-Bold.ttf");
const fontRegularPath = path.resolve("./src/assets/fonts/NotoSansJP-Regular.ttf");
const interBoldPath = path.resolve("./src/assets/fonts/Inter-Bold.ttf");
const fontBold = fs.readFileSync(fontBoldPath);
const fontRegular = fs.readFileSync(fontRegularPath);
const interBold = fs.readFileSync(interBoldPath);

// ロゴをbase64で埋め込み
const logoPath = path.resolve("./public/images/icon-web.png");
const logoBuffer = fs.readFileSync(logoPath);
const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;

export const getStaticPaths: GetStaticPaths = () => {
  return Object.keys(pages).map((slug) => ({
    params: { slug: `${slug}.png` },
  }));
};

export const GET: APIRoute = async ({ params }) => {
  const slug = (params.slug as string).replace(/\.png$/, "");
  const page = pages[slug];

  if (!page) {
    return new Response("Not found", { status: 404 });
  }

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background: "linear-gradient(145deg, #1a5c2e 0%, #143d1c 50%, #0f2d15 100%)",
          fontFamily: "Noto Sans JP",
          position: "relative",
          overflow: "hidden",
        },
        children: [
          // 背景の装飾円
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: "-120px",
                right: "-80px",
                width: "400px",
                height: "400px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.03)",
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: "-60px",
                left: "-40px",
                width: "250px",
                height: "250px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.02)",
              },
            },
          },
          // ヘッダー: ロゴ + QuitMate
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "10px",
              },
              children: [
                {
                  type: "img",
                  props: {
                    src: logoBase64,
                    width: 64,
                    height: 64,
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: "44px",
                      fontFamily: "Inter",
                      fontWeight: 700,
                      color: "#b8e6b0",
                      letterSpacing: "0.01em",
                    },
                    children: "QuitMate",
                  },
                },
              ],
            },
          },
          // タイトル
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flex: 1,
                alignItems: "center",
              },
              children: [
                {
                  type: "h1",
                  props: {
                    style: {
                      fontSize:
                        page.title.length <= 20
                          ? "64px"
                          : page.title.length <= 35
                            ? "56px"
                            : "48px",
                      fontWeight: 700,
                      color: "#ffffff",
                      lineHeight: 1.4,
                      margin: 0,
                      letterSpacing: "0.01em",
                    },
                    children: page.title,
                  },
                },
              ],
            },
          },
          // フッター: Blog ラベル
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "18px",
                      color: "rgba(255, 255, 255, 0.5)",
                      fontWeight: 400,
                    },
                    children: "about.quitmate.app/blog",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      padding: "6px 20px",
                      borderRadius: "9999px",
                      border: "1.5px solid rgba(255, 255, 255, 0.2)",
                      fontSize: "16px",
                      color: "rgba(255, 255, 255, 0.6)",
                      fontWeight: 400,
                    },
                    children: "Blog",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: interBold, weight: 700, style: "normal" as const },
        { name: "Noto Sans JP", data: fontBold, weight: 700, style: "normal" as const },
        { name: "Noto Sans JP", data: fontRegular, weight: 400, style: "normal" as const },
      ],
    },
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  });
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};

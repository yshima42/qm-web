import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";
import path from "node:path";

import {
  LEARN_BOOKS,
  getBookChapters,
  getBookTitle,
  getBookSubtitle,
  entryChapterSlug,
} from "@/utils/learn";

const blogJa = await getCollection("blog-ja");
const blogEn = await getCollection("blog-en");

type PageData = {
  title: string;
  excerpt: string;
  category?: string;
  // learn chapter 用
  chapterNum?: number;
  bookTitle?: string;
  // learn book cover 用
  isBookCover?: boolean;
  bookSubtitle?: string;
  bookCategory?: string;
};

const pages: Record<string, PageData> = Object.fromEntries([
  ...blogJa.map((post) => [`ja/blog/${post.id.replace(/\.md$/, "")}`, post.data]),
  ...blogEn.map((post) => [`en/blog/${post.id.replace(/\.md$/, "")}`, post.data]),
]);

// learn ページを追加
for (const book of LEARN_BOOKS) {
  for (const locale of ["ja", "en"] as const) {
    // 本トップページ
    pages[`${locale}/learn/${book.slug}`] = {
      title: getBookTitle(book, locale),
      excerpt: getBookSubtitle(book, locale) ?? "",
      isBookCover: true,
      bookSubtitle: getBookSubtitle(book, locale),
      bookCategory: book.category,
    };

    // 各章ページ
    try {
      const chapters = await getBookChapters(locale, book.slug);
      for (const ch of chapters) {
        const slug = entryChapterSlug(ch);
        pages[`${locale}/learn/${book.slug}/${slug}`] = {
          title: ch.data.title,
          excerpt: ch.data.excerpt,
          chapterNum: ch.data.chapter,
          bookTitle: book.subtitle?.[locale] ?? getBookTitle(book, locale),
        };
      }
    } catch {
      // locale のディレクトリが存在しない場合はスキップ
    }
  }
}

// フォント読み込み
const notoBlackPath = path.resolve("./src/assets/fonts/NotoSansJP-ExtraBold.ttf");
const notoBoldPath = path.resolve("./src/assets/fonts/NotoSansJP-Bold.ttf");
const interBoldPath = path.resolve("./src/assets/fonts/Inter-Bold.ttf");
const notoBlack = fs.readFileSync(notoBlackPath);
const notoBold = fs.readFileSync(notoBoldPath);
const interBold = fs.readFileSync(interBoldPath);

// ロゴをbase64で埋め込み
const logoPath = path.resolve("./public/images/icon-web.png");
const logoBuffer = fs.readFileSync(logoPath);
const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;

// カテゴリーバッジの色（ブログのTailwindクラスと対応）
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  アルコール: { bg: "#dbeafe", text: "#1d4ed8" },
  Alcohol: { bg: "#dbeafe", text: "#1d4ed8" },
  ギャンブル: { bg: "#fef3c7", text: "#b45309" },
  Gambling: { bg: "#fef3c7", text: "#b45309" },
  過食: { bg: "#fce7f3", text: "#db2777" },
  "Binge Eating": { bg: "#fce7f3", text: "#db2777" },
  タバコ: { bg: "#d1fae5", text: "#047857" },
  Tobacco: { bg: "#d1fae5", text: "#047857" },
  ポルノ: { bg: "#ede9fe", text: "#7c3aed" },
  Porn: { bg: "#ede9fe", text: "#7c3aed" },
  脳と心の科学: { bg: "#e0f2fe", text: "#0369a1" },
  "Brain Science": { bg: "#e0f2fe", text: "#0369a1" },
  回復のヒント: { bg: "#dcfce7", text: "#15803d" },
  "Recovery Tips": { bg: "#dcfce7", text: "#15803d" },
};

const DEFAULT_CAT_COLOR = { bg: "#f3f4f6", text: "#4b5563" };

/** 中央付近の自然な区切り位置を探す */
function findNaturalBreak(text: string, target: number): number {
  const breakAfter = /[、。！？｜・〜】」）〕〉》』：:\-\s]/;
  const breakBefore = /[【「（〔〈《『]/;

  let bestBreak = -1;
  let minDistance = Infinity;

  const range = Math.min(8, Math.floor(text.length / 4));
  const start = Math.max(1, target - range);
  const end = Math.min(text.length - 1, target + range);

  for (let i = start; i <= end; i++) {
    const dist = Math.abs(i - target);
    if (breakAfter.test(text[i]) && dist < minDistance) {
      bestBreak = i + 1;
      minDistance = dist;
    }
    if (breakBefore.test(text[i]) && dist < minDistance) {
      bestBreak = i;
      minDistance = dist;
    }
  }
  return bestBreak;
}

/** テキストを自然な位置で分割する（長い行は再帰的にさらに分割） */
function splitText(text: string, maxPerLine: number = 15): string[] {
  if (text.length <= maxPerLine) return [text];

  // まず中央で2分割
  const breakPoint = findNaturalBreak(text, Math.floor(text.length / 2));
  if (breakPoint === -1) return [text];

  const lines = [text.substring(0, breakPoint).trim(), text.substring(breakPoint).trim()];

  // まだ長い行があればさらに分割（自然な区切りがなければ中央で強制分割）
  const result: string[] = [];
  for (const line of lines) {
    if (line.length > maxPerLine) {
      const subBreak = findNaturalBreak(line, Math.floor(line.length / 2));
      if (subBreak !== -1) {
        result.push(line.substring(0, subBreak).trim());
        result.push(line.substring(subBreak).trim());
      } else {
        const mid = Math.floor(line.length / 2);
        result.push(line.substring(0, mid));
        result.push(line.substring(mid));
      }
      continue;
    }
    result.push(line);
  }
  return result;
}

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

  const locale = slug.startsWith("en/") ? "en" : "ja";

  // ── 本表紙用デザイン ──
  if (page.isBookCover) {
    const coverTheme: Record<string, { bg: string; accent: string }> = {
      gambling: { bg: "#FFFDF5", accent: "#D97706" },
      alcohol: { bg: "#F0F9FF", accent: "#2563EB" },
      porn: { bg: "#FDF4FF", accent: "#9333EA" },
      tobacco: { bg: "#F0FDF4", accent: "#16A34A" },
    };
    const ct = coverTheme[page.bookCategory ?? "gambling"] ?? coverTheme.gambling;

    const svg = await satori(
      {
        type: "div",
        props: {
          style: {
            width: "1200px",
            height: "630px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f5f5f5",
            fontFamily: "Noto Sans JP",
          },
          children: [
            // 本の表紙カード
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  width: "420px",
                  height: "540px",
                  borderRadius: "12px",
                  background: ct.bg,
                  border: "1px solid rgba(0,0,0,0.08)",
                  overflow: "hidden",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
                },
                children: [
                  // アクセント帯
                  {
                    type: "div",
                    props: {
                      style: { height: "6px", background: ct.accent, width: "100%" },
                    },
                  },
                  // コンテンツ
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        padding: "32px 28px 28px",
                      },
                      children: [
                        // QUITMATE ラベル
                        {
                          type: "div",
                          props: {
                            style: {
                              fontSize: "14px",
                              fontWeight: 700,
                              color: ct.accent,
                              letterSpacing: "0.1em",
                              marginBottom: "16px",
                            },
                            children: "QUITMATE",
                          },
                        },
                        // タイトル
                        {
                          type: "div",
                          props: {
                            style: {
                              fontSize: "36px",
                              fontWeight: 900,
                              color: "#1a1a1a",
                              lineHeight: 1.3,
                            },
                            children: page.title,
                          },
                        },
                        // サブタイトル
                        page.bookSubtitle
                          ? {
                              type: "div",
                              props: {
                                style: {
                                  fontSize: "18px",
                                  color: "#555",
                                  marginTop: "14px",
                                  lineHeight: 1.6,
                                },
                                children: page.bookSubtitle,
                              },
                            }
                          : null,
                        // 底部アクセント
                        {
                          type: "div",
                          props: {
                            style: {
                              display: "flex",
                              gap: "6px",
                              marginTop: "auto",
                              alignItems: "center",
                            },
                            children: [
                              {
                                type: "div",
                                props: {
                                  style: {
                                    width: "32px",
                                    height: "3px",
                                    borderRadius: "2px",
                                    background: ct.accent,
                                  },
                                },
                              },
                              {
                                type: "div",
                                props: {
                                  style: {
                                    width: "12px",
                                    height: "3px",
                                    borderRadius: "2px",
                                    background: ct.accent,
                                    opacity: 0.3,
                                  },
                                },
                              },
                            ],
                          },
                        },
                      ].filter(Boolean),
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
          { name: "Noto Sans JP", data: notoBlack, weight: 900, style: "normal" as const },
          { name: "Noto Sans JP", data: notoBold, weight: 700, style: "normal" as const },
        ],
      },
    );

    const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 2400 } });
    const png = resvg.render().asPng();

    return new Response(png, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  // ── 通常デザイン（ブログ / learn章） ──
  const titleFontSize = "54px";
  const titleMaxChars = locale === "ja" ? 15 : 30;
  const titleLines = splitText(page.title, titleMaxChars);

  const subtitle = page.excerpt.length > 35 ? page.excerpt.substring(0, 35) + "..." : page.excerpt;

  const catColor = CATEGORY_COLORS[page.category ?? ""] ?? DEFAULT_CAT_COLOR;

  // 中央コンテンツ（カテゴリ + タイトル + サブタイトル）
  const centerChildren: Record<string, unknown>[] = [];

  // バッジ（ブログ: カテゴリー / learn: Chapter + 本タイトル）
  const badgeText =
    page.chapterNum != null
      ? `Chapter ${String(page.chapterNum).padStart(2, "0")}  |  ${page.bookTitle ?? ""}`
      : page.category;
  const badgeColor =
    page.chapterNum != null
      ? { bg: "#f0fdf4", text: "#166534" }
      : (CATEGORY_COLORS[page.category ?? ""] ?? DEFAULT_CAT_COLOR);

  if (badgeText) {
    centerChildren.push({
      type: "div",
      props: {
        style: {
          display: "flex",
          justifyContent: "center",
          marginBottom: "16px",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                padding: "5px 20px",
                borderRadius: "9999px",
                background: badgeColor.bg,
                fontSize: "18px",
                color: badgeColor.text,
                fontWeight: 700,
              },
              children: badgeText,
            },
          },
        ],
      },
    });
  }

  // タイトル（各行を別要素で描画して中央寄せを維持）
  centerChildren.push({
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      },
      children: titleLines.map((line: string) => ({
        type: "div",
        props: {
          style: {
            fontSize: titleFontSize,
            fontFamily: "Noto Sans JP",
            fontWeight: 900,
            color: "#2d2d2d",
            lineHeight: 1.5,
            textAlign: "center",
            letterSpacing: "0.01em",
          },
          children: line,
        },
      })),
    },
  });

  // サブタイトル（1行）
  centerChildren.push({
    type: "div",
    props: {
      style: {
        display: "flex",
        justifyContent: "center",
        width: "100%",
        marginTop: "10px",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              fontSize: "24px",
              color: "#888888",
              textAlign: "center",
            },
            children: subtitle,
          },
        },
      ],
    },
  });

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "1200px",
          height: "630px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f5faf6 0%, #e4f0e8 40%, #d5eade 70%, #c8e4da 100%)",
          fontFamily: "Noto Sans JP",
        },
        children: [
          // 白カード（枠線なし、背景グラデーションが枠の役割）
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                width: "1110px",
                height: "540px",
                borderRadius: "20px",
                background: "#ffffff",
                padding: "36px 60px",
                position: "relative",
                overflow: "hidden",
              },
              children: [
                // ウォーターマークロゴ（背景装飾）
                {
                  type: "div",
                  props: {
                    style: {
                      position: "absolute",
                      left: "-30px",
                      bottom: "-30px",
                      display: "flex",
                      transform: "rotate(-15deg)",
                      opacity: 0.055,
                    },
                    children: [
                      {
                        type: "img",
                        props: {
                          src: logoBase64,
                          width: 300,
                          height: 300,
                        },
                      },
                    ],
                  },
                },
                // 中央コンテンツ
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    },
                    children: centerChildren,
                  },
                },
                // ブランディング（中央、大きめ）
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      paddingTop: "8px",
                    },
                    children: [
                      {
                        type: "img",
                        props: {
                          src: logoBase64,
                          width: 52,
                          height: 52,
                        },
                      },
                      {
                        type: "span",
                        props: {
                          style: {
                            fontSize: "34px",
                            fontFamily: "Inter",
                            fontWeight: 700,
                            color: "#333333",
                          },
                          children: "QuitMate",
                        },
                      },
                    ],
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
        { name: "Noto Sans JP", data: notoBlack, weight: 900, style: "normal" as const },
        { name: "Noto Sans JP", data: notoBold, weight: 700, style: "normal" as const },
      ],
    },
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 2400 },
  });
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};

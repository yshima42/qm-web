import fs from "fs";
import path from "path";

import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import { APP_IDS } from "@/apps";
import { DocumentLayout } from "@/components/layout/document-layout";
import { MarkdownContent } from "@/components/sections/markdown-content";

import { routing } from "@/i18n/routing";

// SSG対応: 各アプリ×各ロケールの組み合わせを生成
export function generateStaticParams() {
  const params: { app: string; locale: string }[] = [];
  for (const app of APP_IDS) {
    for (const locale of routing.locales) {
      params.push({ app, locale });
    }
  }
  return params;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");
  const tConfig = await getTranslations("config");

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(`https://about.quitmate.app/${tConfig("language-code")}`),
  };
}

export default function ContactPage() {
  const t = useTranslations("contact");
  const config = useTranslations("config");

  // ビルド時にファイルを読み込む
  const filePath = path.join(
    process.cwd(),
    "public",
    "documents",
    config("language-code"),
    "contact.md",
  );
  const fileContent = fs.readFileSync(filePath, "utf8");

  return (
    <DocumentLayout title={t("title")}>
      <MarkdownContent content={fileContent} />
    </DocumentLayout>
  );
}

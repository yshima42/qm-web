import fs from "fs";
import path from "path";

import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import { DocumentLayout } from "@/components/layout/document-layout";
import { MarkdownContent } from "@/components/sections/markdown-content";

import { routing } from "@/i18n/routing";

// SSG対応
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// ビルド時にのみ実行される
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("terms");
  const tConfig = await getTranslations("config");

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(`https://about.quitmate.app/${tConfig("language-code")}`),
  };
}

export default function TermsPage() {
  const t = useTranslations("terms");
  const config = useTranslations("config");
  // ビルド時にファイルを読み込む
  const filePath = path.join(
    process.cwd(),
    "public",
    "documents",
    config("language-code"),
    "terms.md",
  );
  const fileContent = fs.readFileSync(filePath, "utf8");

  return (
    <DocumentLayout title={t("title")}>
      <MarkdownContent content={fileContent} />
    </DocumentLayout>
  );
}

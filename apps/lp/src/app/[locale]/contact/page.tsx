import fs from "fs";
import path from "path";

import { useTranslations } from "next-intl";

import { DocumentLayout } from "@/components/layout/document-layout";
import { MarkdownContent } from "@/components/sections/markdown-content";

import { routing } from "@/i18n/routing";

// SSG対応
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export function generateMetadata() {
  return {
    title: "お問い合わせ - QuitMate",
    description: "QuitMateへのお問い合わせはこちらから。",
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

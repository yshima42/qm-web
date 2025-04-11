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

// メタデータ生成
export function generateMetadata() {
  return {
    title: "プライバシーポリシー - QuitMate",
    description: "QuitMateのプライバシーポリシーをご確認ください。",
  };
}

export default function PrivacyPage() {
  const t = useTranslations("privacy");
  const config = useTranslations("config");
  // ビルド時にファイルを読み込む
  const filePath = path.join(
    process.cwd(),
    "public",
    "documents",
    config("language-code"),
    "privacy.md",
  );
  const fileContent = fs.readFileSync(filePath, "utf8");

  return (
    <DocumentLayout title={t("title")}>
      <MarkdownContent content={fileContent} />
    </DocumentLayout>
  );
}

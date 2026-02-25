import fs from "fs";
import path from "path";

import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import { DocumentLayout } from "@/components/layout/document-layout";
import { MarkdownContent } from "@/components/sections/markdown-content";

import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("porn.privacy");
  const tConfig = await getTranslations("config");

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(`https://about.quitmate.app/${tConfig("language-code")}/porn`),
  };
}

export default function PornPrivacyPage() {
  const t = useTranslations("porn.privacy");
  const config = useTranslations("config");
  const filePath = path.join(
    process.cwd(),
    "public",
    "documents",
    "porn",
    config("language-code"),
    "privacy.md",
  );
  const fileContent = fs.readFileSync(filePath, "utf8");

  return (
    <DocumentLayout title={t("title")} namespace="porn">
      <MarkdownContent content={fileContent} />
    </DocumentLayout>
  );
}

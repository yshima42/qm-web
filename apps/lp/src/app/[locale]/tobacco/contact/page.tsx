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
  const t = await getTranslations("tobacco.contact");
  const tConfig = await getTranslations("config");

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(`https://about.quitmate.app/${tConfig("language-code")}/tobacco`),
  };
}

export default function TobaccoContactPage() {
  const t = useTranslations("tobacco.contact");
  const config = useTranslations("config");
  const filePath = path.join(
    process.cwd(),
    "public",
    "documents",
    "tobacco",
    config("language-code"),
    "contact.md",
  );
  const fileContent = fs.readFileSync(filePath, "utf8");

  return (
    <DocumentLayout title={t("title")} namespace="tobacco">
      <MarkdownContent content={fileContent} />
    </DocumentLayout>
  );
}

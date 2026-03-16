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
  const t = await getTranslations("porn.contact");
  const tConfig = await getTranslations("config");

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(`https://about.quitmate.app/${tConfig("language-code")}/porn`),
  };
}

export default function PornContactPage() {
  const t = useTranslations("porn.contact");
  const config = useTranslations("config");
  const lang = config("language-code");
  const filePath = path.join(process.cwd(), "public", "documents", "porn", lang, "contact.md");
  let fileContent = fs.readFileSync(filePath, "utf8");

  if (lang === "ja") {
    fileContent = fileContent.replace(/禁酒チャレンジ/g, "禁欲メイト");
  } else {
    fileContent = fileContent.replace(/Alcohol-Free Week/g, "Porn-Free Mate");
  }

  return (
    <DocumentLayout title={t("title")} namespace="porn">
      <MarkdownContent content={fileContent} namespace="porn" />
    </DocumentLayout>
  );
}

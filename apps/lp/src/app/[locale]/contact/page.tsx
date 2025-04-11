import fs from "fs";
import path from "path";

import { DocumentLayout } from "@/components/layout/document-layout";
import { MarkdownContent } from "@/components/sections/markdown-content";

export function generateMetadata() {
  return {
    title: "お問い合わせ - QuitMate",
    description: "QuitMateへのお問い合わせはこちらから。",
  };
}

export default function ContactPage() {
  // ビルド時にファイルを読み込む
  const filePath = path.join(
    process.cwd(),
    "public",
    "documents",
    "contact.md",
  );
  const fileContent = fs.readFileSync(filePath, "utf8");

  return (
    <DocumentLayout title="お問い合わせ">
      <MarkdownContent content={fileContent} />
    </DocumentLayout>
  );
}

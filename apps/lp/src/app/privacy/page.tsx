import fs from "fs";
import path from "path";

import { DocumentLayout } from "@/components/layout/document-layout";
import { MarkdownContent } from "@/components/sections/markdown-content";

export function generateMetadata() {
  return {
    title: "プライバシーポリシー - QuitMate",
    description: "QuitMateのプライバシーポリシーをご確認ください。",
  };
}

export default function PrivacyPage() {
  // ビルド時にファイルを読み込む
  const filePath = path.join(
    process.cwd(),
    "public",
    "documents",
    "privacy.md",
  );
  const fileContent = fs.readFileSync(filePath, "utf8");

  return (
    <DocumentLayout title="プライバシーポリシー">
      <MarkdownContent content={fileContent} />
    </DocumentLayout>
  );
}

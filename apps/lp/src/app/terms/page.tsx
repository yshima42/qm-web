import fs from 'fs';
import path from 'path';
import { MarkdownContent } from '@/components/sections/markdown-content';
import { DocumentLayout } from '@/components/layout/document-layout';

// ビルド時にのみ実行される
export function generateMetadata() {
  return {
    title: '利用規約 - QuitMate',
    description: 'QuitMateの利用規約をご確認ください。',
  };
}

export default function TermsPage() {
  // ビルド時にファイルを読み込む
  const filePath = path.join(process.cwd(), 'public', 'documents', 'terms.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  return (
    <DocumentLayout title="利用規約">
      <MarkdownContent content={fileContent} />
    </DocumentLayout>
  );
}
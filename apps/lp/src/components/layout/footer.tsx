// apps/lp/src/components/layout/Footer.tsx
import Link from 'next/link';
import { X, PenLine } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white text-gray-600 text-base">
      <div className="max-w-6xl mx-auto flex flex-col items-center px-4 py-8 gap-4">
        {/* リンクエリア */}
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/terms" className="hover:text-primary-light transition-colors">利用規約</Link>
          <Link href="/privacy" className="hover:text-primary-light transition-colors">プライバシーポリシー</Link>
          <Link href="/contact" className="hover:text-primary-light transition-colors">お問い合わせ</Link>
        </div>

        {/* ソーシャルエリア */}
        <div className="flex gap-4 mt-2">
          <a href="https://x.com/your_x_account" target="_blank" rel="noopener noreferrer" className="hover:text-primary-light transition-colors">
            <X size={22} />
          </a>
          <a href="https://note.com/your_note_account" target="_blank" rel="noopener noreferrer" className="hover:text-primary-light transition-colors">
            <PenLine size={22} />
          </a>
        </div>

        {/* コピーライト */}
        <div className="text-xs text-center text-gray-500 pt-4 border-t border-gray-200 w-full mt-4">
          &copy; {new Date().getFullYear()} QuitMate. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

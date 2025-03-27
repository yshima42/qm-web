// apps/lp/src/components/layout/Footer.tsx
import { X, PenLine } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white text-base text-gray-600">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8">
        {/* リンクエリア */}
        <div className="flex flex-wrap justify-center gap-6">
          <Link
            href="/terms"
            className="transition-colors hover:text-primary-light"
          >
            利用規約
          </Link>
          <Link
            href="/privacy"
            className="transition-colors hover:text-primary-light"
          >
            プライバシーポリシー
          </Link>
          <Link
            href="/contact"
            className="transition-colors hover:text-primary-light"
          >
            お問い合わせ
          </Link>
        </div>

        {/* ソーシャルエリア */}
        <div className="mt-2 flex gap-4">
          <a
            href="https://x.com/QuitMate_JP"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-primary-light"
          >
            <X size={22} />
          </a>
          <a
            href="https://note.com/quitmate"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-primary-light"
          >
            <PenLine size={22} />
          </a>
        </div>

        {/* コピーライト */}
        <div className="mt-4 w-full border-t border-gray-200 pt-4 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} QuitMate. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

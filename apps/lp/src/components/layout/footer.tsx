// apps/lp/src/components/layout/Footer.tsx
import { X, PenLine } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";

export const Footer = () => {
  const t = useTranslations("footer");
  const tConfig = useTranslations("config");

  return (
    <footer className="border-t border-gray-200 bg-white text-base text-gray-600">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8">
        {/* リンクエリア */}
        <div className="flex flex-wrap justify-center gap-6">
          <Link
            href="/terms"
            className="text-sm transition-colors hover:text-primary-light md:text-base"
          >
            {t("links.terms")}
          </Link>
          <Link
            href="/privacy"
            className="text-sm transition-colors hover:text-primary-light md:text-base"
          >
            {t("links.privacy")}
          </Link>
          <Link
            href="/contact"
            className="text-sm transition-colors hover:text-primary-light md:text-base"
          >
            {t("links.contact")}
          </Link>
        </div>

        {/* ソーシャルエリア */}
        {tConfig("language-code") === "ja" && (
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
        )}

        {/* コピーライト */}
        <div className="mt-4 w-full border-t border-gray-200 pt-4 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} QuitMate. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

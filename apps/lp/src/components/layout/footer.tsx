// apps/lp/src/components/layout/Footer.tsx
"use client";
import { X, PenLine } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/routing";

type FooterProps = {
  namespace?: string;
};

export const Footer = ({ namespace = "" }: FooterProps = {}) => {
  const pathname = usePathname();
  // パスからnamespaceを自動判定（明示的に渡されていない場合）
  const detectedNamespace = namespace || (pathname.includes("/alcohol") ? "alcohol" : "");
  const translationKey = detectedNamespace ? `${detectedNamespace}.footer` : "footer";
  const t = useTranslations(translationKey);
  const tConfig = useTranslations("config");
  const basePath = detectedNamespace === "alcohol" ? "/alcohol" : "";

  return (
    <footer className="border-t border-gray-200 bg-white text-base text-gray-600">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8">
        {/* リンクエリア */}
        <div className="flex flex-wrap justify-center gap-6">
          <Link
            href={`${basePath}/terms`}
            className="hover:text-primary-light text-sm transition-colors md:text-base"
          >
            {t("links.terms")}
          </Link>
          <Link
            href={`${basePath}/privacy`}
            className="hover:text-primary-light text-sm transition-colors md:text-base"
          >
            {t("links.privacy")}
          </Link>
          <Link
            href={`${basePath}/contact`}
            className="hover:text-primary-light text-sm transition-colors md:text-base"
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
              className="hover:text-primary-light transition-colors"
            >
              <X size={22} />
            </a>
            <a
              href="https://note.com/quitmate"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-light transition-colors"
            >
              <PenLine size={22} />
            </a>
          </div>
        )}

        {/* コピーライト */}
        <div className="mt-4 w-full border-t border-gray-200 pt-4 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()}{" "}
          {detectedNamespace === "alcohol" ? "禁酒ウィーク" : "QuitMate"}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

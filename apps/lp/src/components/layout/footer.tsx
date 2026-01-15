"use client";

// apps/lp/src/components/layout/Footer.tsx
import { X, PenLine } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppLink } from "@/components/app-link";
import { useApp } from "@/components/providers/app-provider";

export const Footer = () => {
  const t = useTranslations("footer");
  const tConfig = useTranslations("config");
  const appId = useApp();

  // 禁酒ウィークの場合は薄い緑系のホバーカラーを使用
  const hoverColor = appId === "alcohol" ? "hover:text-green-500" : "hover:text-green-700";

  return (
    <footer className="border-t border-gray-200 bg-white text-base text-gray-600">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8">
        {/* リンクエリア */}
        <div className="flex flex-wrap justify-center gap-6">
          <AppLink href="/terms" className={`${hoverColor} text-sm transition-colors md:text-base`}>
            {t("links.terms")}
          </AppLink>
          <AppLink
            href="/privacy"
            className={`${hoverColor} text-sm transition-colors md:text-base`}
          >
            {t("links.privacy")}
          </AppLink>
          <AppLink
            href="/contact"
            className={`${hoverColor} text-sm transition-colors md:text-base`}
          >
            {t("links.contact")}
          </AppLink>
        </div>

        {/* ソーシャルエリア */}
        {tConfig("language-code") === "ja" && (
          <div className="mt-2 flex gap-4">
            <a
              href="https://x.com/QuitMate_JP"
              target="_blank"
              rel="noopener noreferrer"
              className={`${hoverColor} transition-colors`}
            >
              <X size={22} />
            </a>
            <a
              href="https://note.com/quitmate"
              target="_blank"
              rel="noopener noreferrer"
              className={`${hoverColor} transition-colors`}
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

// apps/lp/src/components/layout/Footer.tsx
"use client";
import { X, PenLine } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/routing";
import {
  getBasePath,
  getNamespaceFromPath,
  NAMESPACE_SITE_NAMES,
  type LpNamespace,
} from "@/utils/namespace";

type FooterProps = {
  namespace?: string;
};

export const Footer = ({ namespace = "" }: FooterProps = {}) => {
  const pathname = usePathname();
  const detectedNamespace: LpNamespace = namespace || getNamespaceFromPath(pathname);
  const translationKey = detectedNamespace ? `${detectedNamespace}.footer` : "footer";
  const t = useTranslations(translationKey);
  const tConfig = useTranslations("config");
  const basePath = getBasePath(detectedNamespace);

  // 各LPのテーマに合わせたフッター用スタイル
  const footerStyles =
    detectedNamespace === "porn"
      ? {
          bg: "bg-[#1a0a1f]",
          border: "border-purple-900/50",
          link: "text-purple-200 hover:text-white",
          social: "text-purple-300 hover:text-white",
          copyright: "text-purple-400",
        }
      : detectedNamespace === "kinshu"
        ? {
            bg: "bg-[#e8eaf6]",
            border: "border-indigo-200",
            link: "text-gray-900 hover:text-gray-700",
            social: "text-gray-900 hover:text-gray-700",
            copyright: "text-gray-700",
          }
        : detectedNamespace === "tobacco"
          ? {
              bg: "bg-[#e8f5e9]",
              border: "border-green-200",
              link: "text-gray-900 hover:text-gray-700",
              social: "text-gray-900 hover:text-gray-700",
              copyright: "text-gray-700",
            }
          : detectedNamespace === "alcohol"
            ? {
                bg: "bg-[#d8e8d4]",
                border: "border-green-200",
                link: "text-gray-700 hover:text-gray-900",
                social: "text-gray-600 hover:text-gray-800",
                copyright: "text-gray-600",
              }
            : {
                bg: "bg-white",
                border: "border-gray-200",
                link: "text-gray-600 hover:text-primary-light",
                social: "text-gray-600 hover:text-primary-light",
                copyright: "text-gray-500",
              };

  return (
    <footer className={`border-t ${footerStyles.border} ${footerStyles.bg} text-base`}>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8">
        {/* リンクエリア */}
        <div className={`flex flex-wrap justify-center gap-6 ${footerStyles.link}`}>
          <Link
            href={`${basePath}/terms`}
            className={`text-sm transition-colors md:text-base ${footerStyles.link}`}
          >
            {t("links.terms")}
          </Link>
          <Link
            href={`${basePath}/privacy`}
            className={`text-sm transition-colors md:text-base ${footerStyles.link}`}
          >
            {t("links.privacy")}
          </Link>
          <Link
            href={`${basePath}/contact`}
            className={`text-sm transition-colors md:text-base ${footerStyles.link}`}
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
              className={`transition-colors ${footerStyles.social}`}
            >
              <X size={22} />
            </a>
            <a
              href="https://note.com/quitmate"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors ${footerStyles.social}`}
            >
              <PenLine size={22} />
            </a>
          </div>
        )}

        {/* コピーライト */}
        <div
          className={`mt-4 w-full border-t pt-4 text-center text-xs ${footerStyles.border} ${footerStyles.copyright}`}
        >
          &copy; {new Date().getFullYear()}{" "}
          {detectedNamespace ? NAMESPACE_SITE_NAMES[detectedNamespace] : "QuitMate"}. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

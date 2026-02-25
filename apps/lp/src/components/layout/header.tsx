// apps/lp/src/components/layout/Header.tsx
"use client";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Link, usePathname } from "@/i18n/routing";
import { getBasePath, getNamespaceFromPath, type LpNamespace } from "@/utils/namespace";

import { LanguageSetting } from "../sections/language-setting";
import { Logo } from "../sections/logo";

type HeaderProps = {
  namespace?: string;
};

export const Header = ({ namespace = "" }: HeaderProps = {}) => {
  const pathname = usePathname();
  const detectedNamespace: LpNamespace = namespace || getNamespaceFromPath(pathname);
  const translationKey = detectedNamespace ? `${detectedNamespace}.header` : "header";
  const t = useTranslations(translationKey);
  const tBlog = useTranslations("header");
  const basePath = getBasePath(detectedNamespace);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 各LPのテーマに合わせたヘッダー用スタイル
  const headerStyles =
    detectedNamespace === "porn"
      ? {
          headerBg: "bg-[#1a0a1f] shadow-none",
          navText: "text-purple-200",
          navHover: "hover:text-white",
          mobileMenuBg: "bg-[#1a0a1f]",
          mobileLink: "text-purple-200 hover:text-white",
          buttonColor: "text-purple-200 hover:text-white",
        }
      : detectedNamespace === "kinshu"
        ? {
            headerBg: "bg-[#e8eaf6] shadow-sm",
            navText: "text-gray-900",
            navHover: "hover:text-gray-700",
            mobileMenuBg: "bg-[#e8eaf6]",
            mobileLink: "text-gray-900 hover:text-gray-700",
            buttonColor: "text-gray-900 hover:text-gray-700",
          }
        : detectedNamespace === "tobacco"
          ? {
              headerBg: "bg-[#e8f5e9] shadow-sm",
              navText: "text-gray-900",
              navHover: "hover:text-gray-700",
              mobileMenuBg: "bg-[#e8f5e9]",
              mobileLink: "text-gray-900 hover:text-gray-700",
              buttonColor: "text-gray-900 hover:text-gray-700",
            }
          : detectedNamespace === "alcohol"
            ? {
                headerBg: "bg-[#d8e8d4] shadow-sm",
                navText: "text-gray-700",
                navHover: "hover:text-gray-900",
                mobileMenuBg: "bg-[#d8e8d4]",
                mobileLink: "text-gray-700 hover:text-gray-900",
                buttonColor: "text-gray-700 hover:text-gray-900",
              }
            : {
                headerBg: "bg-white shadow-sm",
                navText: "text-gray-600",
                navHover: "hover:text-primary-light",
                mobileMenuBg: "bg-white",
                mobileLink: "text-gray-600 hover:text-primary-light",
                buttonColor: "text-gray-600",
              };

  const linkClass = `${headerStyles.navText} ${headerStyles.navHover} transition-colors`;
  const mobileLinkClass = `${headerStyles.mobileLink} transition-colors`;

  return (
    <header className={`w-full ${headerStyles.headerBg}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Logo namespace={detectedNamespace} lightText={detectedNamespace === "porn"} />

        {/* デスクトップ用ナビゲーション */}
        <div className={`hidden items-center gap-6 text-base md:flex ${headerStyles.navText}`}>
          <nav className="flex gap-6">
            {!detectedNamespace && (
              <>
                <Link href="/apps" className={`font-bold ${linkClass}`}>
                  {tBlog("links.otherApps")}
                </Link>
                <Link href="/blog" className={linkClass}>
                  {tBlog("links.blog")}
                </Link>
              </>
            )}
            {(detectedNamespace === "alcohol" ||
              detectedNamespace === "kinshu" ||
              detectedNamespace === "porn" ||
              detectedNamespace === "tobacco") && (
              <Link href="/" className={`font-bold ${linkClass}`}>
                {t("links.otherDependencies")}
              </Link>
            )}
            <Link href={`${basePath}/terms`} className={linkClass}>
              {t("links.terms")}
            </Link>
            <Link href={`${basePath}/privacy`} className={linkClass}>
              {t("links.privacy")}
            </Link>
            <Link href={`${basePath}/contact`} className={linkClass}>
              {t("links.contact")}
            </Link>
          </nav>
          {!detectedNamespace && <LanguageSetting />}
        </div>

        {/* モバイル用ハンバーガーメニュー */}
        <div className="flex items-center gap-4 md:hidden">
          {!detectedNamespace && <LanguageSetting />}
          <button
            className={`p-2 ${headerStyles.buttonColor}`}
            onClick={toggleMenu}
            aria-label={t("label.menu")}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* モバイル用ドロップダウンメニュー */}
      {isMenuOpen && (
        <div
          className={`absolute z-50 w-full px-6 py-4 shadow-lg md:hidden ${headerStyles.mobileMenuBg}`}
        >
          <nav className="flex flex-col space-y-4">
            {!detectedNamespace && (
              <>
                <Link
                  href="/apps"
                  className={`font-bold ${mobileLinkClass}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {tBlog("links.otherApps")}
                </Link>
                <Link href="/blog" className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>
                  {tBlog("links.blog")}
                </Link>
              </>
            )}
            {(detectedNamespace === "alcohol" ||
              detectedNamespace === "kinshu" ||
              detectedNamespace === "porn" ||
              detectedNamespace === "tobacco") && (
              <Link
                href="/"
                className={`font-bold ${mobileLinkClass}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t("links.otherDependencies")}
              </Link>
            )}
            <Link
              href={`${basePath}/terms`}
              className={mobileLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              {t("links.terms")}
            </Link>
            <Link
              href={`${basePath}/privacy`}
              className={mobileLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              {t("links.privacy")}
            </Link>
            <Link
              href={`${basePath}/contact`}
              className={mobileLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              {t("links.contact")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

// apps/lp/src/components/layout/Header.tsx
"use client";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { AppLink } from "@/components/app-link";
import { useApp } from "@/components/providers/app-provider";

import { LanguageSetting } from "../sections/language-setting";
import { Logo } from "../sections/logo";

export const Header = () => {
  const t = useTranslations("header");
  const appId = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 禁酒ウィークの場合は薄い緑系のホバーカラーを使用
  const hoverColor = appId === "alcohol" ? "hover:text-green-500" : "hover:text-green-700";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Logo />

        {/* デスクトップ用ナビゲーション */}
        <div className="hidden items-center gap-6 text-base text-gray-600 md:flex">
          <nav className="flex gap-6">
            <AppLink href="/blog" className={`${hoverColor} transition-colors`}>
              {t("links.blog")}
            </AppLink>
            <AppLink href="/terms" className={`${hoverColor} transition-colors`}>
              {t("links.terms")}
            </AppLink>
            <AppLink href="/privacy" className={`${hoverColor} transition-colors`}>
              {t("links.privacy")}
            </AppLink>
            <AppLink href="/contact" className={`${hoverColor} transition-colors`}>
              {t("links.contact")}
            </AppLink>
          </nav>
          <LanguageSetting />
        </div>

        {/* モバイル用ハンバーガーメニュー */}
        <div className="flex items-center gap-4 md:hidden">
          <LanguageSetting />
          <button className="p-2 text-gray-600" onClick={toggleMenu} aria-label={t("label.menu")}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* モバイル用ドロップダウンメニュー */}
      {isMenuOpen && (
        <div className="absolute z-50 w-full bg-white px-6 py-4 shadow-lg md:hidden">
          <nav className="flex flex-col space-y-4">
            <AppLink
              href="/blog"
              className={`${hoverColor} text-gray-600 transition-colors`}
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              {t("links.blog")}
            </AppLink>
            <AppLink
              href="/terms"
              className={`${hoverColor} text-gray-600 transition-colors`}
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              {t("links.terms")}
            </AppLink>
            <AppLink
              href="/privacy"
              className={`${hoverColor} text-gray-600 transition-colors`}
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              {t("links.privacy")}
            </AppLink>
            <AppLink
              href="/contact"
              className={`${hoverColor} text-gray-600 transition-colors`}
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              {t("links.contact")}
            </AppLink>
          </nav>
        </div>
      )}
    </header>
  );
};

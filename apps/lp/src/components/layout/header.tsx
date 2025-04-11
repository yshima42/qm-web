// apps/lp/src/components/layout/Header.tsx
"use client";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Link } from "@/i18n/routing";

import { Logo } from "../sections/logo";

export const Header = () => {
  const t = useTranslations("header");

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Logo />

        {/* デスクトップ用ナビゲーション */}
        <nav className="hidden gap-6 text-base text-gray-600 md:flex">
          <Link
            href="/terms"
            className="transition-colors hover:text-primary-light"
          >
            {t("links.terms")}
          </Link>
          <Link
            href="/privacy"
            className="transition-colors hover:text-primary-light"
          >
            {t("links.privacy")}
          </Link>
          <Link
            href="/contact"
            className="transition-colors hover:text-primary-light"
          >
            {t("links.contact")}
          </Link>
        </nav>

        {/* モバイル用ハンバーガーメニュー */}
        <button
          className="p-2 text-gray-600 md:hidden"
          onClick={toggleMenu}
          aria-label={t("label.menu")}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* モバイル用ドロップダウンメニュー */}
      {isMenuOpen && (
        <div className="absolute z-50 w-full bg-white px-6 py-4 shadow-lg md:hidden">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/terms"
              className="text-gray-600 transition-colors hover:text-primary-light"
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              {t("links.terms")}
            </Link>
            <Link
              href="/privacy"
              className="text-gray-600 transition-colors hover:text-primary-light"
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              {t("links.privacy")}
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 transition-colors hover:text-primary-light"
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              {t("links.contact")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

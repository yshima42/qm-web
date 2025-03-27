// apps/lp/src/components/layout/Header.tsx
"use client";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/icon.png" alt="QuitMate" width={40} height={40} />
          <span className="text-2xl font-semibold text-gray-800">QuitMate</span>
        </Link>

        {/* デスクトップ用ナビゲーション */}
        <nav className="hidden gap-6 text-base text-gray-600 md:flex">
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
        </nav>

        {/* モバイル用ハンバーガーメニュー */}
        <button
          className="p-2 text-gray-600 md:hidden"
          onClick={toggleMenu}
          aria-label="メニュー"
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
              利用規約
            </Link>
            <Link
              href="/privacy"
              className="text-gray-600 transition-colors hover:text-primary-light"
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              プライバシーポリシー
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 transition-colors hover:text-primary-light"
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              お問い合わせ
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

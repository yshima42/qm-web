// apps/lp/src/components/layout/Header.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/icon.png" alt="QuitMate" width={40} height={40} />
          <span className="text-2xl font-semibold text-gray-800">QuitMate</span>
        </Link>

        {/* デスクトップ用ナビゲーション */}
        <nav className="hidden md:flex gap-6 text-base text-gray-600">
          <Link href="/terms" className="hover:text-primary-light transition-colors">利用規約</Link>
          <Link href="/privacy" className="hover:text-primary-light transition-colors">プライバシーポリシー</Link>
          <Link href="/contact" className="hover:text-primary-light transition-colors">お問い合わせ</Link>
        </nav>

        {/* モバイル用ハンバーガーメニュー */}
        <button 
          className="md:hidden p-2 text-gray-600"
          onClick={toggleMenu}
          aria-label="メニュー"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* モバイル用ドロップダウンメニュー */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg py-4 px-6 absolute w-full z-50">
          <nav className="flex flex-col space-y-4">
            <Link 
              href="/terms" 
              className="text-gray-600 hover:text-primary-light transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              利用規約
            </Link>
            <Link 
              href="/privacy" 
              className="text-gray-600 hover:text-primary-light transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              プライバシーポリシー
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-600 hover:text-primary-light transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              お問い合わせ
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

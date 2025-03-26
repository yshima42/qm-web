// apps/lp/src/components/layout/Header.tsx
import Link from 'next/link';
import Image from 'next/image';

export const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/icon.png" alt="QuitMate" width={40} height={40} />
          <span className="text-2xl font-semibold text-gray-800">QuitMate</span>
        </Link>
        <nav className="flex gap-6 text-base text-gray-600">
          <Link href="/terms" className="hover:text-primary-light transition-colors">利用規約</Link>
          <Link href="/privacy" className="hover:text-primary-light transition-colors">プライバシーポリシー</Link>
          <Link href="/contact" className="hover:text-primary-light transition-colors">お問い合わせ</Link>
        </nav>
      </div>
    </header>
  );
};

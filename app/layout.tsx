'use client';

import { Menu } from 'lucide-react';
import { Geist } from 'next/font/google';
import Link from 'next/link';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';

import { Sidebar, SidebarContent } from '@/components/sidebar';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { HabitCategoryName } from '@/lib/types';

import './globals.css';

const habitCategories: HabitCategoryName[] = [
  'Game',
  'Tobacco',
  'Shopping',
  'Drugs',
  'Overeating',
  'Porno',
  'SNS',
  'Gambling',
  'Caffeine',
  'Cosmetic Surgery',
  'Custom',
  'Alcohol',
  'Codependency',
  'Official',
];

const geistSans = Geist({
  display: 'swap',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ドロワーの状態を管理するための状態変数
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex min-h-screen flex-col items-center">
            <div className="flex w-full flex-1 flex-col items-center">
              <nav className="flex h-16 w-full justify-center border-b border-border">
                <div className="flex w-full max-w-5xl items-center justify-between p-3 px-4 sm:px-5">
                  {/* 左：ハンバーガーメニュー（モバイルのみ表示） */}
                  <div className="md:hidden">
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                      <SheetTrigger asChild>
                        <Button size="icon" variant="ghost" className="text-foreground">
                          <Menu className="size-6" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-64 sm:max-w-xs">
                        <SheetHeader>
                          <SheetTitle>メニュー</SheetTitle>
                        </SheetHeader>
                        <div className="pt-4">
                          <SidebarContent
                            habitCategories={habitCategories}
                            // リンクがクリックされたらドロワーを閉じる関数を渡す
                            onLinkClick={() => {
                              setSheetOpen(false);
                            }}
                          />
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>

                  {/* 中央：アプリロゴ */}
                  <div className="absolute left-1/2 -translate-x-1/2 font-bold text-foreground">
                    <Link href="/">QuitMate</Link>
                  </div>

                  {/* 右：テーマ切り替え */}
                  <div>
                    <ThemeSwitcher />
                  </div>
                </div>
              </nav>

              <div className="flex w-full max-w-5xl">
                <Sidebar habitCategories={habitCategories} />
                <div className="flex-1 p-3 sm:p-5">{children}</div>
              </div>

              <footer className="mx-auto flex w-full items-center justify-center gap-8 border-t py-16 text-center text-xs">
                <p>
                  Powered by{' '}
                  <a
                    href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    Supabase
                  </a>
                </p>
                <ThemeSwitcher />
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

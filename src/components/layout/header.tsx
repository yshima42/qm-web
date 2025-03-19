'use client';

import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { ThemeSwitcher } from '@/components/custom/theme-switcher';
import { SidebarContent } from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { HabitCategoryName } from '@/lib/types';

export function Header({ habitCategories }: { habitCategories: HabitCategoryName[] }) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 flex h-16 w-full justify-center border-b border-border bg-background shadow-sm">
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
          <Link href="/" className="flex items-end gap-1">
            <Image
              src="/icon-web.png"
              alt="QuitMate Logo"
              width={20}
              height={20}
              className="h-6 w-auto"
            />
            <span className="leading-tight">QuitMate</span>
          </Link>
        </div>

        {/* 右：テーマ切り替え */}
        <div>
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}

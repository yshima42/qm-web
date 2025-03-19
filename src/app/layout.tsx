'use client';

import { Geist } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

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
              <Header habitCategories={habitCategories} />

              <div className="flex w-full max-w-5xl">
                <Sidebar habitCategories={habitCategories} />
                <div className="flex-1 p-3 sm:p-5">{children}</div>
              </div>

              <Footer />
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

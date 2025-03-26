'use client';

import { Geist } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

import { Footer } from '@/components/layout/footer';
import { Sidebar } from '@/components/layout/sidebar';
import { SmartBanner } from '@/components/ui/smart-banner';
import './globals.css';

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
              <div className="flex w-full max-w-5xl">
                <Sidebar />
                <div className="flex flex-1 flex-col">{children}</div>
              </div>
              <SmartBanner />
              <Footer />
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

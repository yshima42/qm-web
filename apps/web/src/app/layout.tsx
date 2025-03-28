import { Metadata } from 'next';
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

export const metadata: Metadata = {
  title: 'QuitMate（クイットメイト） | 依存症克服SNS',
  description:
    '依存症克服のための、禁酒、禁ギャンブル、禁煙、禁欲などをサポートするSNSアプリです。',
  keywords: ['依存症', '禁酒', '禁ギャンブル', '禁煙', '禁欲'],
  applicationName: 'QuitMate（クイットメイト）',
  creator: 'QuitMate（クイットメイト）',
  publisher: 'QuitMate（クイットメイト）',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://quitmate.app'),
  alternates: {
    canonical: '/',
    languages: {
      'ja-JP': '/ja',
    },
  },
  openGraph: {
    title: 'QuitMate（クイットメイト） | 依存症克服SNS',
    description:
      '依存症克服のための、禁酒、禁ギャンブル、禁煙、禁欲などをサポートするSNSアプリです。',
    url: 'https://quitmate.app',
    siteName: 'QuitMate（クイットメイト）',
    images: [
      {
        url: '/images/ogp.png',
        width: 1200,
        height: 630,
        alt: 'QuitMate OGP Image',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuitMate（クイットメイト）',
    description: '依存症克服SNS',
    images: ['/images/ogp.png'],
    creator: '@QuitMate_JP',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

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

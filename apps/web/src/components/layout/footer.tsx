import { ThemeSwitcher } from '@quitmate/ui';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { EXTERNAL_URLS } from '@/lib/urls';

export function Footer() {
  const t = useTranslations('footer');
  const tConfig = useTranslations('config');

  return (
    <footer className="mx-auto flex w-full flex-col items-center justify-center gap-4 border-t py-8 text-center">
      <div className="flex items-center justify-center">
        <Link href="/" className="flex flex-col items-center">
          <Image
            src="/images/icon-web.png"
            alt="QuitMate Logo"
            width={40}
            height={40}
            className="mb-2"
          />
          <p className="text-sm font-medium">{t('title')}</p>
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
        <Link
          href={`${EXTERNAL_URLS.LP}/${tConfig('language-code')}`}
          className="hover:text-foreground hover:underline"
        >
          {t('about')}
        </Link>
        <Link
          href={`${EXTERNAL_URLS.LP}/${tConfig('language-code')}/terms`}
          className="hover:text-foreground hover:underline"
        >
          {t('terms')}
        </Link>
        <Link
          href={`${EXTERNAL_URLS.LP}/${tConfig('language-code')}/privacy`}
          className="hover:text-foreground hover:underline"
        >
          {t('privacy')}
        </Link>
        <Link
          href={`${EXTERNAL_URLS.LP}/${tConfig('language-code')}/contact`}
          className="hover:text-foreground hover:underline"
        >
          {t('contact')}
        </Link>
      </div>

      <div className="mt-4 flex items-center justify-center gap-6">
        <ThemeSwitcher />
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} QuitMate All Rights Reserved.
      </p>
    </footer>
  );
}


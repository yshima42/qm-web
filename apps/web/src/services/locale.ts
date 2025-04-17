'use server';

import { cookies, headers } from 'next/headers';

import { Locale, defaultLocale, locales } from '@/i18n/config';

// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
const COOKIE_NAME = 'NEXT_LOCALE';

async function getBrowserLocale(): Promise<Locale | null> {
  const acceptLanguage = (await headers()).get('accept-language');
  if (!acceptLanguage) return null;

  const browserLocale = acceptLanguage.split(',')[0].split('-')[0];

  // localesに含まれている言語かどうかを確認
  return locales.includes(browserLocale as Locale) ? (browserLocale as Locale) : null;
}

export async function getUserLocale() {
  const cookieLocale = (await cookies()).get(COOKIE_NAME)?.value;
  // cookieの値も有効な言語かチェック
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  const browserLocale = await getBrowserLocale();
  if (browserLocale) return browserLocale;

  return defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  (await cookies()).set(COOKIE_NAME, locale);
}

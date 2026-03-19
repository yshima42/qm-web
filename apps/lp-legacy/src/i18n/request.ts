import { headers } from "next/headers";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

async function getBrowserLocale(): Promise<string | null> {
  const acceptLanguage = (await headers()).get("accept-language");
  if (!acceptLanguage) return null;

  const browserLocale = acceptLanguage.split(",")[0].split("-")[0];
  return hasLocale(routing.locales, browserLocale) ? browserLocale : null;
}

export default getRequestConfig(async ({ requestLocale }) => {
  // まずリクエストされた言語をチェック
  const requested = await requestLocale;
  if (hasLocale(routing.locales, requested)) {
    return {
      locale: requested,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      messages: (await import(`../../messages/${requested}.json`)).default,
    };
  }

  // ブラウザの言語設定をチェック
  const browserLocale = await getBrowserLocale();
  if (browserLocale) {
    return {
      locale: browserLocale,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      messages: (await import(`../../messages/${browserLocale}.json`)).default,
    };
  }

  // どちらも該当しない場合はデフォルト言語を使用
  return {
    locale: routing.defaultLocale,
    messages:
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (await import(`../../messages/${routing.defaultLocale}.json`)).default,
  };
});

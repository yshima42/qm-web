import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // リクエストされた言語の取得と検証
  const requested = await requestLocale;
  // サポートされている言語かチェックし、未対応の場合はデフォルト言語を使用
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});

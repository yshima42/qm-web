import { locales, defaultLocale, type Locale } from "./config";
import en from "./messages/en.json";
import ja from "./messages/ja.json";

const messages: Record<Locale, Record<string, unknown>> = { en, ja };

/**
 * URLからロケールを取得
 */
export function getLocaleFromUrl(url: URL): Locale {
  const [, locale] = url.pathname.split("/");
  if (locales.includes(locale as Locale)) {
    return locale as Locale;
  }
  return defaultLocale;
}

/**
 * ネストしたキーで翻訳メッセージを取得
 * 例: getValue("hero.title", messages.ja) → "共になら、やめられる"
 */
function getValue(key: string, obj: Record<string, unknown>): string {
  const keys = key.split(".");
  let current: unknown = obj;
  for (const k of keys) {
    if (current == null || typeof current !== "object") return key;
    current = (current as Record<string, unknown>)[k];
  }
  return typeof current === "string" ? current : key;
}

/**
 * 翻訳関数を生成
 *
 * @example
 * const t = useTranslations(locale);
 * t("hero.title") // → "共になら、やめられる"
 *
 * @example namespace付き（mate LP用）
 * const t = useTranslations(locale, "alcohol");
 * t("hero.title") // → alcohol.hero.title を参照
 */
export function useTranslations(locale: Locale, namespace?: string) {
  const msg = messages[locale];

  return function t(key: string): string {
    // namespace指定時はまず namespace.key を探す
    if (namespace) {
      const namespacedValue = getValue(`${namespace}.${key}`, msg);
      if (namespacedValue !== `${namespace}.${key}`) {
        return namespacedValue;
      }
    }
    // fallback: トップレベルのキーを探す
    return getValue(key, msg);
  };
}

/**
 * 別ロケールの同じパスを取得（言語切替用）
 */
export function getAlternateLocaleUrl(url: URL, targetLocale: Locale): string {
  const currentLocale = getLocaleFromUrl(url);
  return url.pathname.replace(`/${currentLocale}`, `/${targetLocale}`);
}

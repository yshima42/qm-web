import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
  // Accept-Languageヘッダーから言語を判定
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language");

  // デフォルトは英語、ブラウザの言語設定が日本語の場合は日本語にリダイレクト
  const locale = acceptLanguage?.includes("ja") ? "ja" : "en";

  redirect(`/${locale}`);
}

/**
 * Cloudflare Pages Function: ルート(/)のみで Accept-Language に応じたリダイレクト
 * - ja で始まるブラウザ言語 → /ja/
 * - それ以外 → /en/
 * - 302 を使い、検索エンジンにロケール固定キャッシュさせない
 */
export async function onRequest(context) {
  const accept = context.request.headers.get("accept-language") || "";
  const isJapanese = accept.split(",").some((lang) => lang.trim().toLowerCase().startsWith("ja"));
  const destination = isJapanese ? "/ja/" : "/en/";
  return Response.redirect(new URL(destination, context.request.url), 302);
}

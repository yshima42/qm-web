"use client";

import { useUrlMask } from "@/hooks/use-url-mask";

/**
 * QuitMateアプリの場合、URLバーから /quitmate プレフィックスを削除するコンポーネント
 */
export function UrlMask() {
  useUrlMask();
  return null;
}

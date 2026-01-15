"use client";

import { useEffect } from "react";
import { usePathname, useParams } from "next/navigation";

/**
 * QuitMateアプリの場合、URLバーから /quitmate プレフィックスを削除する
 * クライアントサイドナビゲーション後にURLを変更する
 */
export function useUrlMask() {
  const pathname = usePathname();
  const params = useParams();
  const app = params?.app as string | undefined;

  useEffect(() => {
    // QuitMateアプリの場合のみ、URLから /quitmate プレフィックスを削除
    if (app === "quitmate" && pathname.startsWith("/quitmate/")) {
      const maskedPath = pathname.replace("/quitmate", "");
      // 現在のURLと異なる場合のみ変更
      if (window.location.pathname !== maskedPath) {
        window.history.replaceState(
          { ...window.history.state, as: maskedPath, url: maskedPath },
          "",
          maskedPath,
        );
      }
    }
  }, [pathname, app]);
}

"use client";
import Image from "next/image";
import React, { useSyncExternalStore, useState } from "react";

type Platform = "ios" | "android" | null;

function getSnapshot(): Platform {
  const isBannerHidden = sessionStorage.getItem("smartBannerHidden");
  if (isBannerHidden) return null;
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
  const isAndroid = userAgent.includes("android");
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  if (isStandalone) return null;
  if (isIOSDevice) return "ios";
  if (isAndroid) return "android";
  return null;
}

function getServerSnapshot(): Platform {
  return null;
}

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

export const SmartBanner = () => {
  const platform = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [dismissed, setDismissed] = useState(false);

  if (!platform || dismissed) return null;

  const isIOS = platform === "ios";

  const handleDismiss = () => {
    sessionStorage.setItem("smartBannerHidden", "true");
    setDismissed(true);
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-3 bg-white px-4 py-2 shadow-md sm:px-6 dark:bg-gray-900">
      <div className="flex flex-1 items-center gap-3">
        <Image
          src="/images/app-icon.png"
          alt="QuitMate"
          width={48}
          height={48}
          className="rounded-xl border border-gray-200 dark:border-gray-700"
        />
        <div className="flex flex-col justify-center">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            QuitMate - 依存症克服SNS
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            無料 {isIOS ? " - App Storeで入手" : " - Google Playで入手"}
          </p>
        </div>
      </div>

      <a
        href={
          isIOS
            ? "https://apps.apple.com/us/app/%E4%BE%9D%E5%AD%98%E7%97%87%E5%85%8B%E6%9C%8Dsns-quitmate-%E3%82%AF%E3%82%A4%E3%83%83%E3%83%88%E3%83%A1%E3%82%A4%E3%83%88/id6462843097"
            : "https://play.google.com/store/apps/details?id=com.quitmate.quitmate"
        }
        onClick={handleDismiss}
        className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800"
      >
        開く
      </a>

      <button
        onClick={handleDismiss}
        className="ml-2 text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
        aria-label="閉じる"
      >
        ✕
      </button>
    </div>
  );
};

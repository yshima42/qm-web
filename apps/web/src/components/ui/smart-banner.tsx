"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export const SmartBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isBannerHidden = sessionStorage.getItem("smartBannerHidden");
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = userAgent.includes("android");
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

    setIsIOS(isIOSDevice);
    setIsVisible((isIOSDevice || isAndroid) && !isStandalone && !isBannerHidden);
  }, []);

  if (!isVisible) return null;

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
        onClick={() => {
          setIsVisible(false);
          sessionStorage.setItem("smartBannerHidden", "true");
        }}
        className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800"
      >
        開く
      </a>

      <button
        onClick={() => {
          setIsVisible(false);
          sessionStorage.setItem("smartBannerHidden", "true");
        }}
        className="ml-2 text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
        aria-label="閉じる"
      >
        ✕
      </button>
    </div>
  );
};

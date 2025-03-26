import Image from 'next/image';
import React, { useEffect, useState } from 'react';

export const SmartBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // セッションストレージからバナーの表示状態を取得
    const isBannerHidden = sessionStorage.getItem('smartBannerHidden');

    // モバイルデバイスの検出
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = userAgent.includes('android');

    // スタンドアロンモード（PWA）チェック
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    setIsIOS(isIOSDevice);
    setIsVisible((isIOSDevice || isAndroid) && !isStandalone && !isBannerHidden);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex items-center bg-white px-4 py-3 shadow-sm dark:bg-gray-800">
      <button
        onClick={() => {
          setIsVisible(false);
          // セッションストレージにバナーを閉じたことを記録
          sessionStorage.setItem('smartBannerHidden', 'true');
        }}
        className="absolute left-2 text-gray-500 dark:text-gray-400"
      >
        ✕
      </button>

      <div className="ml-8 flex flex-1 items-center gap-3">
        <div className="size-10 rounded-xl bg-white">
          <Image src="/icon-web.png" alt="QuitMate" width={40} height={40} className="rounded-xl" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">QuitMate</h3>
          <p className="text-xs text-gray-600 dark:text-gray-300">Nudge Apps</p>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            FREE - {isIOS ? 'On the App Store' : 'In Google Play'}
          </p>
        </div>
        <a
          href={
            isIOS
              ? 'https://apps.apple.com/us/app/%E4%BE%9D%E5%AD%98%E7%97%87%E5%85%8B%E6%9C%8Dsns-quitmate-%E3%82%AF%E3%82%A4%E3%83%83%E3%83%88%E3%83%A1%E3%82%A4%E3%83%88/id6462843097'
              : 'https://play.google.com/store/apps/details?id=com.quitmate.quitmate'
          }
          onClick={() => {
            setIsVisible(false);
            sessionStorage.setItem('smartBannerHidden', 'true');
          }}
          className={`rounded-md px-4 py-1 text-sm ${
            isIOS ? 'text-blue-500 dark:text-blue-400' : 'bg-teal-500 text-white'
          }`}
        >
          アプリを開く
        </a>
      </div>
    </div>
  );
};

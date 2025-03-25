import { useEffect, useState } from 'react';

export const SmartBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // モバイルデバイスの検出
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = userAgent.includes('android');

    // スタンドアロンモード（PWA）チェック
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    setIsIOS(isIOSDevice);
    setIsVisible((isIOSDevice || isAndroid) && !isStandalone);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between bg-white p-4 shadow-lg">
      <div className="flex items-center space-x-4">
        <div className="size-12 rounded-xl bg-gray-200">{/* アプリアイコンを配置 */}</div>
        <div>
          <h3 className="font-bold">アプリをインストール</h3>
          <p className="text-sm text-gray-600">より快適な体験のためにアプリをご利用ください</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => {
            setIsVisible(false);
          }}
          className="rounded-lg px-4 py-2 text-gray-600"
        >
          あとで
        </button>
        <a
          href={
            isIOS
              ? 'https://apps.apple.com/us/app/%E4%BE%9D%E5%AD%98%E7%97%87%E5%85%8B%E6%9C%8Dsns-quitmate-%E3%82%AF%E3%82%A4%E3%83%83%E3%83%88%E3%83%A1%E3%82%A4%E3%83%88/id6462843097'
              : 'https://play.google.com/store/apps/details?id=com.quitmate.quitmate'
          }
          className="rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          インストール
        </a>
      </div>
    </div>
  );
};

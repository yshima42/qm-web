"use client";

import Image from "next/image";

import { getAppConfig } from "@/apps";
import { AppLink } from "@/components/app-link";
import { useApp } from "@/components/providers/app-provider";

type LogoProps = {
  xl?: boolean;
};

export const Logo = ({ xl = false }: LogoProps) => {
  const appId = useApp();
  const appConfig = appId ? getAppConfig(appId) : null;
  const siteName = appConfig?.siteName || "QuitMate";

  const size = xl ? 56 : 42;
  const fontStyle = xl ? "text-4xl" : "text-3xl";

  // アプリ設定からロゴ画像を取得
  const logoImage = appConfig?.logoImage || "/images/icon-web.png";

  return (
    <AppLink href="/" className="flex items-center">
      <div className="flex items-center">
        <Image src={logoImage} alt={siteName} width={size} height={size} className="mr-1" />
        <span
          className={`${fontStyle} font-medium text-gray-800`}
          style={{
            fontWeight: 550,
            fontFamily: "'Inter', 'Noto Sans JP', sans-serif",
          }}
        >
          {siteName}
        </span>
      </div>
    </AppLink>
  );
};

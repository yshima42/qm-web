"use client";

import Image from "next/image";
import Link from "next/link";

type StoreBadgeProps = {
  store: "apple" | "google";
  className?: string;
  size?: "small" | "medium" | "large" | "xl";
};

// ストアごとのURL
const storeUrls = {
  apple: "https://apps.apple.com/jp/app/id6462843097",
  google: "https://play.google.com/store/apps/details?id=com.quitmate.quitmate",
};

// ストアごとの画像パス
const storeBadgeImages = {
  apple: "/images/apple-store-badge.png",
  google: "/images/google-play-badge.png",
};

// サイズごとの高さと幅のマッピング
const sizeMapping = {
  small: {
    height: 40,
    width: { apple: 120, google: 135 },
  },
  medium: {
    height: 50,
    width: { apple: 150, google: 168 },
  },
  large: {
    height: 60,
    width: { apple: 180, google: 200 },
  },
  xl: {
    height: 70,
    width: { apple: 210, google: 230 },
  },
};

export function StoreBadge({
  store,
  className = "",
  size = "medium",
}: StoreBadgeProps) {
  const { height } = sizeMapping[size];
  const width = sizeMapping[size].width[store];
  const imageAltText = store === "apple" ? "App Store" : "Google Play";

  // 数値を明示的に文字列に変換
  const heightStyle = { height: `${String(height)}px` };

  return (
    <Link href={storeUrls[store]} target="_blank">
      <div className={`flex items-center ${className}`} style={heightStyle}>
        <Image
          src={storeBadgeImages[store]}
          alt={imageAltText}
          width={width}
          height={height}
          className="h-full w-auto object-contain"
        />
      </div>
    </Link>
  );
}

// 両方のバッジを表示するコンポーネント
type StoreBadgesProps = {
  direction?: "row" | "column";
  size?: "small" | "medium" | "large" | "xl";
  className?: string;
};

export function StoreBadges({
  direction = "row",
  size = "medium",
  className = "",
}: StoreBadgesProps) {
  return (
    <div
      className={`flex items-center justify-center gap-3 md:gap-4 
      ${direction === "column" ? "flex-col" : "flex-row"} ${className}`}
    >
      <StoreBadge store="apple" size={size} />
      <StoreBadge store="google" size={size} />
    </div>
  );
}

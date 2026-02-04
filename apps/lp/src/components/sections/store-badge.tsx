"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import React from "react";

import { Link } from "@/i18n/routing";

type StoreType = "apple" | "google";
type BadgeSize = "small" | "medium" | "large" | "xl";

type StoreBadgeProps = {
  store: StoreType;
  className?: string;
  size?: BadgeSize;
  /** 禁酒チャレンジLPの場合は "alcohol" を指定 */
  namespace?: string;
};

const STORE_URLS = {
  default: {
    apple: "https://apps.apple.com/jp/app/id6462843097",
    google: "https://play.google.com/store/apps/details?id=com.quitmate.quitmate",
  },
  alcohol: {
    apple: "https://apps.apple.com/jp/app/id6756336624",
    google: "https://play.google.com/store/apps/details?id=com.quitmate.kinshu",
  },
} as const;

const SIZE_MAPPING: Record<BadgeSize, { height: number; width: Record<StoreType, number> }> = {
  small: { height: 40, width: { apple: 120, google: 135 } },
  medium: { height: 50, width: { apple: 150, google: 168 } },
  large: { height: 60, width: { apple: 180, google: 200 } },
  xl: { height: 70, width: { apple: 210, google: 230 } },
};

function getStoreUrls(namespace?: string) {
  return namespace === "alcohol" ? STORE_URLS.alcohol : STORE_URLS.default;
}

const STORE_ALT: Record<StoreType, string> = {
  apple: "App Store",
  google: "Google Play",
};

const BADGE_IMAGE: Record<StoreType, string> = {
  apple: "apple-store-badge.png",
  google: "google-play-badge.png",
};

export function StoreBadge({ store, className = "", size = "medium", namespace }: StoreBadgeProps) {
  const t = useTranslations("config");
  const lang = t("language-code");
  const storeUrls = getStoreUrls(namespace);
  const { height, width } = SIZE_MAPPING[size];
  const widthPx = width[store];
  const badgeSrc = `/images/${lang}/${BADGE_IMAGE[store]}`;

  return (
    <Link href={storeUrls[store]} target="_blank">
      <div className={`flex items-center ${className}`} style={{ height: `${height}px` }}>
        <Image
          src={badgeSrc}
          alt={STORE_ALT[store]}
          width={widthPx}
          height={height}
          className="h-full w-auto object-contain"
        />
      </div>
    </Link>
  );
}

type StoreBadgesProps = {
  direction?: "row" | "column";
  size?: BadgeSize;
  className?: string;
  /** 禁酒チャレンジLPの場合は "alcohol" を指定 */
  namespace?: string;
};

export function StoreBadges({
  direction = "row",
  size = "medium",
  className = "",
  namespace,
}: StoreBadgesProps) {
  return (
    <div
      className={`flex items-center justify-center gap-3 md:gap-4 ${direction === "column" ? "flex-col" : "flex-row"} ${className}`}
    >
      <StoreBadge store="apple" size={size} namespace={namespace} />
      <StoreBadge store="google" size={size} namespace={namespace} />
    </div>
  );
}

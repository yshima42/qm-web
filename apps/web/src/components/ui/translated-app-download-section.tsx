"use client";

import { AppDownloadSection } from "@quitmate/ui";
import { useTranslations } from "next-intl";

type TranslatedAppDownloadSectionProps = {
  /** カスタムメッセージを指定する場合（デフォルトの翻訳メッセージを上書き） */
  customMessage?: string;
};

/**
 * 翻訳を自動的に取得して AppDownloadSection を表示するクライアントコンポーネント
 */
export function TranslatedAppDownloadSection({ customMessage }: TranslatedAppDownloadSectionProps) {
  const tAppDownload = useTranslations("app-download-section");

  return (
    <AppDownloadSection
      title={tAppDownload("title")}
      message={customMessage ?? tAppDownload("message")}
    />
  );
}

import { AppDownloadSection } from "@quitmate/ui";
import { getTranslations } from "next-intl/server";

type TranslatedAppDownloadSectionServerProps = {
  /** カスタムメッセージを指定する場合（デフォルトの翻訳メッセージを上書き） */
  customMessage?: string;
};

/**
 * 翻訳を自動的に取得して AppDownloadSection を表示するサーバーコンポーネント
 */
export async function TranslatedAppDownloadSectionServer({
  customMessage,
}: TranslatedAppDownloadSectionServerProps) {
  const tAppDownload = await getTranslations("app-download-section");

  return (
    <AppDownloadSection
      title={tAppDownload("title")}
      message={customMessage ?? tAppDownload("message")}
    />
  );
}

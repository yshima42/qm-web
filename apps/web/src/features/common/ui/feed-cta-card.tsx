"use client";

import { AppDownloadDialogTrigger } from "@quitmate/ui";
import { Download, LogIn, X } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";

const CTA_TRIGGER_COUNT = 5;
const STORAGE_KEY = "feed_cta_dismissed";

function getIsDismissed() {
  return !!sessionStorage.getItem(STORAGE_KEY);
}

/**
 * 未ログインユーザー向けのフィード内CTAポップアップ
 * 投稿を一定数スクロールすると画面下部に表示される
 */
export function FeedCtaPopup({ viewedCount }: { viewedCount: number }) {
  const t = useTranslations("feed-cta");
  const tAppDownload = useTranslations("app-download-dialog");
  const wasDismissedOnMount = useSyncExternalStore(
    () => () => {},
    getIsDismissed,
    () => true,
  );
  const [dismissed, setDismissed] = useState(wasDismissedOnMount);

  if (dismissed || viewedCount < CTA_TRIGGER_COUNT) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  return (
    <div className="fixed inset-x-0 bottom-16 z-40 flex justify-center px-4 md:bottom-4">
      <div className="bg-card border-border w-full max-w-sm rounded-2xl border p-4 shadow-lg">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <p className="text-foreground text-sm font-bold">{t("title")}</p>
            <p className="text-muted-foreground text-xs">{t("description")}</p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground -mt-1 -mr-1 p-1"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex gap-2">
          <AppDownloadDialogTrigger
            title={tAppDownload("title")}
            description={tAppDownload("description")}
            qrCodeLabel={tAppDownload("qrCodeLabel")}
            qrCodeAlt={tAppDownload("qrCodeAlt")}
            storeLabel={tAppDownload("storeLabel")}
          >
            <Button size="sm" className="flex-1 cursor-pointer rounded-full">
              <Download className="mr-1 size-3" />
              {t("downloadApp")}
            </Button>
          </AppDownloadDialogTrigger>

          <Button asChild variant="outline" size="sm" className="flex-1 rounded-full">
            <Link href="/auth/sign-up">
              <LogIn className="mr-1 size-3" />
              {t("signUp")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

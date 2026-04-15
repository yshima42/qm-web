"use client";

import { AppDownloadDialogTrigger } from "@quitmate/ui";
import { Download, LogIn, X } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";

/** 初回表示までの投稿数 */
const FIRST_TRIGGER = 5;
/** バツで閉じた後、再表示するまでの追加投稿数 */
const REPEAT_INTERVAL = 10;

/**
 * 未ログインユーザー向けのフィードゲートモーダル
 * 一定数の投稿を読んだらオーバーレイで表示し、ログインまたはアプリDLを促す
 * バツボタンで閉じてもスクロールを続けると再表示される
 */
export function FeedGate({ viewedCount }: { viewedCount: number }) {
  const t = useTranslations("feed-cta");
  const tAppDownload = useTranslations("app-download-dialog");
  const [dismissedAt, setDismissedAt] = useState<number | null>(null);

  // 表示条件: 初回は FIRST_TRIGGER件目、閉じた後は閉じた時点から REPEAT_INTERVAL件後
  const shouldShow =
    dismissedAt === null
      ? viewedCount >= FIRST_TRIGGER
      : viewedCount >= dismissedAt + REPEAT_INTERVAL;

  if (!shouldShow) return null;

  const handleDismiss = () => {
    setDismissedAt(viewedCount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card relative w-full max-w-lg rounded-t-2xl px-6 pt-6 pb-8 shadow-2xl md:mt-auto md:mb-auto md:rounded-2xl">
        <button
          onClick={handleDismiss}
          className="text-muted-foreground hover:text-foreground absolute top-4 right-4 p-1"
        >
          <X className="size-5" />
        </button>

        <div className="mb-2 text-center">
          <p className="text-foreground text-lg font-bold">{t("title")}</p>
          <p className="text-muted-foreground mt-1 text-sm">{t("description")}</p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <AppDownloadDialogTrigger
            title={tAppDownload("title")}
            description={tAppDownload("description")}
            qrCodeLabel={tAppDownload("qrCodeLabel")}
            qrCodeAlt={tAppDownload("qrCodeAlt")}
            storeLabel={tAppDownload("storeLabel")}
          >
            <Button size="lg" className="w-full cursor-pointer rounded-full text-base">
              <Download className="mr-2 size-5" />
              {t("downloadApp")}
            </Button>
          </AppDownloadDialogTrigger>

          <Button asChild variant="outline" size="lg" className="w-full rounded-full text-base">
            <Link href="/auth/sign-up">
              <LogIn className="mr-2 size-5" />
              {t("signUp")}
            </Link>
          </Button>

          <p className="text-muted-foreground mt-2 text-center text-xs">
            {t("loginLink.prefix")}
            <Link href="/auth/login" className="text-primary hover:underline">
              {t("loginLink.action")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

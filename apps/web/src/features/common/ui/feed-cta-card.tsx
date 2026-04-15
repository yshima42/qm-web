"use client";

import { AppDownloadDialogTrigger } from "@quitmate/ui";
import { Download, LogIn } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

/**
 * 未ログインユーザー向けのフィード内CTAカード
 * フィードのストーリー間に挿入して、アプリDLやログインを促す
 */
export function FeedCtaCard() {
  const t = useTranslations("feed-cta");
  const tAppDownload = useTranslations("app-download-dialog");

  return (
    <div className="border-border bg-card border-b py-6">
      <div className="mx-auto max-w-sm px-4 text-center">
        <p className="text-foreground mb-1 text-base font-bold">{t("title")}</p>
        <p className="text-muted-foreground mb-4 text-sm">{t("description")}</p>

        <div className="flex flex-col gap-2">
          <AppDownloadDialogTrigger
            title={tAppDownload("title")}
            description={tAppDownload("description")}
            qrCodeLabel={tAppDownload("qrCodeLabel")}
            qrCodeAlt={tAppDownload("qrCodeAlt")}
            storeLabel={tAppDownload("storeLabel")}
          >
            <Button className="w-full cursor-pointer rounded-full">
              <Download className="mr-2 size-4" />
              {t("downloadApp")}
            </Button>
          </AppDownloadDialogTrigger>

          <Button asChild variant="outline" className="w-full rounded-full">
            <Link href="/auth/sign-up">
              <LogIn className="mr-2 size-4" />
              {t("signUp")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

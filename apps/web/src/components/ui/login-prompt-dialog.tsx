"use client";

import { AppDownloadDialogTrigger } from "@quitmate/ui";
import { Download, Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ReactNode, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LoginPromptDialogProps = {
  children: ReactNode;
  className?: string;
  type?: "story" | "article";
};

export function LoginPromptDialog({ children, className, type = "story" }: LoginPromptDialogProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("login-prompt");
  const tAppDownload = useTranslations("app-download-dialog");

  const title = type === "article" ? t("article-title") : t("story-title");
  const description = type === "article" ? t("article-description") : t("story-description");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/*
       * 呼び出し側から非ボタン要素 (div 等) を children で受け取っても
       * aria 属性が role と整合するよう、trigger は必ず <button> にする。
       */}
      <DialogTrigger asChild>
        <button type="button" className={cn("inline-flex", className)}>
          {children}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center">
          <Heart className="mb-2 size-12 fill-pink-500 text-pink-500" />
          <DialogTitle className="text-center text-xl">{title}</DialogTitle>
          <DialogDescription className="text-center">{description}</DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-3">
          <AppDownloadDialogTrigger
            title={tAppDownload("title")}
            description={tAppDownload("description")}
            qrCodeLabel={tAppDownload("qrCodeLabel")}
            qrCodeAlt={tAppDownload("qrCodeAlt")}
            storeLabel={tAppDownload("storeLabel")}
          >
            <Button className="w-full cursor-pointer">
              <Download className="mr-2 size-4" />
              {t("download-app")}
            </Button>
          </AppDownloadDialogTrigger>
          <Button asChild className="w-full" variant="outline">
            <Link href="/auth/sign-up">{t("sign-up")}</Link>
          </Button>
          <p className="text-muted-foreground text-center text-xs">
            {t("login-prefix")}
            <Link href="/auth/login" className="text-primary hover:underline">
              {t("login")}
            </Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

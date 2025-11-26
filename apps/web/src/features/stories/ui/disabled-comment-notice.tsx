"use client";

import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";

export function DisabledCommentNotice() {
  const t = useTranslations("disabled-comment");

  return (
    <div className="mx-2 my-4 rounded-xl bg-gray-100 p-4 dark:bg-gray-800/90">
      <div className="flex items-start gap-3">
        <div className="bg-primary/20 flex h-9 w-9 items-center justify-center rounded-full">
          <Lock className="text-primary h-4 w-4" />
        </div>
        <div className="flex-1">
          <h3 className="text-foreground text-sm font-semibold">{t("title")}</h3>
          <p className="text-muted-foreground mt-1 text-sm">{t("message")}</p>
        </div>
      </div>
    </div>
  );
}

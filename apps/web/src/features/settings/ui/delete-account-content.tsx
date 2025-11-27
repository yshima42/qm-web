"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@quitmate/ui";

export function DeleteAccountContent() {
  const t = useTranslations("settings");

  const handleDeleteAccount = async () => {
    // TODO: アカウント削除の実装
    if (confirm(t("deleteAccountConfirm"))) {
      // アカウント削除処理
      console.log("Account deletion not implemented yet");
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/settings/account"
        className="mb-4 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        <span>{t("backToAccount")}</span>
      </Link>

      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <Trash2 className="size-8 text-destructive" />
          <h1 className="text-3xl font-bold">{t("deleteAccount")}</h1>
        </div>
        <p className="text-muted-foreground">{t("deleteAccountPageDescription")}</p>
      </div>

      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
        <h2 className="mb-4 text-xl font-semibold text-destructive">
          {t("deleteAccountWarning")}
        </h2>
        <ul className="mb-6 list-disc space-y-2 pl-5 text-muted-foreground">
          <li>{t("deleteAccountWarning1")}</li>
          <li>{t("deleteAccountWarning2")}</li>
          <li>{t("deleteAccountWarning3")}</li>
        </ul>
        <Button
          variant="destructive"
          onClick={handleDeleteAccount}
          className="w-full sm:w-auto"
        >
          {t("deleteAccountButton")}
        </Button>
      </div>
    </div>
  );
}


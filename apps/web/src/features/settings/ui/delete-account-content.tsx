"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@quitmate/ui";
import { useState, useTransition } from "react";
import { deleteAccount } from "@/features/settings/data/actions";

export function DeleteAccountContent() {
  const t = useTranslations("settings");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    if (!confirm(t("deleteAccountConfirm"))) {
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await deleteAccount();
      if (!result.success) {
        setError(result.error || t("deleteAccountError"));
      }
      // 成功した場合はdeleteAccount内でリダイレクトされる
    });
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
        {error && (
          <div className="mb-4 rounded-md bg-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <Button
          variant="destructive"
          onClick={handleDeleteAccount}
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          {isPending ? t("deleting") : t("deleteAccountButton")}
        </Button>
      </div>
    </div>
  );
}


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
        return;
      }
      // 成功した場合はログインページにリダイレクト
      window.location.href = "/auth/login";
    });
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/settings/account"
        className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="size-4" />
        <span>{t("backToAccount")}</span>
      </Link>

      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <Trash2 className="text-destructive size-8" />
          <h1 className="text-3xl font-bold">{t("deleteAccount")}</h1>
        </div>
        <p className="text-muted-foreground">{t("deleteAccountPageDescription")}</p>
      </div>

      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6">
        <h2 className="text-destructive mb-4 text-xl font-semibold">{t("deleteAccountWarning")}</h2>
        <ul className="text-muted-foreground mb-6 list-disc space-y-2 pl-5">
          <li>{t("deleteAccountWarning1")}</li>
          <li>{t("deleteAccountWarning2")}</li>
          <li>{t("deleteAccountWarning3")}</li>
        </ul>
        {error && (
          <div className="bg-destructive/20 text-destructive mb-4 rounded-md p-3 text-sm">
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

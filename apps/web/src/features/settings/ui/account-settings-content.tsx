"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Trash2, ChevronRight, ArrowLeft } from "lucide-react";

export function AccountSettingsContent() {
  const pathname = usePathname();
  const t = useTranslations("settings");

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/settings"
        className="mb-4 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        <span>{t("backToSettings")}</span>
      </Link>

      <h1 className="mb-2 text-3xl font-bold">{t("account")}</h1>
      <p className="mb-8 text-muted-foreground">{t("accountPageDescription")}</p>

      <div className="space-y-1">
        <Link href="/settings/account/delete-account" className="block">
          <div
            className={`flex w-full items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent ${
              pathname === "/settings/account/delete-account" ? "bg-accent" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <Trash2 className="size-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{t("deleteAccount")}</div>
                <div className="text-sm text-muted-foreground">{t("deleteAccountDescription")}</div>
              </div>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </div>
        </Link>
      </div>
    </div>
  );
}


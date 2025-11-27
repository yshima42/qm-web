"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  User,
  Globe,
  FileText,
  Shield,
  Mail,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import LocaleSwitcher from "@/components/ui/locale-switcher";

export function SettingsContent() {
  const router = useRouter();
  const t = useTranslations("settings");

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const settingsItems = [
    {
      id: "account",
      icon: User,
      label: t("account"),
      href: "/settings/account",
      description: t("accountDescription"),
    },
    {
      id: "language",
      icon: Globe,
      label: t("language"),
      href: null,
      description: t("languageDescription"),
      isCustom: true,
    },
    {
      id: "terms",
      icon: FileText,
      label: t("termsOfService"),
      href: "https://about.quitmate.app/ja/terms",
      description: t("termsDescription"),
      external: true,
    },
    {
      id: "privacy",
      icon: Shield,
      label: t("privacyPolicy"),
      href: "https://about.quitmate.app/ja/privacy",
      description: t("privacyDescription"),
      external: true,
    },
    {
      id: "contact",
      icon: Mail,
      label: t("contact"),
      href: "https://about.quitmate.app/ja/contact",
      description: t("contactDescription"),
      external: true,
    },
    {
      id: "logout",
      icon: LogOut,
      label: t("logout"),
      href: null,
      description: t("logoutDescription"),
      isAction: true,
      onClick: handleLogout,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-2 text-3xl font-bold">{t("title")}</h1>
      <p className="mb-8 text-muted-foreground">{t("subtitle")}</p>

      <div className="space-y-1">
        {settingsItems.map((item) => {
          const Icon = item.icon;

          if (item.isCustom) {
            // 言語設定
            return (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent"
              >
                <div className="flex items-center gap-4">
                  <Icon className="size-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                </div>
                <LocaleSwitcher />
              </div>
            );
          }

          if (item.isAction) {
            // ログアウト
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className="flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors hover:bg-accent"
              >
                <div className="flex items-center gap-4">
                  <Icon className="size-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </button>
            );
          }

          // 通常のリンク
          const content = (
            <div className="flex w-full items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent">
              <div className="flex items-center gap-4">
                <Icon className="size-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-sm text-muted-foreground">{item.description}</div>
                </div>
              </div>
              <ChevronRight className="size-4 text-muted-foreground" />
            </div>
          );

          if (item.external) {
            return (
              <a
                key={item.id}
                href={item.href!}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {content}
              </a>
            );
          }

          return (
            <Link key={item.id} href={item.href!} className="block">
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}


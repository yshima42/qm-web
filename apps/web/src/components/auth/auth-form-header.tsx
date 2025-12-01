"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { CardDescription, CardHeader } from "@/components/ui/card_mail";

type AuthFormHeaderProps = {
  subtitleKey: "login" | "signUp";
  descriptionKey: "login" | "signUp";
};

export function AuthFormHeader({ subtitleKey, descriptionKey }: AuthFormHeaderProps) {
  const t = useTranslations("auth");
  const subtitle = t(`${subtitleKey}.subtitle`);
  const description = t(`${descriptionKey}.description`);

  return (
    <CardHeader className="space-y-4 pb-4">
      {/* ロゴとサブタイトル */}
      <div className="flex flex-col items-center gap-0.5">
        <Link href="/" className="flex items-end gap-1">
          <Image
            src="/images/icon-web.png"
            alt="QuitMate Logo"
            width={32}
            height={32}
            className="h-10 w-auto"
          />
          <span className="text-3xl font-medium leading-tight">QuitMate</span>
        </Link>
        <p className="text-muted-foreground -mt-0.5 text-sm">{subtitle}</p>
      </div>
      {/* 説明 */}
      <div className="text-center">
        <CardDescription className="text-base">{description}</CardDescription>
      </div>
    </CardHeader>
  );
}

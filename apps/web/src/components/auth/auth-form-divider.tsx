"use client";

import { useTranslations } from "next-intl";

type AuthFormDividerProps = {
  translationKey: "login" | "signUp";
};

export function AuthFormDivider({ translationKey }: AuthFormDividerProps) {
  const t = useTranslations("auth");
  const orText = t(`${translationKey}.or`);

  return (
    <div className="relative my-2">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background text-muted-foreground px-2">{orText}</span>
      </div>
    </div>
  );
}

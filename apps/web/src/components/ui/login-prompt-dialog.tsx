"use client";

import { Heart } from "lucide-react";
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

type LoginPromptDialogProps = {
  children: ReactNode;
  className?: string;
  type?: "story" | "article";
};

export function LoginPromptDialog({ children, className, type = "story" }: LoginPromptDialogProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("login-prompt");

  const title = type === "article" ? t("article-title") : t("story-title");
  const description = type === "article" ? t("article-description") : t("story-description");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className={className}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center">
          <Heart className="mb-2 size-12 fill-pink-500 text-pink-500" />
          <DialogTitle className="text-center text-xl">{title}</DialogTitle>
          <DialogDescription className="text-center">{description}</DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-3">
          <Button asChild className="w-full" variant="outline">
            <Link href="/auth/login">{t("login")}</Link>
          </Button>
          <Button asChild className="w-full">
            <Link href="/auth/sign-up">{t("sign-up")}</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

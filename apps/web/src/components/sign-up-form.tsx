"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card_mail";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { SocialLoginButtons } from "@/components/social-login-buttons";
import { AuthFormHeader } from "@/components/auth/auth-form-header";

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const t = useTranslations("auth.signUp");

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <AuthFormHeader subtitleKey="signUp" descriptionKey="signUp" />
        <CardContent>
          <div className="flex flex-col gap-4">
            <SocialLoginButtons
              loadingText={{
                google: t("signingUp"),
                apple: t("signingUp"),
              }}
              buttonText={{
                google: t("continueWithGoogle"),
                apple: t("continueWithApple"),
              }}
            />
            <div className="mt-4 text-center text-sm">
              <div>{t("alreadyHaveAccount")}</div>
              <Link href="/auth/login" className="underline underline-offset-4">
                {t("login")}
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

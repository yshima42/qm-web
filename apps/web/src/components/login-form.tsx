"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button_mail";
import { Card, CardContent } from "@/components/ui/card_mail";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { SocialLoginButtons } from "@/components/social-login-buttons";
import { AuthFormHeader } from "@/components/auth/auth-form-header";
import { AuthFormDivider } from "@/components/auth/auth-form-divider";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("auth.login");

  const handleEmailNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPassword) {
      setShowPassword(true);
      return;
    }
    // パスワードが入力されている場合はログイン処理
    await handleLogin(e);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/protected");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <AuthFormHeader subtitleKey="login" descriptionKey="login" />
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* ソーシャルログインボタン */}
            <SocialLoginButtons
              isLoading={isLoading}
              onError={setError}
              loadingText={{
                google: t("loggingIn"),
                apple: t("loggingIn"),
              }}
              buttonText={{
                google: t("continueWithGoogle"),
                apple: t("continueWithApple"),
              }}
            />

            {/* 区切り線 */}
            <AuthFormDivider translationKey="login" />

            {/* メールログインフォーム */}
            <form onSubmit={handleEmailNext}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t("emailLabel")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {showPassword && (
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">{t("passwordLabel")}</Label>
                      <Link
                        href="/auth/forgot-password"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        {t("forgotPassword")}
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                )}

                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t("loggingIn") : showPassword ? t("login") : t("next")}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                <div>{t("noAccount")}</div>
                <Link href="/auth/sign-up" className="underline underline-offset-4">
                  {t("signUp")}
                </Link>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

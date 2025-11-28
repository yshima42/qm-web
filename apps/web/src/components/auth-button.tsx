import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";

export async function AuthButton() {
  const supabase = await createClient();
  const t = await getTranslations("login-prompt");

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  // ログインしている場合は何も表示しない（サイドバーに設定があるため）
  if (user) {
    return null;
  }

  // ログインしていない場合のみログインボタンを表示
  return (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href="/auth/login">{t("login")}</Link>
      </Button>
      <Button asChild size="sm" variant="default">
        <Link href="/auth/sign-up">{t("sign-up")}</Link>
      </Button>
    </div>
  );
}

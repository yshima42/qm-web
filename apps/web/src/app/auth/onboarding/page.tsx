import { generateUserName } from "@/features/profiles/lib/user-name";
import LocaleSwitcher from "@/components/ui/locale-switcher";
import { ProfileOnboardingForm } from "@/features/profiles/ui/onboarding-form";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

type OnboardingPageProps = {
  searchParams?: Promise<{ next?: string }>;
};

export default async function OnboardingPage({
  searchParams,
}: OnboardingPageProps) {
  const supabase = await createClient();
  const t = await getTranslations("onboarding");
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const nextParam = resolvedSearchParams?.next;
  const nextPath =
    nextParam && nextParam.startsWith("/")
      ? nextParam
      : "/stories/habits/alcohol";

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (profile) {
    redirect(nextPath);
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex justify-end pb-4">
          <LocaleSwitcher />
        </div>
        <div className="rounded-2xl border border-border bg-background/90 p-6 shadow-2xl">
          <div className="mb-8 space-y-3 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              {t("hero.badge")}
            </span>
            <h1 className="text-2xl font-semibold text-foreground">
              {t("hero.title")}
            </h1>
            <p className="text-sm text-muted-foreground">{t("hero.subtitle")}</p>
          </div>
          <ProfileOnboardingForm
            next={nextPath}
            defaultUserName={generateUserName(user.id)}
          />
        </div>
      </div>
    </div>
  );
}


import { Logo } from "@quitmate/ui";
import { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import { Header } from "@/components/layout/header";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MutedAccountsContent } from "@/features/settings/ui/muted-accounts-content";
import { fetchMutedUsers, fetchProfileByUsername } from "@/features/profiles/data/data";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserUsername } from "@/lib/utils/page-helpers";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("settings");
  return {
    title: t("mutedAccounts"),
  };
}

export default async function MutedAccountsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const mutedUsers = await fetchMutedUsers();

  // ヘッダー用のプロフィール情報
  const currentUserUsername = await getCurrentUserUsername();
  const currentUserProfile = currentUserUsername
    ? await fetchProfileByUsername(currentUserUsername)
    : null;

  return (
    <>
      <Header titleElement={<Logo />} currentUserProfile={currentUserProfile} />
      <Suspense fallback={<LoadingSpinner fullHeight />}>
        <main className="p-3 sm:p-5">
          <MutedAccountsContent initialMutedUsers={mutedUsers} />
        </main>
      </Suspense>
    </>
  );
}

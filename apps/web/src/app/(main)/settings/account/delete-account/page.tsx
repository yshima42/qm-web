import { Logo } from "@quitmate/ui";
import { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Header } from "@/components/layout/header";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { DeleteAccountContent } from "@/features/settings/ui/delete-account-content";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserUsername } from "@/lib/utils/page-helpers";
import { fetchProfileByUsername } from "@/features/profiles/data/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("settings");
  return {
    title: t("deleteAccount"),
  };
}

export default async function DeleteAccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

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
          <DeleteAccountContent />
        </main>
      </Suspense>
    </>
  );
}

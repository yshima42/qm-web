import { Logo } from "@quitmate/ui";
import { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { redirect } from "next/navigation";

import { PageWithSidebar } from "@/components/layout/page-with-sidebar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { HabitsProvider } from "@/features/habits/providers/habits-provider";
import { getCurrentUserHabits } from "@/lib/utils/page-helpers";
import { MutedAccountsContent } from "@/features/settings/ui/muted-accounts-content";
import { fetchMutedUsers } from "@/features/profiles/data/data";
import { createClient } from "@/lib/supabase/server";

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

  const habits = await getCurrentUserHabits();
  const mutedUsers = await fetchMutedUsers();

  return (
    <HabitsProvider habits={habits}>
      <PageWithSidebar
        headerProps={{
          titleElement: <Logo />,
        }}
      >
        <Suspense fallback={<LoadingSpinner fullHeight />}>
          <main className="p-3 sm:p-5">
            <MutedAccountsContent initialMutedUsers={mutedUsers} />
          </main>
        </Suspense>
      </PageWithSidebar>
    </HabitsProvider>
  );
}

import { Logo } from "@quitmate/ui";
import { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { PageWithSidebar } from "@/components/layout/page-with-sidebar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { HabitsProvider } from "@/features/habits/providers/habits-provider";
import { createClient } from "@/lib/supabase/server";
import { fetchHabits } from "@/features/habits/data/data";
import { SettingsContent } from "@/features/settings/ui/settings-content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("settings");
  return {
    title: t("title"),
  };
}

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const habits = user ? await fetchHabits(user.id) : [];

  return (
    <HabitsProvider habits={habits}>
      <PageWithSidebar
        headerProps={{
          titleElement: <Logo />,
        }}
      >
        <Suspense fallback={<LoadingSpinner fullHeight />}>
          <main className="p-3 sm:p-5">
            <SettingsContent />
          </main>
        </Suspense>
      </PageWithSidebar>
    </HabitsProvider>
  );
}


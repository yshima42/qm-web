import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { PageWithSidebar } from "@/components/layout/page-with-sidebar";
import { HabitsProvider } from "@/features/habits/providers/habits-provider";
import { createClient } from "@/lib/supabase/server";
import { fetchHabits } from "@/features/habits/data/data";

import { HabitsPageClient } from "./habits-page-client";

export default async function HabitsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const habits = await fetchHabits(user.id);
  const t = await getTranslations("sidebar");

  return (
    <HabitsProvider habits={habits}>
      <PageWithSidebar
        headerProps={{
          title: t("habits"),
        }}
        className="bg-background min-h-screen"
      >
        <main className="container mx-auto px-4 py-6">
          <HabitsPageClient habits={habits} />
        </main>
      </PageWithSidebar>
    </HabitsProvider>
  );
}

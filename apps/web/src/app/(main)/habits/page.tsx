import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Header } from "@/components/layout/header";
import { createClient } from "@/lib/supabase/server";
import { fetchHabits } from "@/features/habits/data/data";
import { getCurrentUserUsername } from "@/lib/utils/page-helpers";
import { fetchProfileByUsername } from "@/features/profiles/data/data";

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

  // ヘッダー用のプロフィール情報
  const currentUserUsername = await getCurrentUserUsername();
  const currentUserProfile = currentUserUsername
    ? await fetchProfileByUsername(currentUserUsername)
    : null;

  return (
    <div className="bg-background min-h-screen">
      <Header title={t("habits")} currentUserProfile={currentUserProfile} />
      <main className="container mx-auto px-4 py-6">
        <HabitsPageClient habits={habits} />
      </main>
    </div>
  );
}

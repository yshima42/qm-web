import { redirect } from "next/navigation";

import { Header } from "@/components/layout/header";
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

  return (
    <div className="min-h-screen bg-background">
      <Header title="習慣" />
      <main className="container mx-auto px-4 py-6">
        <HabitsPageClient habits={habits} />
      </main>
    </div>
  );
}

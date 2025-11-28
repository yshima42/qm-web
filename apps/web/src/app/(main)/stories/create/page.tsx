import { Header } from "@/components/layout/header";
import { StoryCreateForm } from "@/features/stories/ui/story-create-form";
import { createClient } from "@/lib/supabase/server";
import { fetchHabits } from "@/features/habits/data/data";
import { redirect } from "next/navigation";
import { getCurrentUserUsername } from "@/lib/utils/page-helpers";
import { fetchProfileByUsername } from "@/features/profiles/data/data";

export default async function CreateStoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const habits = await fetchHabits(user.id);

  // ヘッダー用のプロフィール情報
  const currentUserUsername = await getCurrentUserUsername();
  const currentUserProfile = currentUserUsername
    ? await fetchProfileByUsername(currentUserUsername)
    : null;

  return (
    <>
      <Header title="Create New Story" currentUserProfile={currentUserProfile} />
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <StoryCreateForm habits={habits} />
      </div>
    </>
  );
}

import { StoryCreateForm } from "@/features/stories/ui/story-create-form";
import { createClient } from "@/lib/supabase/server";
import { fetchHabits } from "@/features/habits/data/data";
import { redirect } from "next/navigation";

export default async function CreateStoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const habits = await fetchHabits(user.id);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Create New Story</h1>
      <StoryCreateForm habits={habits} />
    </div>
  );
}

import { createClient } from "@/utils/supabase/server";
import { StoryTileDto } from "@/lib/types";
import { StoryTile } from "@/components/stories/story-tile";

export default async function Page() {
  // 後でデータ取得ロジックを別ファイルに。
  const supabase = await createClient();
  const { data: stories } = (await supabase
    .from("stories")
    .select(
      "*, habit_categories!inner(habit_category_name), profiles!stories_user_id_fkey(user_name, display_name, avatar_url), likes(count), comments(count)"
    )
    .order("created_at", { ascending: false })
    .limit(10)) as { data: StoryTileDto[] };

  return (
    <div className="max-w-2xl mx-auto">
      {stories.map((story) => (
        <StoryTile key={story.id} story={story} />
      ))}
    </div>
  );
}

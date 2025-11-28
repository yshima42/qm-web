import { AppDownloadSection } from "@quitmate/ui";

import { StoryTileDto, HabitTileDto } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

import { enrichStoriesWithLikeStatus } from "@/features/stories/data/data";

import { StoryTile } from "./story-tile";
import { StoryInlineForm } from "./story-inline-form";

type StoryListProps = {
  fetchStoriesFunc: () => Promise<StoryTileDto[]>;
  displayName?: string;
  habits?: HabitTileDto[];
};

export async function StoryList({ fetchStoriesFunc, habits }: StoryListProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  const stories = await fetchStoriesFunc();

  // ログイン時はいいね状態を付与
  const storiesWithLikeStatus = isLoggedIn ? await enrichStoriesWithLikeStatus(stories) : stories;

  return (
    <div className="mx-auto max-w-2xl">
      {habits && habits.length > 0 && <StoryInlineForm habits={habits} />}

      {storiesWithLikeStatus.map((story) => (
        <StoryTile key={story.id} story={story} isLoggedIn={isLoggedIn} currentUserId={user?.id} />
      ))}

      <div className="mt-8">
        <AppDownloadSection />
      </div>
    </div>
  );
}

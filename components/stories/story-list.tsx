import { StoryTileDto } from "@/lib/types";
import { StoryTile } from "./story-tile";

type StoryListProps = {
  fetchStoriesFunc: () => Promise<StoryTileDto[]>;
};

export async function StoryList({ fetchStoriesFunc }: StoryListProps) {
  const stories = await fetchStoriesFunc();

  return (
    <div className="max-w-2xl mx-auto">
      {stories.map((story) => (
        <StoryTile key={story.id} story={story} />
      ))}
    </div>
  );
}

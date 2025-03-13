import { StoryTile } from "@/components/stories/story-tile";
import { fetchStories } from "@/lib/data";

export default async function Page() {
  const stories = await fetchStories();

  return (
    <div className="max-w-2xl mx-auto">
      {stories.map((story) => (
        <StoryTile key={story.id} story={story} />
      ))}
    </div>
  );
}

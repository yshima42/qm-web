import { StoryList } from '@/components/stories/story-list';
import { fetchStories } from '@/lib/data';

export default function Page() {
  return <StoryList fetchStoriesFunc={fetchStories} />;
}

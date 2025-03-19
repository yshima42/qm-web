import { fetchStories } from '@/lib/data';

import { StoryList } from '@/features/stories/story-list';

export default function Page() {
  return <StoryList fetchStoriesFunc={fetchStories} />;
}

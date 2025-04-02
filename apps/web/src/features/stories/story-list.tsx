import { AppDownloadSection } from '@quitmate/ui';

import { StoryTileDto } from '@/lib/types';

import { StoryTile } from './story-tile';

type StoryListProps = {
  fetchStoriesFunc: () => Promise<StoryTileDto[]>;
  displayName?: string;
};

export async function StoryList({ fetchStoriesFunc }: StoryListProps) {
  const stories = await fetchStoriesFunc();

  return (
    <div className="mx-auto max-w-2xl">
      {stories.map((story) => (
        <StoryTile key={story.id} story={story} />
      ))}

      <div className="mt-8">
        <AppDownloadSection />
      </div>
    </div>
  );
}

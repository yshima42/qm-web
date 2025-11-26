import { AppDownloadSection } from '@quitmate/ui';

import { StoryTileDto, HabitTileDto } from '@/lib/types';

import { StoryTile } from './story-tile';
import { StoryInlineForm } from './story-inline-form';

type StoryListProps = {
  fetchStoriesFunc: () => Promise<StoryTileDto[]>;
  displayName?: string;
  habits?: HabitTileDto[];
};

export async function StoryList({ fetchStoriesFunc, habits }: StoryListProps) {
  const stories = await fetchStoriesFunc();

  return (
    <div className="mx-auto max-w-2xl">
      {habits && habits.length > 0 && <StoryInlineForm habits={habits} />}
      
      {stories.map((story) => (
        <StoryTile key={story.id} story={story} />
      ))}

      <div className="mt-8">
        <AppDownloadSection />
      </div>
    </div>
  );
}


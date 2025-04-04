import { AppDownloadSection } from '@quitmate/ui';

import { StoryTileDto } from '@/lib/types';

import { createClient } from '@/utils/supabase/server';

import { StoryTile } from './story-tile';

type StoryListProps = {
  fetchStoriesFunc: () => Promise<StoryTileDto[]>;
  displayName?: string;
};

export async function StoryList({ fetchStoriesFunc }: StoryListProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-12">
        <AppDownloadSection message="IOS / Androidアプリのインストールはこちらから" />
      </div>
    );
  }

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

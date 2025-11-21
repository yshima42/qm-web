import { Tabs, TabsContent, TabsList, TabsTrigger } from '@quitmate/ui';

import { fetchCommentedStoriesByUserId, fetchStoriesByUserId } from '@/lib/data';
import { Profile } from '@/lib/types';

import { StoryList } from '../stories/story-list';

type Props = {
  profile: Profile;
};

export function ProfileTabs({ profile }: Props) {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="comments">Comments</TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        <StoryList fetchStoriesFunc={() => fetchStoriesByUserId(profile.id)} />
      </TabsContent>
      <TabsContent value="comments">
        <StoryList fetchStoriesFunc={() => fetchCommentedStoriesByUserId(profile.id)} />
      </TabsContent>
    </Tabs>
  );
}


import { Tabs, TabsContent, TabsList, TabsTrigger } from '@quitmate/ui';
import { useTranslations } from 'next-intl';

import { fetchCommentedStoriesByUserId, fetchStoriesByUserId } from '@/lib/data';
import { Profile } from '@/lib/types';

import { StoryList } from '../stories/story-list';

type Props = {
  profile: Profile;
};

export function ProfileTabs({ profile }: Props) {
  const t = useTranslations('profile-page');

  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="posts">{t('posts')}</TabsTrigger>
        <TabsTrigger value="comments">{t('comments')}</TabsTrigger>
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

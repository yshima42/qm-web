import { Tabs, TabsContent, TabsList, TabsTrigger } from '@quitmate/ui';
import { notFound } from 'next/navigation';

import { Header } from '@/components/layout/header';

import { fetchCommentedStoriesByUserId, fetchProfileById, fetchStoriesByUserId } from '@/lib/data';

import { ProfileHeader } from '@/features/profiles/profile-header';
import { StoryList } from '@/features/stories/story-list';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  // 後で子コンポーネントに移動し、suspenseで読み込む
  // const story = await fetchStoryById(id);
  // const comments = await fetchCommentsByStoryId(id);

  const profile = await fetchProfileById(id);
  if (!profile) notFound();

  return (
    <>
      <Header title="プロフィール" />
      <main className="p-3 sm:p-5">
        <ProfileHeader profile={profile} />
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts">投稿</TabsTrigger>
            <TabsTrigger value="comments">コメント</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <StoryList fetchStoriesFunc={() => fetchStoriesByUserId(id)} />
          </TabsContent>
          <TabsContent value="comments">
            <StoryList fetchStoriesFunc={() => fetchCommentedStoriesByUserId(id)} />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}

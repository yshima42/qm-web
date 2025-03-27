import { Tabs, TabsContent, TabsList, TabsTrigger } from '@quitmate/ui';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Header } from '@/components/layout/header';

import {
  fetchCommentedStoriesByUserId,
  fetchProfileByUsername,
  fetchStoriesByUserId,
} from '@/lib/data';

import { ProfileHeader } from '@/features/profiles/profile-header';
import { StoryList } from '@/features/stories/story-list';

type Props = {
  params: { user_name: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user_name = params.user_name;
  const profile = await fetchProfileByUsername(user_name);

  if (!profile) {
    return {
      title: 'ユーザーが見つかりません',
    };
  }

  return {
    title: `${profile.display_name} on QuitMate`,
    description: profile.bio ?? `${profile.display_name}のプロフィールページです。`,
  };
}

export default async function Page(props: { params: Promise<{ user_name: string }> }) {
  const params = await props.params;
  const user_name = params.user_name;
  // 後で子コンポーネントに移動し、suspenseで読み込む
  // const story = await fetchStoryById(id);
  // const comments = await fetchCommentsByStoryId(id);

  console.log('user_name', user_name);

  const profile = await fetchProfileByUsername(user_name);
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
            <StoryList fetchStoriesFunc={() => fetchStoriesByUserId(profile.id)} />
          </TabsContent>
          <TabsContent value="comments">
            <StoryList fetchStoriesFunc={() => fetchCommentedStoriesByUserId(profile.id)} />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Header } from '@/components/layout/header';

import { fetchStoryById, fetchCommentsByStoryId } from '@/lib/data';

import { CommentTile } from '@/features/stories/comment-tile';
import { StoryTile } from '@/features/stories/story-tile';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const story = await fetchStoryById(id);

  if (!story) {
    return {
      title: 'ストーリーが見つかりません',
    };
  }

  return {
    title: `${story.profiles.display_name} | QuitMate`,
    description: story.content.substring(0, 300) || 'ストーリー詳細ページです',
  };
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  // 後で子コンポーネントに移動し、suspenseで読み込む
  const story = await fetchStoryById(id);
  const comments = await fetchCommentsByStoryId(id);

  if (!story) notFound();

  return (
    <>
      <Header title="ストーリー詳細" />
      <main className="p-3 sm:p-5">
        <StoryTile story={story} disableLink showFullContent />
        <div className="mt-4">
          {comments.map((comment) => (
            <CommentTile key={comment.id} comment={comment} />
          ))}
        </div>
      </main>
    </>
  );
}

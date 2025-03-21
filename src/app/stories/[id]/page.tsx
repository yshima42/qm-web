import { notFound } from 'next/navigation';

import { Header } from '@/components/layout/header';

import { fetchStoryById, fetchCommentsByStoryId } from '@/lib/data';

import { CommentTile } from '@/features/stories/comment-tile';
import { StoryTile } from '@/features/stories/story-tile';

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
        <StoryTile story={story} />
        <div className="mt-4">
          {comments.map((comment) => (
            <CommentTile key={comment.id} comment={comment} />
          ))}
        </div>
      </main>
    </>
  );
}

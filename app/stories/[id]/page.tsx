import { notFound } from 'next/navigation';

import { CommentTile } from '@/components/stories/comment-tile';
import { StoryTile } from '@/components/stories/story-tile';

import { fetchStoryById, fetchCommentsByStoryId } from '@/lib/data';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  // 後で子コンポーネントに移動し、suspenseで読み込む
  const story = await fetchStoryById(id);
  const comments = await fetchCommentsByStoryId(id);

  if (!story) notFound();

  return (
    <main>
      <StoryTile story={story} />
      <div className="mt-4">
        {comments.map((comment) => (
          <CommentTile key={comment.id} comment={comment} />
        ))}
      </div>
    </main>
  );
}

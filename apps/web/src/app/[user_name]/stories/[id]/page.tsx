import { AppDownloadSection, Logo } from '@quitmate/ui';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { Header } from '@/components/layout/header';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

import {
  fetchStoryById,
  fetchCommentsByStoryId,
  fetchStoryDetailPageStaticParams,
} from '@/lib/data';

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

  // ストーリー内容から短い抜粋を作成
  const description = story.content.substring(0, 300) || 'ストーリー詳細ページです';

  // プロフィール画像URLを取得（存在する場合）
  const profileImageUrl = story.profiles.avatar_url ?? null;

  return {
    title: story.profiles.display_name,
    description: description,
    openGraph: {
      title: story.profiles.display_name,
      description: description,
      type: 'article',
      // プロフィール画像があれば小さいサイズで表示
      ...(profileImageUrl && {
        images: [
          {
            url: profileImageUrl,
            width: 100,
            height: 100,
            alt: `${story.profiles.display_name}のプロフィール画像`,
          },
        ],
      }),
      publishedTime: story.created_at,
      authors: [story.profiles.display_name],
    },
    twitter: {
      card: 'summary', // summaryにすることで小さめに表示
      title: story.profiles.display_name,
      description: description,
      ...(profileImageUrl && { images: [profileImageUrl] }),
      creator: `@${story.profiles.user_name}`,
    },
  };
}

// @/lib/で定数を定義しここで利用したらエラーが起きたのでベタがき
export const revalidate = 60;

// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true; // or false, to 404 on unknown paths

export async function generateStaticParams() {
  try {
    const stories = await fetchStoryDetailPageStaticParams(10);

    // storiesがnullまたは空配列の場合は空配列を返す
    if (!Array.isArray(stories) || stories.length === 0) {
      console.log('No stories found or invalid data returned');
      return [];
    }

    // 必要なプロパティが存在することを確認
    return stories.map((story) => ({
      id: String(story.id),
      user_name: story.profiles.user_name,
    }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; user_name: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const story = await fetchStoryById(id);
  const comments = await fetchCommentsByStoryId(id);

  if (!story) notFound();

  return (
    <>
      <Header titleElement={<Logo />} />
      <Suspense fallback={<LoadingSpinner />}>
        <main className="p-3 sm:p-5">
          <StoryTile story={story} disableLink showFullContent />
          {comments && comments.length > 0 && (
            <div className="mt-4">
              {comments.map((comment) => (
                <CommentTile key={comment.id} comment={comment} />
              ))}
            </div>
          )}

          {/* アプリダウンロードセクションをコンポーネントに置き換え */}
          <AppDownloadSection
            message={`${story.profiles.display_name}さんを\nアプリでフォローしよう`}
          />
        </main>
      </Suspense>
    </>
  );
}

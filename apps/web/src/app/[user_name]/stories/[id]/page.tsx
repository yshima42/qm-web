import { AppDownloadSection, Logo } from '@quitmate/ui';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { Header } from '@/components/layout/header';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

import { createClient } from '@/lib/supabase/server';

import {
  fetchStoryById,
  fetchCommentsByStoryId,
  fetchStoryDetailPageStaticParams,
  checkIsLikedByMe,
} from '@/features/stories/data/data';

import { CommentForm } from '@/features/stories/ui/comment-form';
import { CommentTile } from '@/features/stories/ui/comment-tile';
import { StoryTile } from '@/features/stories/ui/story-tile';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const story = await fetchStoryById(id);

  if (!story) {
    return {
      title: 'Story not found',
    };
  }

  // ストーリー内容から短い抜粋を作成
  const description = story.content.substring(0, 300) || 'Story detail page';

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
            alt: `${story.profiles.display_name}'s profile image`,
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

  // 並列でデータ取得
  const [story, comments, supabase] = await Promise.all([
    fetchStoryById(id),
    fetchCommentsByStoryId(id),
    createClient(),
  ]);

  if (!story) notFound();

  // ログイン状態を取得
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  // いいね状態を取得（ログイン時のみ）
  const isLikedByMe = isLoggedIn ? await checkIsLikedByMe(id) : false;

  // storyにisLikedByMeを付与
  const storyWithLikeStatus = { ...story, isLikedByMe };

  return (
    <>
      <Header titleElement={<Logo />} />
      <Suspense fallback={<LoadingSpinner />}>
        <main className="p-3 sm:p-5">
          <StoryTile
            story={storyWithLikeStatus}
            disableLink
            showFullContent
            isLoggedIn={isLoggedIn}
          />

          {/* コメントフォーム（ログイン時のみ表示） */}
          {isLoggedIn && <CommentForm storyId={id} />}

          {/* コメント一覧 */}
          {comments && comments.length > 0 && (
            <div className="mt-4">
              {comments.map((comment) => (
                <CommentTile key={comment.id} comment={comment} />
              ))}
            </div>
          )}

          {/* App download section */}
          <AppDownloadSection />
        </main>
      </Suspense>
    </>
  );
}

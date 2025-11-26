import { Logo } from '@quitmate/ui';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { Header } from '@/components/layout/header';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

import { fetchProfileByUsername, fetchProfilePageStaticParams } from '@/lib/data';

import { ProfileHeader } from '@/features/profiles/profile-header';
import { ProfileTabs } from '@/features/profiles/profile-tabs';

type Props = {
  params: Promise<{ user_name: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const user_name = resolvedParams.user_name;
  const profile = await fetchProfileByUsername(user_name);

  if (!profile) {
    return {
      title: 'ユーザーが見つかりません',
    };
  }

  const description = profile.bio ?? `${profile.display_name}のプロフィールページです。`;
  const profileImage = profile.avatar_url ?? '/images/ogp.png';

  return {
    title: profile.display_name,
    description: description,
    openGraph: {
      title: profile.display_name,
      description: description,
      type: 'website',
      images: [
        {
          url: profileImage,
          width: 1200,
          height: 630,
          alt: `${profile.display_name}のプロフィール画像`,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: profile.display_name,
      description: description,
      images: [profileImage],
      creator: `@${profile.user_name}`,
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
  const usernames = await fetchProfilePageStaticParams(10);
  return usernames.map((username) => ({
    user_name: username.user_name,
  }));
}

export default async function Page(props: { params: Promise<{ user_name: string }> }) {
  const params = await props.params;
  const user_name = params.user_name;
  // 後で子コンポーネントに移動し、suspenseで読み込む
  // const story = await fetchStoryById(id);
  // const comments = await fetchCommentsByStoryId(id);

  const profile = await fetchProfileByUsername(user_name);
  if (!profile) notFound();

  return (
    <>
      <Header titleElement={<Logo />} />
      <Suspense fallback={<LoadingSpinner fullHeight />}>
        <main className="p-3 sm:p-5">
          <ProfileHeader profile={profile} />
          <ProfileTabs profile={profile} />
        </main>
      </Suspense>
    </>
  );
}

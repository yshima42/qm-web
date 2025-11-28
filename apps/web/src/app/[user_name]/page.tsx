import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PageWithSidebar } from "@/components/layout/page-with-sidebar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { HabitsProvider } from "@/features/habits/providers/habits-provider";
import { getCurrentUserHabits, getCurrentUserUsername } from "@/lib/utils/page-helpers";
import { createClient } from "@/lib/supabase/server";

import {
  fetchProfileByUsername,
  fetchProfilePageStaticParams,
  checkIsFollowing,
  checkIsMuted,
} from "@/features/profiles/data/data";

import { ProfileHeader } from "@/features/profiles/ui/profile-header";
import { ProfileTabs } from "@/features/profiles/ui/profile-tabs";

type Props = {
  params: Promise<{ user_name: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const user_name = resolvedParams.user_name;
  const profile = await fetchProfileByUsername(user_name);

  if (!profile) {
    return {
      title: "User not found",
    };
  }

  const description = profile.bio ?? `${profile.display_name}'s profile page.`;
  const profileImage = profile.avatar_url ?? "/images/ogp.png";

  return {
    title: profile.display_name,
    description: description,
    openGraph: {
      title: profile.display_name,
      description: description,
      type: "website",
      images: [
        {
          url: profileImage,
          width: 1200,
          height: 630,
          alt: `${profile.display_name}'s profile image`,
        },
      ],
    },
    twitter: {
      card: "summary",
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

  const profile = await fetchProfileByUsername(user_name);
  if (!profile) notFound();

  // ログイン状態を取得
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  const habits = await getCurrentUserHabits();
  const currentUserUsername = await getCurrentUserUsername();
  const isMyProfile = currentUserUsername === user_name;

  // フォロー状態とミュート状態を取得（ログイン中かつ自分以外の場合のみ）
  const [isFollowing, isMuted] =
    isLoggedIn && !isMyProfile
      ? await Promise.all([checkIsFollowing(profile.id), checkIsMuted(profile.id)])
      : [false, false];

  return (
    <HabitsProvider habits={habits}>
      <PageWithSidebar
        headerProps={{
          title: profile.display_name,
          showBackButton: true,
        }}
      >
        <Suspense fallback={<LoadingSpinner fullHeight />}>
          <main className="p-3 sm:p-5">
            <ProfileHeader
              profile={profile}
              isMyProfile={isMyProfile}
              isLoggedIn={isLoggedIn}
              isFollowing={isFollowing}
              isMuted={isMuted}
            />
            <ProfileTabs
              profile={profile}
              isLoggedIn={isLoggedIn}
              isMuted={isMuted}
              currentUserId={user?.id}
            />
          </main>
        </Suspense>
      </PageWithSidebar>
    </HabitsProvider>
  );
}

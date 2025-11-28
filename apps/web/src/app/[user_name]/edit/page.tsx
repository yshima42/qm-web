import { Logo } from "@quitmate/ui";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

import { PageWithSidebar } from "@/components/layout/page-with-sidebar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getCurrentUserUsername } from "@/lib/utils/page-helpers";

import { fetchProfileByUsername } from "@/features/profiles/data/data";
import { ProfileEditForm } from "@/features/profiles/ui/profile-edit-form";

type Props = {
  params: Promise<{ user_name: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const user_name = resolvedParams.user_name;
  return {
    title: `プロフィール編集 - ${user_name}`,
  };
}

export default async function ProfileEditPage(props: { params: Promise<{ user_name: string }> }) {
  const params = await props.params;
  const user_name = params.user_name;

  // 現在のユーザーを確認
  const currentUserUsername = await getCurrentUserUsername();
  if (currentUserUsername !== user_name) {
    redirect(`/${user_name}`);
  }

  const profile = await fetchProfileByUsername(user_name);
  if (!profile) notFound();

  return (
    <PageWithSidebar
      headerProps={{
        titleElement: <Logo />,
      }}
    >
      <Suspense fallback={<LoadingSpinner fullHeight />}>
        <main className="p-3 sm:p-5">
          <ProfileEditForm profile={profile} />
        </main>
      </Suspense>
    </PageWithSidebar>
  );
}

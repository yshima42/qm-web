"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePullToRefresh } from "@/features/common/hooks/use-pull-to-refresh";
import { PullToRefreshIndicator } from "@/features/common/ui/pull-to-refresh-indicator";
import { ProfileHeader } from "./profile-header";
import { ProfileTabs } from "./profile-tabs";
import type { ProfileTileDto } from "@/lib/types";

type ProfileContentProps = {
  profile: ProfileTileDto;
  isMyProfile: boolean;
  isLoggedIn: boolean;
  isFollowing: boolean;
  isMuted: boolean;
  currentUserId?: string;
};

export function ProfileContent({
  profile,
  isMyProfile,
  isLoggedIn,
  isFollowing,
  isMuted,
  currentUserId,
}: ProfileContentProps) {
  const router = useRouter();
  const tPull = useTranslations("pull-to-refresh");

  const { isRefreshing, pullProgress, shouldShowIndicator } = usePullToRefresh({
    onRefresh: () => router.refresh(),
    enabled: true,
  });

  return (
    <>
      <PullToRefreshIndicator
        isRefreshing={isRefreshing}
        pullProgress={pullProgress}
        shouldShow={shouldShowIndicator}
        idleLabel={tPull("pullToRefresh")}
        refreshingLabel={tPull("refreshing")}
      />
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
        currentUserId={currentUserId}
      />
    </>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePullToRefresh } from "@/features/common/hooks/use-pull-to-refresh";
import { PullToRefreshIndicator } from "@/features/common/ui/pull-to-refresh-indicator";
import { CommentsSection } from "./comments-section";
import { DisabledCommentNotice } from "./disabled-comment-notice";
import { StoryTile } from "./story-tile";
import { TranslatedAppDownloadSection } from "@/components/ui/translated-app-download-section";
import type { StoryTileDto, CommentTileDto } from "@/lib/types";

type StoryDetailContentProps = {
  story: StoryTileDto;
  comments: CommentTileDto[] | null;
  isLoggedIn: boolean;
  canComment: boolean;
  isMyStory: boolean;
  currentUserId?: string;
};

export function StoryDetailContent({
  story,
  comments,
  isLoggedIn,
  canComment,
  isMyStory,
  currentUserId,
}: StoryDetailContentProps) {
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
      <div className="mx-auto max-w-2xl space-y-6">
        <StoryTile
          story={story}
          disableLink
          showFullContent
          isLoggedIn={isLoggedIn}
          currentUserId={currentUserId}
        />

        {story.comment_setting === "disabled" && !isMyStory && <DisabledCommentNotice />}

        <CommentsSection
          storyId={story.id}
          comments={comments}
          isLoggedIn={isLoggedIn}
          canComment={canComment}
          currentUserId={currentUserId}
        />

        <TranslatedAppDownloadSection />
      </div>
    </>
  );
}

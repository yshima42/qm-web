"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { followUser, unfollowUser } from "@/features/profiles/data/actions";

type FollowToggleButtonProps = {
  targetUserId: string;
  initialIsFollowing: boolean;
  className?: string;
};

export function FollowToggleButton({
  targetUserId,
  initialIsFollowing,
  className,
}: FollowToggleButtonProps) {
  const t = useTranslations("follow");
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();
  const [isHovering, setIsHovering] = useState(false);

  const handleClick = () => {
    // Optimistic update
    const previousState = isFollowing;
    setIsFollowing(!isFollowing);

    startTransition(async () => {
      const result = isFollowing
        ? await unfollowUser(targetUserId)
        : await followUser(targetUserId);

      if (!result.success) {
        // Rollback on error
        setIsFollowing(previousState);
        console.error(isFollowing ? "[unfollow] failed:" : "[follow] failed:", result.errorCode);
      }
    });
  };

  // フォロー中のボタンはホバー時に「フォロー解除」表示
  const buttonText = isFollowing ? (isHovering ? t("unfollow") : t("following")) : t("follow");

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={cn(
        "min-w-[100px] rounded-full font-semibold transition-all",
        isFollowing &&
          isHovering &&
          "border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive",
        className,
      )}
    >
      {buttonText}
    </Button>
  );
}

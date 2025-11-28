import { AutoLinkText, DefaultAvatar, AppDownloadDialogTrigger, ShareButton } from "@quitmate/ui";
import Image from "next/image";
import { Pencil } from "lucide-react";

import { ProfileTileDto } from "@/lib/types";
import { ProfileEditDialog } from "./profile-edit-dialog";
import { FollowToggleButton } from "./follow-toggle-button";
import { ProfileOptionsMenu } from "./profile-options-menu";

type Props = {
  profile: ProfileTileDto;
  isMyProfile?: boolean;
  isLoggedIn?: boolean;
  isFollowing?: boolean;
  isMuted?: boolean;
};

export function ProfileHeader({
  profile,
  isMyProfile = false,
  isLoggedIn = false,
  isFollowing = false,
  isMuted = false,
}: Props) {
  return (
    <div className="border-border bg-card relative mb-6 rounded-lg border p-6 shadow-sm">
      <div className="absolute right-4 top-4 flex items-center gap-2">
        {isMyProfile && (
          <ProfileEditDialog profile={profile}>
            <button
              className="text-muted-foreground hover:text-foreground hover:bg-accent flex items-center gap-1 rounded-md p-2 transition-colors"
              title="編集"
            >
              <Pencil className="size-4" />
            </button>
          </ProfileEditDialog>
        )}
        {!isMyProfile && isLoggedIn && (
          <>
            <FollowToggleButton targetUserId={profile.id} initialIsFollowing={isFollowing} />
            <ProfileOptionsMenu targetUserId={profile.id} initialIsMuted={isMuted} />
          </>
        )}
        <div className="[&_button]:size-8 [&_svg]:size-4">
          <ShareButton
            title={`${profile.display_name}'s Profile`}
            text={`${profile.display_name}'s Profile`}
            dialogTitle="Share Profile"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center">
        {/* Avatar image */}
        <div className="mb-4 sm:mb-0 sm:mr-6">
          {profile.avatar_url ? (
            <div className="border-background size-24 overflow-hidden rounded-full border-2">
              <Image
                src={profile.avatar_url}
                alt={profile.display_name}
                width={96}
                height={96}
                className="size-full object-cover"
              />
            </div>
          ) : (
            <DefaultAvatar size="lg" className="border-background border-2" />
          )}
        </div>

        {/* User information */}
        <div className="flex-1">
          <div className="mb-2">
            <h1 className="text-foreground text-2xl font-bold">{profile.display_name}</h1>
            <p className="text-muted-foreground text-sm">@{profile.user_name}</p>
          </div>

          {/* bio */}
          {profile.bio && (
            <p className="text-foreground mb-4 text-sm sm:text-base">
              <AutoLinkText text={profile.bio} />
            </p>
          )}

          {/* Follow information */}
          <AppDownloadDialogTrigger className="cursor-pointer">
            <div className="text-muted-foreground flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-foreground font-semibold">{profile.following}</span>
                <span>Following</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-foreground font-semibold">{profile.followers}</span>
                <span>Followers</span>
              </div>
            </div>
          </AppDownloadDialogTrigger>
        </div>
      </div>
    </div>
  );
}

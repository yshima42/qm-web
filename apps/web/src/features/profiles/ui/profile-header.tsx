import { AutoLinkText, DefaultAvatar, AppDownloadDialogTrigger, ShareButton } from "@quitmate/ui";
import Image from "next/image";

import { ProfileTileDto } from "@/lib/types";

type Props = {
  profile: ProfileTileDto;
};

export function ProfileHeader({ profile }: Props) {
  return (
    <div className="border-border bg-card relative mb-6 rounded-lg border p-6 shadow-sm">
      <ShareButton
        title={`${profile.display_name}'s Profile`}
        text={`${profile.display_name}'s Profile`}
        dialogTitle="Share Profile"
        className="absolute right-4 top-4"
      />
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

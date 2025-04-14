import { AutoLinkText, DefaultAvatar, AppDownloadDialogTrigger, ShareButton } from '@quitmate/ui';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { ProfileTileDto } from '@/lib/types';

type Props = {
  profile: ProfileTileDto;
};

export function ProfileHeader({ profile }: Props) {
  const t = useTranslations('ProfileHeader');

  return (
    <div className="relative mb-6 rounded-lg border border-border bg-card p-6 shadow-sm">
      <ShareButton
        title={`${profile.display_name}${t('shareTitleSuffix')}`}
        text={`${profile.display_name}${t('shareTextSuffix')}`}
        dialogTitle={t('shareDialogTitle')}
        className="absolute right-4 top-4"
      />
      <div className="flex flex-col sm:flex-row sm:items-center">
        {/* アバター画像 */}
        <div className="mb-4 sm:mb-0 sm:mr-6">
          {profile.avatar_url ? (
            <div className="size-24 overflow-hidden rounded-full border-2 border-background">
              <Image
                src={profile.avatar_url}
                alt={profile.display_name}
                width={96}
                height={96}
                className="size-full object-cover"
              />
            </div>
          ) : (
            <DefaultAvatar size="lg" className="border-2 border-background" />
          )}
        </div>

        {/* ユーザー情報 */}
        <div className="flex-1">
          <div className="mb-2">
            <h1 className="text-2xl font-bold text-foreground">{profile.display_name}</h1>
            <p className="text-sm text-muted-foreground">@{profile.user_name}</p>
          </div>

          {/* bio */}
          {profile.bio && (
            <p className="mb-4 text-sm text-foreground sm:text-base">
              <AutoLinkText text={profile.bio} />
            </p>
          )}

          {/* フォロー情報 */}
          <AppDownloadDialogTrigger className="cursor-pointer">
            <div className="flex gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-foreground">{profile.following}</span>
                <span>{t('following')}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-foreground">{profile.followers}</span>
                <span>{t('followers')}</span>
              </div>
            </div>
          </AppDownloadDialogTrigger>
        </div>
      </div>
    </div>
  );
}

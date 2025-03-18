import Image from 'next/image';

import { ProfileTileDto } from '@/lib/types';

type Props = {
  profile: ProfileTileDto;
};

export function ProfileHeader({ profile }: Props) {
  return (
    <div className="relative">
      {/* ヘッダー背景 */}
      <div className="h-48 bg-muted" />

      {/* プロフィール情報 */}
      <div className="mx-auto max-w-5xl px-6">
        {/* アバター画像 */}
        <div className="relative -mt-20 mb-4">
          <div className="size-40 overflow-hidden rounded-full border-4 border-background">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.display_name}
                width={160}
                height={160}
                className="object-cover"
              />
            ) : (
              <div className="size-full bg-muted/50" />
            )}
          </div>
        </div>

        {/* ユーザー情報 */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-foreground">{profile.display_name}</h1>
          <p className="text-lg text-secondary-foreground">@{profile.user_name}</p>
        </div>

        {/* bio */}
        {profile.bio && <p className="mb-6 text-lg text-foreground">{profile.bio}</p>}

        {/* フォロー情報 */}
        <div className="mb-6 flex gap-6 text-lg text-secondary-foreground">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">{profile.following}</span>
            <span>フォロー中</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">{profile.followers}</span>
            <span>フォロワー</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import { ProfileTileDto } from "@/lib/types";

type Props = {
  profile: ProfileTileDto;
};

export function ProfileHeader({ profile }: Props) {
  return (
    <div className="relative">
      {/* ヘッダー背景 */}
      <div className="h-48 bg-gray-200" />

      {/* プロフィール情報 */}
      <div className="px-6 max-w-5xl mx-auto">
        {/* アバター画像 */}
        <div className="relative -mt-20 mb-4">
          <div className="h-40 w-40 rounded-full border-4 border-white overflow-hidden">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.display_name}
                width={160}
                height={160}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300" />
            )}
          </div>
        </div>

        {/* ユーザー情報 */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold">{profile.display_name}</h1>
          <p className="text-gray-600 text-lg">@{profile.user_name}</p>
        </div>

        {/* bio */}
        {profile.bio && (
          <p className="mb-6 text-gray-800 text-lg">{profile.bio}</p>
        )}

        {/* フォロー情報 */}
        <div className="flex gap-6 text-gray-600 mb-6 text-lg">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-xl">
              {profile.following}
            </span>
            <span>フォロー中</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-xl">
              {profile.followers}
            </span>
            <span>フォロワー</span>
          </div>
        </div>
      </div>
    </div>
  );
}

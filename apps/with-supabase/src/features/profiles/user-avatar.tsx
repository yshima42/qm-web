import { DefaultAvatar } from '@quitmate/ui';
import Image from 'next/image';
import Link from 'next/link';

type UserAvatarProps = {
  username?: string;
  displayName?: string;
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  showUsername?: boolean;
  linkable?: boolean;
};

export function UserAvatar({
  username = 'unknown',
  displayName,
  avatarUrl,
  size = 'md',
  showUsername = false,
  linkable = true,
}: UserAvatarProps) {
  // サイズの値をピクセルに変換
  const sizeMap = {
    sm: 32,
    md: 48,
    lg: 72,
  };
  const pixelSize = sizeMap[size];

  const containerClass = `size-${(pixelSize / 4).toString()} overflow-hidden rounded-full`;

  const avatarElement = (
    <div className={containerClass}>
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={`${displayName ?? username}のプロフィール画像`}
          width={pixelSize}
          height={pixelSize}
          className="object-cover"
        />
      ) : (
        <DefaultAvatar size={size} className="size-full bg-muted" />
      )}
    </div>
  );

  // ユーザー名とディスプレイ名の表示要素
  const userInfoElement = showUsername && (
    <div className="flex flex-col">
      {displayName && <span className="font-bold text-foreground">{displayName}</span>}
      <span className="text-sm text-muted-foreground">@{username}</span>
    </div>
  );

  // リンク付きかどうかで要素を分ける
  if (linkable && username !== 'unknown') {
    return (
      <Link href={`/${username}`} className="flex items-center gap-2">
        {avatarElement}
        {userInfoElement}
      </Link>
    );
  }

  // リンクなし
  return (
    <div className="flex items-center gap-2">
      {avatarElement}
      {userInfoElement}
    </div>
  );
}


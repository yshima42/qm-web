import { DefaultAvatar } from "@quitmate/ui";
import Image from "next/image";
import Link from "next/link";

type UserAvatarProps = {
  username?: string;
  displayName?: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
  showUsername?: boolean;
  linkable?: boolean;
};

// Tailwind v4 のスキャナは `size-${n}` の動的生成を拾えないため、
// クラス名と実寸を静的にマッピングする
const SIZE_CLASS_MAP = {
  sm: "size-8",
  md: "size-10",
  lg: "size-[72px]",
} as const;

const SIZE_PX_MAP = {
  sm: 32,
  md: 40,
  lg: 72,
} as const;

export function UserAvatar({
  username = "unknown",
  displayName,
  avatarUrl,
  size = "md",
  showUsername = false,
  linkable = true,
}: UserAvatarProps) {
  const pixelSize = SIZE_PX_MAP[size];
  const containerClass = `${SIZE_CLASS_MAP[size]} overflow-hidden rounded-full`;

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
        <DefaultAvatar size={size} className="bg-muted size-full" />
      )}
    </div>
  );

  // ユーザー名とディスプレイ名の表示要素
  const userInfoElement = showUsername && (
    <div className="flex flex-col">
      {displayName && <span className="text-foreground font-bold">{displayName}</span>}
      <span className="text-muted-foreground text-sm">@{username}</span>
    </div>
  );

  // リンク付きかどうかで要素を分ける
  if (linkable && username !== "unknown") {
    // showUsername=true の時はリンク内に display_name / @user のテキストがあるので
    // aria-label を付けるとスクリーンリーダがそちらを読まなくなる。
    // accessible name が画像の alt しか無い showUsername=false のときだけ補う。
    const ariaLabel = showUsername ? undefined : `${displayName ?? username}のプロフィール`;
    return (
      <Link href={`/${username}`} className="flex items-center gap-2" aria-label={ariaLabel}>
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

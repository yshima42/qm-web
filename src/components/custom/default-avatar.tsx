import { UserRound } from 'lucide-react';
import Image from 'next/image';

type DefaultAvatarProps = {
  avatarUrl?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function DefaultAvatar({
  avatarUrl,
  alt = 'プロフィール画像',
  size = 'md',
  className = '',
}: DefaultAvatarProps) {
  // サイズに基づいて寸法を決定
  const dimensions = {
    sm: {
      container: 'size-6',
      icon: 'size-3',
      width: 24,
      height: 24,
    },
    md: {
      container: 'size-12',
      icon: 'size-6',
      width: 48,
      height: 48,
    },
    lg: {
      container: 'size-24',
      icon: 'size-12',
      width: 96,
      height: 96,
    },
  };

  const { container, icon, width, height } = dimensions[size];

  return (
    <div className={`overflow-hidden rounded-full ${container} ${className}`}>
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={alt}
          width={width}
          height={height}
          className="size-full object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center bg-gray-200 dark:bg-gray-700">
          <UserRound className={`${icon} text-white`} />
        </div>
      )}
    </div>
  );
}

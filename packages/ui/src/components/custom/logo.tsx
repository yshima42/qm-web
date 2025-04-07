import Image from 'next/image';
import React from 'react';
import { FC } from 'react';
import Link from 'next/link';

type LogoProps = {
  size?: 'small' | 'medium' | 'large';
  className?: string;
};

export const Logo: FC<LogoProps> = ({ size = 'medium', className = '' }) => {
  // サイズに基づいて高さを決定
  const heights = {
    small: 'h-6',
    medium: 'h-8',
    large: 'h-10',
  };

  const height = heights[size];

  return (
    <Link href="https://about.quitmate.app" className={`flex items-center ${className} cursor-pointer`}>
      <Image
        src="/images/icon-web.png"
        alt="QuitMate Logo"
        width={20}
        height={20}
        className={`${height} w-auto`}
      />
    </Link>
  );
};
import Image from 'next/image';
import { StoreBadges } from '@quitmate/ui';
import React from 'react';
type AppDownloadSectionProps = {
  title?: string;
  message?: string;
};

export function AppDownloadSection({ 
  title,
  message  
}: AppDownloadSectionProps) {
  return (
    <div className="mb-6 mt-8 rounded-lg bg-gray-50 dark:bg-gray-800 p-6 text-center">
      <div className="mb-4">
        <Image 
          src="/images/app-icon.png" 
          alt="logo" 
          width={80}
          height={80}
          className="mx-auto mb-2"
          priority
        />
        <h3 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
          {title ?? 'Addiction Recovery SNS QuitMate'}
        </h3>
      </div>
      <p className="mb-6 font-bold text-gray-900 dark:text-white whitespace-pre-line">
        {message ?? 'To read more stories, download the app'}
      </p>
      <StoreBadges size="medium" />
    </div>
  );
}

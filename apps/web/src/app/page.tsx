import Image from 'next/image';
import { Suspense } from 'react';

import { Header } from '@/components/layout/header';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

import { fetchStories } from '@/lib/data';

import { StoryList } from '@/features/stories/story-list';

export default function Page() {
  // ロゴ要素を作成
  const logoElement = (
    <div className="flex items-center gap-1">
      <Image
        src="/images/icon-web.png"
        alt="QuitMate Logo"
        width={20}
        height={20}
        className="h-6 w-auto"
      />
      <span className="font-bold leading-tight">QuitMate</span>
    </div>
  );

  return (
    <>
      <Header
        title="ホーム"
        showBackButton={false}
        // カスタム要素としてロゴを渡す（モバイルでのみ表示）
        titleElement={logoElement}
      />
      <Suspense fallback={<LoadingSpinner />}>
        <main className="p-3 sm:p-5">
          <StoryList fetchStoriesFunc={fetchStories} />
        </main>
      </Suspense>
    </>
  );
}

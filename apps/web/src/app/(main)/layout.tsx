import { ReactNode } from "react";

import { Sidebar } from "@/components/layout/sidebar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { StoryModalProvider } from "@/features/stories/ui/story-modal-provider";
import { getCurrentUserHabits, getCurrentUserProfile } from "@/lib/utils/page-helpers";

type MainLayoutProps = {
  children: ReactNode;
};

/**
 * サイドバー付きページ用の共通レイアウト
 * このレイアウトはページ遷移時に再レンダリングされないため、
 * サイドバーは常に表示され続ける
 * ヘッダーは各ページで個別に表示
 */
export default async function MainLayout({ children }: MainLayoutProps) {
  // ユーザー情報を並列でフェッチ
  const [habits, currentUserProfile] = await Promise.all([
    getCurrentUserHabits(),
    getCurrentUserProfile(),
  ]);
  const currentUserUsername = currentUserProfile?.user_name ?? null;

  return (
    <>
      <div className="flex w-full">
        <Sidebar
          currentUserUsername={currentUserUsername}
          currentUserProfile={currentUserProfile}
        />
        <div className="flex flex-1 flex-col pb-14 md:pb-0">
          <StoryModalProvider habits={habits}>{children}</StoryModalProvider>
        </div>
      </div>
      {currentUserUsername && <MobileBottomNav currentUserUsername={currentUserUsername} />}
    </>
  );
}

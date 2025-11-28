import { ReactNode } from "react";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import type { HeaderProps } from "@/components/layout/header";
import { getCurrentUserUsername, getCurrentUserHabits } from "@/lib/utils/page-helpers";
import { fetchProfileByUsername } from "@/features/profiles/data/data";
import { StoryModalProvider } from "@/features/stories/ui/story-modal-provider";

type PageWithSidebarProps = {
  children: ReactNode;
  headerProps?: Omit<HeaderProps, "title" | "titleElement"> & {
    title?: HeaderProps["title"];
    titleElement?: HeaderProps["titleElement"];
  };
  className?: string;
};

/**
 * サイドバーとヘッダーを含む共通レイアウトコンポーネント
 * ユーザー情報と習慣データはルートレイアウトのProviderでキャッシュされており、
 * cache()により同一リクエスト内での重複フェッチは発生しない
 */
export async function PageWithSidebar({ children, headerProps, className }: PageWithSidebarProps) {
  // cache()を使っているため、同一リクエスト内で重複フェッチは発生しない
  // ルートレイアウトで既にフェッチされている場合はキャッシュから取得
  const [currentUserUsername, habits] = await Promise.all([
    getCurrentUserUsername(),
    getCurrentUserHabits(),
  ]);

  // プロフィール情報を取得（ヘッダーで使用）
  const currentUserProfile = currentUserUsername
    ? await fetchProfileByUsername(currentUserUsername)
    : null;

  return (
    <>
      <div className="flex w-full">
        <Sidebar currentUserUsername={currentUserUsername} />
        <div className={`flex flex-1 flex-col pb-16 md:pb-0 ${className ?? ""}`}>
          <Header
            title={headerProps?.title}
            titleElement={headerProps?.titleElement}
            rightElement={headerProps?.rightElement}
            hideTitle={headerProps?.hideTitle}
            icon={headerProps?.icon}
            showBackButton={headerProps?.showBackButton}
            backUrl={headerProps?.backUrl}
            currentUserProfile={currentUserProfile}
            hideHeader={headerProps?.hideHeader}
          />
          <StoryModalProvider habits={habits}>{children}</StoryModalProvider>
        </div>
      </div>
      <MobileBottomNav currentUserUsername={currentUserUsername} />
    </>
  );
}

import { ReactNode } from "react";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import type { HeaderProps } from "@/components/layout/header";
import { getCurrentUserUsername } from "@/lib/utils/page-helpers";
import { fetchProfileByUsername } from "@/features/profiles/data/data";

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
 */
export async function PageWithSidebar({ children, headerProps, className }: PageWithSidebarProps) {
  const currentUserUsername = await getCurrentUserUsername();
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
          />
          {children}
        </div>
      </div>
      <MobileBottomNav currentUserUsername={currentUserUsername} />
    </>
  );
}

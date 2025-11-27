import { ReactNode } from "react";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import type { HeaderProps } from "@/components/layout/header";
import { getCurrentUserUsername } from "@/lib/utils/page-helpers";

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

  return (
    <div className="flex w-full">
      <Sidebar currentUserUsername={currentUserUsername} />
      <div className={`flex flex-1 flex-col ${className ?? ""}`}>
        {headerProps && (
          <Header
            title={headerProps.title}
            titleElement={headerProps.titleElement}
            rightElement={headerProps.rightElement}
            hideTitle={headerProps.hideTitle}
            icon={headerProps.icon}
          />
        )}
        {children}
      </div>
    </div>
  );
}

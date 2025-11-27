import { ReactNode } from "react";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import type { HeaderProps } from "@/components/layout/header";

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
export function PageWithSidebar({ children, headerProps, className }: PageWithSidebarProps) {
  return (
    <div className="flex w-full">
      <Sidebar />
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


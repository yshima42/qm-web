"use client";

import { createContext, useContext, ReactNode } from "react";

export type CurrentUserProfile = {
  user_name: string;
  display_name: string;
  avatar_url: string | null;
};

type CurrentUserContextType = {
  username: string | null;
  profile: CurrentUserProfile | null;
  isLoggedIn: boolean;
};

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(undefined);

type CurrentUserProviderProps = {
  username: string | null;
  profile: CurrentUserProfile | null;
  children: ReactNode;
};

/**
 * 現在のユーザー情報を提供するProvider
 * サーバーから取得したユーザーデータをクライアント側で共有するためのデータプロバイダー
 * ページ遷移間でデータを再利用できるようにする
 */
export function CurrentUserProvider({ username, profile, children }: CurrentUserProviderProps) {
  const value: CurrentUserContextType = {
    username,
    profile,
    isLoggedIn: !!username,
  };

  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
}

/**
 * 現在のユーザー情報を取得するフック
 * Providerが存在しない場合はデフォルト値を返す
 */
export function useCurrentUser() {
  const context = useContext(CurrentUserContext);
  if (context === undefined) {
    // Providerが存在しない場合はデフォルト値を返す
    return {
      username: null,
      profile: null,
      isLoggedIn: false,
    };
  }
  return context;
}

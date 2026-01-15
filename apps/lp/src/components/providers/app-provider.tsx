"use client";

import { createContext, useContext } from "react";
import { useParams } from "next/navigation";

import type { AppId } from "@/apps/types";

const AppContext = createContext<AppId | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const appId = (params?.app as AppId) || null;

  return <AppContext.Provider value={appId}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  return context;
}

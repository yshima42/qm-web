"use client";

import { createContext, useContext, ReactNode } from "react";
import { HabitTileDto } from "@/lib/types";

type HabitsContextType = {
  habits: HabitTileDto[];
};

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

type HabitsProviderProps = {
  habits: HabitTileDto[];
  children: ReactNode;
};

/**
 * 習慣データを提供するProvider
 * サーバーから取得した習慣データをクライアント側で共有するためのデータプロバイダー
 */
export function HabitsProvider({ habits, children }: HabitsProviderProps) {
  return <HabitsContext.Provider value={{ habits }}>{children}</HabitsContext.Provider>;
}

/**
 * 習慣データを取得するフック
 * Providerが存在しない場合は空配列を返す
 */
export function useHabits() {
  const context = useContext(HabitsContext);
  if (context === undefined) {
    // Providerが存在しない場合は空配列を返す（エラーをスローしない）
    return [];
  }
  return context.habits;
}

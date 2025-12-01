"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UsePullToRefreshOptions = {
  /** リフレッシュ時に実行する関数 */
  onRefresh: () => Promise<void> | void;
  /** プルトゥリフレッシュを有効にするか */
  enabled?: boolean;
  /** プルダウン距離の閾値（px）。この距離以上プルダウンするとリフレッシュが実行される */
  threshold?: number;
};

type UsePullToRefreshReturn = {
  /** リフレッシュ中かどうか */
  isRefreshing: boolean;
  /** インジケーターを表示するかどうか */
  shouldShowIndicator: boolean;
  /** プルダウンの進捗（0-1） */
  pullProgress: number;
};

const SCROLL_THRESHOLD = 5;
const MAX_PULL_DISTANCE = 150;
const RESISTANCE_FACTOR = 0.5;
const MIN_PREVENT_SCROLL_DISTANCE = 10;
const REFRESH_DELAY_MS = 300;

export function usePullToRefresh({
  onRefresh,
  enabled = true,
  threshold = 80,
}: UsePullToRefreshOptions): UsePullToRefreshReturn {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef<number | null>(null);
  const isPulling = useRef(false);
  const onRefreshRef = useRef(onRefresh);
  const isRefreshingRef = useRef(false);
  const pullDistanceRef = useRef(0);

  // onRefreshの最新の参照を保持
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  // isRefreshingの最新の参照を保持
  useEffect(() => {
    isRefreshingRef.current = isRefreshing;
  }, [isRefreshing]);

  const handleRefresh = useCallback(async () => {
    if (isRefreshingRef.current) return;
    setIsRefreshing(true);
    try {
      await onRefreshRef.current();
      // 少し待ってから状態をリセット（UX向上のため）
      await new Promise((resolve) => setTimeout(resolve, REFRESH_DELAY_MS));
    } finally {
      pullDistanceRef.current = 0;
      setIsRefreshing(false);
      setPullDistance(0);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      // スクロール位置が最上部の場合のみ有効
      if (window.scrollY <= SCROLL_THRESHOLD && !isRefreshingRef.current) {
        startY.current = e.touches[0].clientY;
        isPulling.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling.current || startY.current === null || isRefreshingRef.current) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - startY.current;

      // 下にプルダウンしている場合のみ
      if (distance > 0 && window.scrollY <= SCROLL_THRESHOLD) {
        // 抵抗感を出すために距離を調整（最大150pxまで）
        const adjustedDistance = Math.min(distance * RESISTANCE_FACTOR, MAX_PULL_DISTANCE);
        pullDistanceRef.current = adjustedDistance;
        setPullDistance(adjustedDistance);

        // スクロールを防ぐ
        if (distance > MIN_PREVENT_SCROLL_DISTANCE) {
          e.preventDefault();
        }
      } else {
        pullDistanceRef.current = 0;
        setPullDistance(0);
        isPulling.current = false;
      }
    };

    const handleTouchEnd = () => {
      if (!isPulling.current || startY.current === null) {
        pullDistanceRef.current = 0;
        setPullDistance(0);
        isPulling.current = false;
        startY.current = null;
        return;
      }

      const currentPullDistance = pullDistanceRef.current;

      if (currentPullDistance >= threshold && !isRefreshingRef.current) {
        handleRefresh();
      } else {
        pullDistanceRef.current = 0;
        setPullDistance(0);
      }

      startY.current = null;
      isPulling.current = false;
    };

    // ウィンドウにイベントリスナーを追加（モバイルで動作するように）
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [enabled, threshold, handleRefresh]);

  return {
    isRefreshing,
    shouldShowIndicator: pullDistance > 0 || isRefreshing,
    pullProgress: Math.min(pullDistance / threshold, 1),
  } satisfies UsePullToRefreshReturn;
}

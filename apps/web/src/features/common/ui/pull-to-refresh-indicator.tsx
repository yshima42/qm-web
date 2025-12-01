"use client";

import { RefreshCw } from "lucide-react";

type PullToRefreshIndicatorProps = {
  isRefreshing: boolean;
  pullProgress: number;
  shouldShow: boolean;
  idleLabel: string;
  refreshingLabel: string;
};

export function PullToRefreshIndicator({
  isRefreshing,
  pullProgress,
  shouldShow,
  idleLabel,
  refreshingLabel,
}: PullToRefreshIndicatorProps) {
  if (!shouldShow) return null;

  return (
    <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 transition-opacity duration-200 md:hidden">
      <div className="bg-background border-border flex items-center gap-2 rounded-full border px-4 py-2 shadow-lg">
        <RefreshCw
          className={`text-primary size-5 transition-transform duration-300 ${
            isRefreshing ? "animate-spin" : ""
          }`}
          style={{
            transform: `rotate(${pullProgress * 180}deg)`,
          }}
        />
        <span className="text-muted-foreground text-sm">
          {isRefreshing ? refreshingLabel : idleLabel}
        </span>
      </div>
    </div>
  );
}

"use client";

import { TimelineLanguageSelector } from "./timeline-language-selector";

/**
 * サーバーコンポーネントから使用するためのラッパー
 */
export function TimelineLanguageSelectorWrapper() {
  return <TimelineLanguageSelector compact={true} />;
}

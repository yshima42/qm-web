import { useMemo } from "react";
import { countCharacters } from "@/features/common/utils";
import { MAX_CHARACTERS, SHOW_COUNT_THRESHOLD } from "@/features/common/constants";

/**
 * 文字数カウントとプログレス計算を行うカスタムフック
 */
export function useCharacterCount(content: string) {
  const charCount = useMemo(() => countCharacters(content), [content]);
  const remaining = MAX_CHARACTERS - charCount;
  const isOverLimit = remaining < 0;
  const showCount = remaining <= SHOW_COUNT_THRESHOLD;
  const progress = Math.min(charCount / MAX_CHARACTERS, 1);

  return {
    charCount,
    remaining,
    isOverLimit,
    showCount,
    progress,
  };
}

type CharacterCountIndicatorProps = {
  remaining: number;
  isOverLimit: boolean;
  showCount: boolean;
  progress: number;
};

/**
 * 文字数カウントとプログレスを表示するインジケーターコンポーネント
 */
export function CharacterCountIndicator({
  remaining,
  isOverLimit,
  showCount,
  progress,
}: CharacterCountIndicatorProps) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Background circle */}
      <svg className="h-8 w-8 -rotate-90">
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted"
          opacity="0.2"
        />
        {/* Progress circle */}
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={`${2 * Math.PI * 14}`}
          strokeDashoffset={`${2 * Math.PI * 14 * (1 - progress)}`}
          className={
            isOverLimit ? "text-red-500" : remaining <= 20 ? "text-yellow-500" : "text-primary"
          }
          strokeLinecap="round"
        />
      </svg>
      {/* Character count text */}
      {showCount && (
        <span
          className={`absolute text-xs font-medium ${
            isOverLimit ? "text-red-500" : "text-muted-foreground"
          }`}
        >
          {remaining}
        </span>
      )}
    </div>
  );
}

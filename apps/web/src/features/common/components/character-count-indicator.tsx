import { cn } from "@/lib/utils";

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
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  // 色の決定ロジック
  const getColorClasses = () => {
    if (isOverLimit) {
      return {
        stroke: "stroke-red-500",
        text: "text-red-500",
        bg: "bg-red-50 dark:bg-red-950/20",
      };
    }
    if (remaining <= 20) {
      return {
        stroke: "stroke-amber-500",
        text: "text-amber-600 dark:text-amber-500",
        bg: "bg-amber-50 dark:bg-amber-950/20",
      };
    }
    return {
      stroke: "stroke-primary",
      text: "text-muted-foreground",
      bg: "bg-muted/30",
    };
  };

  const colors = getColorClasses();

  return (
    <div
      className={cn(
        "relative flex items-center justify-center transition-all duration-300",
        showCount && colors.bg,
        showCount && "rounded-full px-2.5 py-1.5",
      )}
    >
      {/* Circular progress indicator */}
      <svg className="h-7 w-7 -rotate-90" viewBox="0 0 36 36">
        {/* Background circle */}
        <circle
          cx="18"
          cy="18"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-muted-foreground/20"
        />
        {/* Progress circle with smooth transition */}
        <circle
          cx="18"
          cy="18"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn("transition-all duration-300 ease-out", colors.stroke)}
          style={{
            strokeDashoffset: strokeDashoffset,
          }}
        />
      </svg>
      {/* Character count text */}
      {showCount && (
        <span
          className={cn(
            "absolute text-xs font-semibold tabular-nums transition-colors duration-300",
            colors.text,
          )}
        >
          {remaining}
        </span>
      )}
    </div>
  );
}

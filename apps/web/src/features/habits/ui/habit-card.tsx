"use client";

import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from "@quitmate/ui";
import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { CATEGORY_ICONS, getCategoryDisplayName } from "@/lib/categories";
import { HabitTileDto } from "@/lib/types";
import { deleteHabit } from "@/features/habits/data/actions";

import { HabitResetButton } from "./habit-reset-button";

type Props = {
  habit: HabitTileDto;
};

function formatElapsedTime(startedAt: string): string {
  const start = new Date(startedAt);
  const now = new Date();
  const diff = now.getTime() - start.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}日 ${hours}時間 ${minutes}分`;
  } else if (hours > 0) {
    return `${hours}時間 ${minutes}分`;
  } else {
    return `${minutes}分`;
  }
}

function getCurrentTrial(habit: HabitTileDto) {
  if (!habit.trials || habit.trials.length === 0) {
    return null;
  }

  // Sort trials by started_at descending to get the latest one
  const sortedTrials = [...habit.trials].sort(
    (a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime(),
  );

  const latestTrial = sortedTrials[0];

  // If the latest trial has ended, there's no current trial
  if (latestTrial.ended_at) {
    return null;
  }

  return latestTrial;
}

export function HabitCard({ habit }: Props) {
  const router = useRouter();
  const categoryName = habit.habit_categories.habit_category_name;
  const displayName = getCategoryDisplayName(categoryName, habit.custom_habit_name);
  const Icon = CATEGORY_ICONS[categoryName as keyof typeof CATEGORY_ICONS];

  const currentTrial = useMemo(() => getCurrentTrial(habit), [habit]);
  const elapsedTime = useMemo(() => {
    if (!currentTrial) {
      return "継続中なし";
    }
    return formatElapsedTime(currentTrial.started_at);
  }, [currentTrial]);

  const handleDelete = async () => {
    if (!confirm(`「${displayName}」を削除しますか？この操作は取り消せません。`)) {
      return;
    }

    const { error } = await deleteHabit(habit.id);

    if (error) {
      alert(`エラーが発生しました: ${error.message}`);
      return;
    }

    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="size-5" />}
            <CardTitle>{displayName}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="text-muted-foreground text-sm">継続時間: </span>
            <span className="text-lg font-semibold">{elapsedTime}</span>
          </div>
          {currentTrial && (
            <div className="text-muted-foreground text-xs">
              開始日時: {new Date(currentTrial.started_at).toLocaleString("ja-JP")}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <div className="flex gap-2">
          {currentTrial && (
            <HabitResetButton
              habitId={habit.id}
              trialId={currentTrial.id}
              habitName={displayName}
            />
          )}
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            削除
          </Button>
        </div>
        <Link href={`/habits/${habit.id}`}>
          <Button variant="outline" size="sm">
            詳細
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

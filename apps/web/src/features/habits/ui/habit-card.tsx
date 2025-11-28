"use client";

import { Card, CardContent } from "@quitmate/ui";
import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash2 } from "lucide-react";

import { CATEGORY_ICONS, getCategoryDisplayName } from "@/lib/categories";
import { HabitTileDto } from "@/lib/types";
import { deleteHabit } from "@/features/habits/data/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { HabitResetButton } from "./habit-reset-button";

type Props = {
  habit: HabitTileDto;
};

function formatElapsedDays(startedAt: string): number {
  const start = new Date(startedAt);
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function formatElapsedTime(startedAt: string): string {
  const start = new Date(startedAt);
  const now = new Date();
  const diff = now.getTime() - start.getTime();

  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${hours}hr ${minutes}m ${seconds}s`;
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
  const [elapsedDays, setElapsedDays] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // クライアントサイドでのみ時間を計算・更新
  useEffect(() => {
    setIsMounted(true);
    if (!currentTrial) {
      setElapsedDays(null);
      setElapsedTime(null);
      return;
    }

    const updateTime = () => {
      setElapsedDays(formatElapsedDays(currentTrial.started_at));
      setElapsedTime(formatElapsedTime(currentTrial.started_at));
    };

    // 初回更新
    updateTime();

    // 1秒ごとに更新
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
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
    <Card className="relative">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          {/* 左側: アイコンとタイトル */}
          <div className="flex items-center gap-2">
            {Icon && <Icon className="text-primary size-5" />}
            <span className="font-medium">{displayName}</span>
          </div>

          {/* 右上: オプションメニュー */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleDelete}
                className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
              >
                <Trash2 className="mr-2 size-4" />
                削除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 日数と時間の表示（中央揃え） */}
        {!isMounted ? (
          <div className="mt-4 space-y-1 text-center">
            <div className="text-2xl font-bold">- days</div>
            <div className="text-muted-foreground text-sm">-hr -m -s</div>
          </div>
        ) : currentTrial && elapsedDays !== null && elapsedTime ? (
          <div className="mt-4 space-y-1 text-center">
            <div className="text-2xl font-bold">
              {elapsedDays} {elapsedDays === 1 ? "day" : "days"}
            </div>
            <div className="text-muted-foreground text-sm">{elapsedTime}</div>
          </div>
        ) : (
          <div className="text-muted-foreground mt-4 text-center">継続中なし</div>
        )}

        {/* リセットボタン（中央揃え） */}
        {currentTrial && (
          <div className="mt-4 flex justify-center">
            <HabitResetButton
              habitId={habit.id}
              trialId={currentTrial.id}
              habitName={displayName}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

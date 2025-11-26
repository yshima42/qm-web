"use client";

import { Button } from "@quitmate/ui";
import { Plus } from "lucide-react";
import Link from "next/link";

import { HabitTileDto } from "@/lib/types";
import { HabitList } from "@/features/habits/ui/habit-list";

type Props = {
  habits: HabitTileDto[];
};

export function HabitsPageClient({ habits }: Props) {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">習慣一覧</h2>
        <Link href="/habits/register">
          <Button>
            <Plus className="size-4" />
            習慣を登録
          </Button>
        </Link>
      </div>
      <HabitList habits={habits} />
    </>
  );
}

"use client";

import { Button } from "@quitmate/ui";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { HabitTileDto } from "@/lib/types";
import { HabitList } from "@/features/habits/ui/habit-list";

type Props = {
  habits: HabitTileDto[];
};

export function HabitsPageClient({ habits }: Props) {
  const t = useTranslations("sidebar");

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("habitList")}</h2>
        <Link href="/habits/register">
          <Button>
            <Plus className="size-4" />
            {t("registerHabit")}
          </Button>
        </Link>
      </div>
      <HabitList habits={habits} />
    </>
  );
}

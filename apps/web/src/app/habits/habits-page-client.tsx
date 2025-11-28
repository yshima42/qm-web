"use client";

import { Button, AppDownloadDialogTrigger } from "@quitmate/ui";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { HabitTileDto } from "@/lib/types";
import { HabitList } from "@/features/habits/ui/habit-list";
import { getMaxHabits } from "@/features/habits/data/constants";

type Props = {
  habits: HabitTileDto[];
};

export function HabitsPageClient({ habits }: Props) {
  const t = useTranslations("sidebar");
  const tAppDownload = useTranslations("app-download-dialog");
  const maxHabits = getMaxHabits();
  const canRegisterMore = habits.length < maxHabits;

  const RegisterButton = () => {
    if (canRegisterMore) {
      return (
        <Link href="/habits/register">
          <Button>
            <Plus className="size-4" />
            {t("registerHabit")}
          </Button>
        </Link>
      );
    }

    return (
      <AppDownloadDialogTrigger
        title={tAppDownload("title")}
        description={tAppDownload("description")}
        qrCodeLabel={tAppDownload("qrCodeLabel")}
        qrCodeAlt={tAppDownload("qrCodeAlt")}
        storeLabel={tAppDownload("storeLabel")}
        className="inline-block cursor-pointer"
      >
        <Button disabled>
          <Plus className="size-4" />
          {t("registerHabit")}
        </Button>
      </AppDownloadDialogTrigger>
    );
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("habitList")}</h2>
        <RegisterButton />
      </div>
      <HabitList habits={habits} />
    </>
  );
}

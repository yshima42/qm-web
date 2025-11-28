"use client";

import { useState } from "react";
import { Button } from "@quitmate/ui";
import { useTranslations } from "next-intl";

import { HabitTileDto } from "@/lib/types";
import { HabitResetDialog } from "./habit-reset-dialog";

type Props = {
  habit: HabitTileDto;
};

export function HabitResetButton({ habit }: Props) {
  const t = useTranslations("habit-reset");
  const [dialogOpen, setDialogOpen] = useState(false);
  const currentTrial = habit.trials?.find((t) => !t.ended_at);

  if (!currentTrial) {
    return null;
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
        {t("reset")}
      </Button>
      <HabitResetDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        habit={habit}
        trialId={currentTrial.id}
      />
    </>
  );
}

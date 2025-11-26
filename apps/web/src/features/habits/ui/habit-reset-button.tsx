"use client";

import { Button } from "@quitmate/ui";
import { useRouter } from "next/navigation";

import { resetTrial } from "@/features/habits/data/actions";

type Props = {
  habitId: string;
  trialId: string;
  habitName: string;
};

export function HabitResetButton({ habitId, trialId, habitName }: Props) {
  const router = useRouter();

  const handleReset = async () => {
    if (!confirm(`「${habitName}」の継続時間をリセットしますか？この操作は取り消せません。`)) {
      return;
    }

    const { error } = await resetTrial(habitId, trialId);

    if (error) {
      alert(`エラーが発生しました: ${error.message}`);
      return;
    }

    router.refresh();
  };

  return (
    <Button variant="outline" size="sm" onClick={handleReset}>
      リセット
    </Button>
  );
}

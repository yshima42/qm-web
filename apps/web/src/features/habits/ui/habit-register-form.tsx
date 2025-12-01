"use client";

import { Button } from "@quitmate/ui";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { HABIT_CATEGORIES, CATEGORY_ICONS } from "@/lib/categories";
import { HabitCategoryName, HabitTileDto } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { createHabit, HabitRegisterDTO } from "@/features/habits/data/actions";
import { getMaxHabits } from "@/features/habits/data/constants";

type Props = {
  existingHabits: HabitTileDto[];
  onSuccess?: () => void;
};

function getRegisterableCategories(existingHabits: HabitTileDto[]): HabitCategoryName[] {
  const existingCategoryNames = existingHabits.map(
    (habit) => habit.habit_categories.habit_category_name as HabitCategoryName,
  );

  return HABIT_CATEGORIES.filter(
    (category) =>
      !existingCategoryNames.includes(category) &&
      category !== "Official" &&
      category !== "Cosmetic Surgery",
  );
}

/**
 * ローカル時間の日時文字列を取得（YYYY-MM-DDTHH:mm形式）
 */
function getLocalDateTimeString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function HabitRegisterForm({ existingHabits, onSuccess }: Props) {
  const router = useRouter();
  const tCategory = useTranslations("categories");
  const tHabit = useTranslations("habit-register");
  const [category, setCategory] = useState<HabitCategoryName | "">("");
  const [customHabitName, setCustomHabitName] = useState("");
  const [startedAt, setStartedAt] = useState(
    getLocalDateTimeString(new Date()), // ローカル時間
  );
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxHabits = getMaxHabits();
  const canRegisterMore = existingHabits.length < maxHabits;
  const registerableCategories = getRegisterableCategories(existingHabits);
  const isCustomCategory = category === "Custom";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 最大登録数チェック
    if (!canRegisterMore) {
      setError(tHabit("maxHabitsReached", { max: maxHabits }));
      return;
    }

    if (!category) {
      setError(tHabit("categoryRequired"));
      return;
    }

    if (isCustomCategory && !customHabitName.trim()) {
      setError(tHabit("customHabitNameRequired"));
      return;
    }

    if (!reason.trim()) {
      setError(tHabit("reasonRequired"));
      return;
    }

    setIsLoading(true);

    // Convert local datetime to UTC ISO 8601 string
    const startedAtDate = new Date(startedAt);
    const startedAtUtc = startedAtDate.toISOString();

    const dto: HabitRegisterDTO = {
      habitCategoryName: category,
      customHabitName: isCustomCategory ? customHabitName.trim() : undefined,
      reason: reason.trim() || undefined,
      startedAt: startedAtUtc,
    };

    const { error: createError } = await createHabit(dto);

    setIsLoading(false);

    if (createError) {
      setError(createError.message);
      return;
    }

    // 登録成功後、フォームをリセットしてモーダルを閉じる
    setCategory("");
    setCustomHabitName("");
    setStartedAt(getLocalDateTimeString(new Date()));
    setReason("");
    router.refresh();
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      {/* ヘッダー */}
      <div className="border-border border-b px-4 py-3">
        <h2 className="text-xl font-semibold">{tHabit("title")}</h2>
        {!canRegisterMore && (
          <p className="text-destructive mt-1 text-sm">
            {tHabit("maxHabitsReached", { max: maxHabits })}
          </p>
        )}
      </div>

      {/* フォーム内容 */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        <div className="grid gap-2">
          <Label>{tHabit("categoryLabel")}</Label>
          {registerableCategories.length === 0 ? (
            <p className="text-muted-foreground text-sm">{tHabit("noRegisterableCategories")}</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {registerableCategories.map((cat) => {
                const Icon = CATEGORY_ICONS[cat];
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    disabled={!canRegisterMore}
                    className={`flex w-full items-center gap-2 rounded-lg border p-3 text-left transition-colors ${
                      isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                    } ${!canRegisterMore ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center">
                      {Icon && <Icon className="text-primary size-5" />}
                    </div>
                    <div className="min-w-0 flex-1 text-sm font-medium">{tCategory(cat)}</div>
                    {isSelected && <CheckCircle2 className="text-primary size-4 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {isCustomCategory && (
          <div className="grid gap-2">
            <Label htmlFor="customHabitName">{tHabit("customHabitNameLabel")}</Label>
            <Input
              id="customHabitName"
              value={customHabitName}
              onChange={(e) => setCustomHabitName(e.target.value)}
              placeholder={tHabit("customHabitNamePlaceholder")}
              required={isCustomCategory}
              disabled={!canRegisterMore}
            />
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="startedAt">{tHabit("startedAtLabel")}</Label>
          <Input
            id="startedAt"
            type="datetime-local"
            value={startedAt}
            onChange={(e) => setStartedAt(e.target.value)}
            required
            disabled={!canRegisterMore}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="reason">{tHabit("reasonLabel")}</Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={tHabit("reasonPlaceholder")}
            required
            disabled={!canRegisterMore}
            rows={4}
            className="resize-none"
          />
          <p className="text-muted-foreground text-sm">{tHabit("reasonDescription")}</p>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {/* フッター */}
      <div className="border-border border-t px-4 py-3">
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSuccess?.()}
            disabled={isLoading}
          >
            {tHabit("cancel")}
          </Button>
          <Button
            type="submit"
            disabled={isLoading || registerableCategories.length === 0 || !canRegisterMore}
          >
            {isLoading ? tHabit("registering") : tHabit("register")}
          </Button>
        </div>
      </div>
    </form>
  );
}

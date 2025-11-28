"use client";

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@quitmate/ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HABIT_CATEGORIES } from "@/lib/categories";
import { HabitCategoryName, HabitTileDto } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { createHabit, HabitRegisterDTO } from "@/features/habits/data/actions";
import { getMaxHabits } from "@/features/habits/data/constants";

type Props = {
  existingHabits: HabitTileDto[];
};

function getRegisterableCategories(existingHabits: HabitTileDto[]): HabitCategoryName[] {
  const existingCategoryNames = existingHabits.map(
    (habit) => habit.habit_categories.habit_category_name as HabitCategoryName,
  );

  return HABIT_CATEGORIES.filter(
    (category) => !existingCategoryNames.includes(category) && category !== "Official",
  );
}

export function HabitRegisterForm({ existingHabits }: Props) {
  const router = useRouter();
  const tCategory = useTranslations("categories");
  const tHabit = useTranslations("habit-register");
  const [category, setCategory] = useState<HabitCategoryName | "">("");
  const [customHabitName, setCustomHabitName] = useState("");
  const [startedAt, setStartedAt] = useState(
    new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm format
  );
  const [durationMonths, setDurationMonths] = useState<number | "">("");
  const [frequencyPerWeek, setFrequencyPerWeek] = useState<number | "">("");
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

    setIsLoading(true);

    // Convert local datetime to UTC ISO 8601 string
    const startedAtDate = new Date(startedAt);
    const startedAtUtc = startedAtDate.toISOString();

    const dto: HabitRegisterDTO = {
      habitCategoryName: category,
      customHabitName: isCustomCategory ? customHabitName.trim() : undefined,
      reason: reason.trim() || undefined,
      startedAt: startedAtUtc,
      durationMonths: durationMonths ? Number(durationMonths) : undefined,
      frequencyPerWeek: frequencyPerWeek ? Number(frequencyPerWeek) : undefined,
    };

    const { error: createError } = await createHabit(dto);

    setIsLoading(false);

    if (createError) {
      setError(createError.message);
      return;
    }

    // 登録成功後、habitsページにリダイレクト
    router.push("/habits");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{tHabit("title")}</h1>
        <p className="text-muted-foreground mt-2 text-sm">{tHabit("description")}</p>
        {!canRegisterMore && (
          <p className="text-destructive mt-2 text-sm">
            {tHabit("maxHabitsReached", { max: maxHabits })}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card space-y-4 rounded-lg border p-6">
          <div className="grid gap-2">
            <Label htmlFor="category">{tHabit("categoryLabel")}</Label>
            {registerableCategories.length === 0 ? (
              <p className="text-muted-foreground text-sm">{tHabit("noRegisterableCategories")}</p>
            ) : (
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as HabitCategoryName)}
                disabled={!canRegisterMore}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder={tHabit("categoryPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {registerableCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {tCategory(cat)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Label htmlFor="durationMonths">{tHabit("durationMonthsLabel")}</Label>
            <Input
              id="durationMonths"
              type="number"
              min="1"
              value={durationMonths}
              onChange={(e) => setDurationMonths(e.target.value ? Number(e.target.value) : "")}
              placeholder={tHabit("durationMonthsPlaceholder")}
              disabled={!canRegisterMore}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="frequencyPerWeek">{tHabit("frequencyPerWeekLabel")}</Label>
            <Input
              id="frequencyPerWeek"
              type="number"
              min="1"
              max="7"
              value={frequencyPerWeek}
              onChange={(e) => setFrequencyPerWeek(e.target.value ? Number(e.target.value) : "")}
              placeholder={tHabit("frequencyPerWeekPlaceholder")}
              disabled={!canRegisterMore}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reason">{tHabit("reasonLabel")}</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={tHabit("reasonPlaceholder")}
              disabled={!canRegisterMore}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/habits")}
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
      </form>
    </div>
  );
}

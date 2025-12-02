"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HabitTileDto } from "@/lib/types";
import { getElapsedDays, getHabitDisplayName } from "../utils/habit-utils";

type HabitSelectDropdownProps = {
  habits: HabitTileDto[];
  selectedHabitId: string;
  onSelect: (habitId: string) => void;
  showDropdown: boolean;
};

const HABIT_BUTTON_CLASSES =
  "border-border bg-muted/50 text-foreground flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium transition-colors md:px-3 md:py-1.5 md:text-sm";

const HABIT_DROPDOWN_CONTENT_CLASSES = "w-56";

export function HabitSelectDropdown({
  habits,
  selectedHabitId,
  onSelect,
  showDropdown,
}: HabitSelectDropdownProps) {
  const tCategory = useTranslations("categories");
  const selectedHabit = habits.find((h) => h.id === selectedHabitId) || habits[0];
  const selectedHabitName = getHabitDisplayName(selectedHabit, tCategory);
  const selectedHabitElapsedDays = getElapsedDays(selectedHabit);

  const habitDisplay = (
    <>
      {selectedHabitName}
      {selectedHabitElapsedDays != null && (
        <span className="text-[10px] md:text-xs">- {selectedHabitElapsedDays}日</span>
      )}
    </>
  );

  if (showDropdown) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className={`${HABIT_BUTTON_CLASSES} hover:bg-muted`}>
            {habitDisplay}
            <ChevronDown className="h-3 w-3 md:h-3.5 md:w-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className={HABIT_DROPDOWN_CONTENT_CLASSES}>
          <DropdownMenuRadioGroup value={selectedHabitId} onValueChange={onSelect}>
            {habits.map((habit) => {
              const habitName = getHabitDisplayName(habit, tCategory);
              const elapsedDays = getElapsedDays(habit);
              return (
                <DropdownMenuRadioItem key={habit.id} value={habit.id}>
                  {habitName}
                  {elapsedDays != null && (
                    <span className="ml-1 text-[10px] md:text-xs">- {elapsedDays}日</span>
                  )}
                </DropdownMenuRadioItem>
              );
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return <div className={HABIT_BUTTON_CLASSES}>{habitDisplay}</div>;
}

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

  if (showDropdown) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="border-border text-primary hover:bg-accent flex items-center gap-1 rounded-full border bg-transparent px-3 py-1.5 text-sm font-semibold transition-colors"
          >
            {selectedHabitName}
            {selectedHabitElapsedDays != null && (
              <span className="text-xs">- {selectedHabitElapsedDays}日</span>
            )}
            <ChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuRadioGroup value={selectedHabitId} onValueChange={onSelect}>
            {habits.map((habit) => {
              const habitName = getHabitDisplayName(habit, tCategory);
              const elapsedDays = getElapsedDays(habit);
              return (
                <DropdownMenuRadioItem key={habit.id} value={habit.id}>
                  {habitName}
                  {elapsedDays != null && <span className="ml-1 text-xs">- {elapsedDays}日</span>}
                </DropdownMenuRadioItem>
              );
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="border-border text-primary flex items-center gap-1 rounded-full border bg-transparent px-3 py-1.5 text-sm font-semibold">
      {selectedHabitName}
      {selectedHabitElapsedDays != null && (
        <span className="text-xs">- {selectedHabitElapsedDays}日</span>
      )}
    </div>
  );
}

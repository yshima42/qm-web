import { HabitTileDto } from '@/lib/types';

import { HabitCard } from './habit-card';

type Props = {
  habits: HabitTileDto[];
};

export function HabitList({ habits }: Props) {
  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg text-muted-foreground">まだ習慣が登録されていません</p>
        <p className="mt-2 text-sm text-muted-foreground">右上のボタンから習慣を登録してください</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} />
      ))}
    </div>
  );
}


'use client';

import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@quitmate/ui';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HABIT_CATEGORIES } from '@/lib/categories';
import { HabitCategoryName, HabitTileDto } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { createHabit, HabitRegisterDTO } from '@/features/habits/data/actions';

type Props = {
  existingHabits: HabitTileDto[];
};

function getRegisterableCategories(existingHabits: HabitTileDto[]): HabitCategoryName[] {
  const existingCategoryNames = existingHabits.map(
    (habit) => habit.habit_categories.habit_category_name as HabitCategoryName,
  );

  return HABIT_CATEGORIES.filter(
    (category) => !existingCategoryNames.includes(category) && category !== 'Official',
  );
}

export function HabitRegisterForm({ existingHabits }: Props) {
  const router = useRouter();
  const tCategory = useTranslations('categories');
  const [category, setCategory] = useState<HabitCategoryName | ''>('');
  const [customHabitName, setCustomHabitName] = useState('');
  const [startedAt, setStartedAt] = useState(
    new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm format
  );
  const [durationMonths, setDurationMonths] = useState<number | ''>('');
  const [frequencyPerWeek, setFrequencyPerWeek] = useState<number | ''>('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerableCategories = getRegisterableCategories(existingHabits);
  const isCustomCategory = category === 'Custom';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!category) {
      setError('カテゴリを選択してください');
      return;
    }

    if (isCustomCategory && !customHabitName.trim()) {
      setError('カスタム習慣名を入力してください');
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
    router.push('/habits');
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">習慣を登録</h1>
        <p className="mt-2 text-sm text-muted-foreground">新しい習慣を登録します</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4 rounded-lg border bg-card p-6">
          <div className="grid gap-2">
            <Label htmlFor="category">カテゴリ *</Label>
            {registerableCategories.length === 0 ? (
              <p className="text-sm text-muted-foreground">登録可能なカテゴリがありません</p>
            ) : (
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as HabitCategoryName)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="カテゴリを選択" />
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
              <Label htmlFor="customHabitName">カスタム習慣名 *</Label>
              <Input
                id="customHabitName"
                value={customHabitName}
                onChange={(e) => setCustomHabitName(e.target.value)}
                placeholder="習慣名を入力"
                required={isCustomCategory}
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="startedAt">開始日時 *</Label>
            <Input
              id="startedAt"
              type="datetime-local"
              value={startedAt}
              onChange={(e) => setStartedAt(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="durationMonths">期間（月数）</Label>
            <Input
              id="durationMonths"
              type="number"
              min="1"
              value={durationMonths}
              onChange={(e) => setDurationMonths(e.target.value ? Number(e.target.value) : '')}
              placeholder="例: 3"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="frequencyPerWeek">週の頻度</Label>
            <Input
              id="frequencyPerWeek"
              type="number"
              min="1"
              max="7"
              value={frequencyPerWeek}
              onChange={(e) => setFrequencyPerWeek(e.target.value ? Number(e.target.value) : '')}
              placeholder="例: 3"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reason">理由（任意）</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="この習慣をやめたい理由"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/habits')}
            disabled={isLoading}
          >
            キャンセル
          </Button>
          <Button type="submit" disabled={isLoading || registerableCategories.length === 0}>
            {isLoading ? '登録中...' : '登録'}
          </Button>
        </div>
      </form>
    </div>
  );
}


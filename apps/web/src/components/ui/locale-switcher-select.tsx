'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@quitmate/ui';
import { GlobeIcon } from 'lucide-react';
import { useTransition } from 'react';

import { Locale } from '@/i18n/config';
import { setUserLocale } from '@/services/locale';

type Props = {
  defaultValue: string;
  items: { value: string; label: string }[];
  label: string;
};

export default function LocaleSwitcherSelect({ defaultValue, items, label }: Props) {
  const [isPending, startTransition] = useTransition();

  function onChange(value: string) {
    const locale = value as Locale;
    startTransition(async () => {
      await setUserLocale(locale);
    });
  }

  return (
    <div className="relative">
      <Select defaultValue={defaultValue} onValueChange={onChange}>
        <SelectTrigger
          aria-label={label}
          className={`rounded-sm p-2 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800 ${
            isPending ? 'pointer-events-none opacity-60' : ''
          }`}
        >
          <GlobeIcon className="mr-1.5 size-5 text-slate-600 transition-colors group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-100" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end" className="min-w-32 rounded-sm">
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value} className="flex items-center px-3 py-2">
              <span className="text-slate-900 dark:text-slate-100">{item.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

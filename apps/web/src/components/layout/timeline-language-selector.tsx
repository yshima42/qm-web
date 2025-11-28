"use client";

import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setUserLocale } from "@/services/locale";
import { Locale } from "@/i18n/config";

const LANGUAGE_OPTIONS: { code: Locale; label: string }[] = [
  { code: "ja", label: "日本語" },
  { code: "en", label: "English" },
];

type TimelineLanguageSelectorProps = {
  compact?: boolean;
};

export function TimelineLanguageSelector({ compact = false }: TimelineLanguageSelectorProps) {
  const locale = useLocale() as Locale;
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (newLocale: Locale) => {
    if (newLocale === locale) return;

    startTransition(async () => {
      await setUserLocale(newLocale);
      // ストーリーのキャッシュを無効化して、新しい言語で再取得
      queryClient.invalidateQueries({
        queryKey: ["stories"],
      });
      router.refresh();
    });
  };

  const currentLanguage = LANGUAGE_OPTIONS.find((opt) => opt.code === locale);

  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            disabled={isPending}
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center justify-center rounded-md p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            title="タイムラインの言語を選択"
          >
            <Globe size={18} strokeWidth={2} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {LANGUAGE_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.code}
              onClick={() => handleChange(option.code)}
              disabled={isPending}
              className="flex items-center gap-2"
            >
              <span>{option.label}</span>
              {locale === option.code && <span className="text-primary ml-auto">✓</span>}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={isPending}
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-4 rounded-md px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          title="タイムラインの言語を選択"
        >
          <Globe size={18} strokeWidth={2} />
          <span className="flex-1 text-left">{currentLanguage?.label || locale}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGE_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.code}
            onClick={() => handleChange(option.code)}
            disabled={isPending}
            className="flex items-center gap-2"
          >
            <span>{option.label}</span>
            {locale === option.code && <span className="text-primary ml-auto">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

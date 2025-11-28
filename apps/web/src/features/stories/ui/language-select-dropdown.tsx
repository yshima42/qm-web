"use client";

import { Globe } from "lucide-react";
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

export type LanguageCode = "ja" | "en";

type LanguageSelectDropdownProps = {
  value: LanguageCode;
  onChange: (value: LanguageCode) => void;
  disabled?: boolean;
  /** タイムラインの言語フィルタリングも更新するかどうか */
  updateTimelineFilter?: boolean;
};

const LANGUAGE_OPTIONS: { code: LanguageCode; label: string }[] = [
  { code: "ja", label: "日本語" },
  { code: "en", label: "English" },
];

export function LanguageSelectDropdown({
  value,
  onChange,
  disabled = false,
  updateTimelineFilter = true,
}: LanguageSelectDropdownProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (newValue: LanguageCode) => {
    // 投稿言語を更新
    onChange(newValue);

    // タイムラインの言語フィルタリングも更新する場合
    if (updateTimelineFilter) {
      startTransition(async () => {
        await setUserLocale(newValue as Locale);
        // ストーリーのキャッシュを無効化して、新しい言語で再取得
        queryClient.invalidateQueries({
          queryKey: ["stories"],
        });
        router.refresh();
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={disabled || isPending}
          className="text-primary hover:bg-primary/10 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          title={
            updateTimelineFilter
              ? "投稿言語を選択（タイムラインの言語フィルタも更新）"
              : "投稿言語を選択"
          }
        >
          <Globe className="h-4 w-4" />
          <span className="text-xs">
            {LANGUAGE_OPTIONS.find((opt) => opt.code === value)?.label}
          </span>
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
            {value === option.code && <span className="text-primary ml-auto">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { Globe, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type CommentSetting = "enabled" | "disabled";

type CommentSettingDropdownProps = {
  value: CommentSetting;
  onChange: (value: CommentSetting) => void;
  disabled?: boolean;
};

export function CommentSettingDropdown({
  value,
  onChange,
  disabled = false,
}: CommentSettingDropdownProps) {
  const tCommentSetting = useTranslations("comment-setting");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="text-muted-foreground hover:bg-muted flex items-center gap-1 rounded-full px-2 py-1 text-[10px] transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:gap-1.5 md:px-3 md:py-1.5 md:text-xs"
        >
          {value === "enabled" ? (
            <Globe className="h-3 w-3 md:h-3.5 md:w-3.5" />
          ) : (
            <Lock className="h-3 w-3 md:h-3.5 md:w-3.5" />
          )}
          <span className="text-[10px] md:text-xs">{tCommentSetting(value)}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onChange("enabled")} className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span>{tCommentSetting("enabled")}</span>
          {value === "enabled" && <span className="text-primary ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange("disabled")} className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          <span>{tCommentSetting("disabled")}</span>
          {value === "disabled" && <span className="text-primary ml-auto">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

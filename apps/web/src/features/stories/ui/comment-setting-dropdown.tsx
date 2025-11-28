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
          className="text-primary hover:bg-primary/10 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {value === "enabled" ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          <span>{tCommentSetting(value)}</span>
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

"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
} from "@quitmate/ui";
import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import { routing } from "@/i18n/routing";

export const LanguageSetting = () => {
  const locale = useLocale();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-[80px] border-gray-200 bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-700"
          aria-label="言語切り替え"
        >
          <div className="flex items-center justify-center">
            <Globe className="mr-2 size-[16px] text-gray-700" />
            <span>{locale.toUpperCase()}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[80px] border-gray-200 bg-white data-[state=open]:bg-white">
        {routing.locales
          .filter((loc) => loc !== locale)
          .map((loc) => (
            <DropdownMenuItem
              key={loc}
              onClick={() => {
                router.push(`/${loc}`);
              }}
              className="flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:bg-gray-100 data-[highlighted]:bg-gray-100"
            >
              {loc.toUpperCase()}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal, VolumeX, Volume2 } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { muteUser, unmuteUser } from "@/features/profiles/data/actions";

type Props = {
  targetUserId: string;
  initialIsMuted?: boolean;
  onMuteSuccess?: () => void;
};

export function ProfileOptionsMenu({ targetUserId, initialIsMuted = false, onMuteSuccess }: Props) {
  const t = useTranslations("mute");
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMuted, setIsMuted] = useState(initialIsMuted);
  const [successMessage, setSuccessMessage] = useState("");

  const handleMute = () => {
    startTransition(async () => {
      const result = await muteUser(targetUserId);
      if (result.success) {
        setIsMuted(true);
        setSuccessMessage(t("success"));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        onMuteSuccess?.();
      }
      setOpen(false);
    });
  };

  const handleUnmute = () => {
    startTransition(async () => {
      const result = await unmuteUser(targetUserId);
      if (result.success) {
        setIsMuted(false);
        setSuccessMessage(t("unmuteSuccess"));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
      setOpen(false);
    });
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isMuted ? (
            <DropdownMenuItem
              onClick={handleUnmute}
              disabled={isPending}
              className="cursor-pointer"
            >
              <Volume2 className="mr-2 size-4" />
              {t("unmute")}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleMute} disabled={isPending} className="cursor-pointer">
              <VolumeX className="mr-2 size-4" />
              {t("mute")}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* スナックバー表示 */}
      {showSuccess && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-green-600 px-4 py-2 text-white shadow-lg">
          {successMessage}
        </div>
      )}
    </>
  );
}

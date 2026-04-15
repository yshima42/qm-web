"use client";

import { useState, useTransition, useEffect } from "react";
import { MoreHorizontal, VolumeX, Volume2, Flag } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { muteUser, unmuteUser } from "@/features/profiles/data/actions";
import { ReportDialog } from "@/features/reports/ui/report-dialog";
import { ReportType } from "@/features/reports/domain/report-dto";

type Props = {
  targetUserId: string;
  initialIsMuted?: boolean;
  onMuteSuccess?: () => void;
};

export function ProfileOptionsMenu({ targetUserId, initialIsMuted = false, onMuteSuccess }: Props) {
  const t = useTranslations("mute");
  const tReport = useTranslations("report");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isMuted, setIsMuted] = useState(initialIsMuted);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  // propsが変わったらstateを同期
  useEffect(() => {
    setIsMuted(initialIsMuted);
  }, [initialIsMuted]);

  const handleMute = () => {
    startTransition(async () => {
      const result = await muteUser(targetUserId);
      if (result.success) {
        setIsMuted(true);
        toast.success(t("success"));
        onMuteSuccess?.();
        router.refresh();
      }
      setOpen(false);
    });
  };

  const handleUnmute = () => {
    startTransition(async () => {
      const result = await unmuteUser(targetUserId);
      if (result.success) {
        setIsMuted(false);
        toast.success(t("unmuteSuccess"));
        router.refresh();
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
          <DropdownMenuItem
            onClick={() => {
              setReportDialogOpen(true);
              setOpen(false);
            }}
            className="cursor-pointer"
          >
            <Flag className="mr-2 size-4" />
            {tReport("report")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 報告ダイアログ */}
      <ReportDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        reportDTO={{ type: ReportType.user, itemId: targetUserId }}
      />
    </>
  );
}

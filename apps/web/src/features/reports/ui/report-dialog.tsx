"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { reportItem } from "../data/actions";
import type { ReportDTO } from "../domain/report-dto";
import { ReportType } from "../domain/report-dto";

type ReportDialogProps = {
  /** ダイアログの開閉状態 */
  open: boolean;
  /** ダイアログの開閉状態を変更する関数 */
  onOpenChange: (open: boolean) => void;
  /** 報告対象のDTO */
  reportDTO: ReportDTO;
};

/**
 * 報告タイプに基づいて適切な確認メッセージを取得する
 * @param type 報告タイプ
 * @param t 翻訳関数
 * @returns 確認メッセージ
 */
function getReportMessage(type: ReportType, t: ReturnType<typeof useTranslations>): string {
  switch (type) {
    case ReportType.story:
      return t("content.story");
    case ReportType.comment:
      return t("content.comment");
    case ReportType.user:
      return t("content.user");
    case ReportType.article:
      return t("content.article");
    case ReportType.articleComment:
      return t("content.articleComment");
  }
}

/**
 * 報告ダイアログコンポーネント
 * ユーザーが不適切なコンテンツを報告するための確認ダイアログを表示する
 */
export function ReportDialog({ open, onOpenChange, reportDTO }: ReportDialogProps) {
  const t = useTranslations("reportDialog");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleReport = () => {
    startTransition(async () => {
      const result = await reportItem(reportDTO);
      if (result.success) {
        toast.success(t("reportComplete"));
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.error ?? "Report failed");
      }
    });
  };

  const message = getReportMessage(reportDTO.type, t);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              {t("cancel")}
            </Button>
            <Button onClick={handleReport} disabled={isPending}>
              {isPending ? t("reporting") : t("confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

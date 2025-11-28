"use client";

import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { HabitRegisterForm } from "./habit-register-form";
import { HabitTileDto } from "@/lib/types";

type HabitRegisterModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habits: HabitTileDto[];
};

export function HabitRegisterModal({ open, onOpenChange, habits }: HabitRegisterModalProps) {
  const t = useTranslations("habit-register");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 sm:max-w-[600px]" showCloseButton={false}>
        <DialogTitle className="sr-only">{t("title")}</DialogTitle>
        <HabitRegisterForm existingHabits={habits} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

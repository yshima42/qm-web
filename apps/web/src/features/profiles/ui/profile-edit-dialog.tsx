"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { ProfileEditForm } from "./profile-edit-form";
import { ProfileTileDto } from "@/lib/types";
import { useRouter } from "next/navigation";

type ProfileEditDialogProps = {
  profile: ProfileTileDto;
  children: React.ReactNode;
};

export function ProfileEditDialog({ profile, children }: ProfileEditDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
    router.refresh(); // モーダルを閉じた後にページをリフレッシュ
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto p-0 sm:rounded-2xl"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">プロフィールを編集</DialogTitle>
        {/* ヘッダー */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-4 py-3">
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground rounded-full p-2 transition-colors hover:bg-accent"
          >
            <X className="size-5" />
          </button>
          <h2 className="text-lg font-semibold">プロフィールを編集</h2>
          <div className="w-9" /> {/* スペーサー */}
        </div>

        {/* フォームコンテンツ */}
        <div className="p-4 sm:p-6">
          <ProfileEditForm profile={profile} onClose={handleClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}


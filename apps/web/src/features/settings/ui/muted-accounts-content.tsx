"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, VolumeX } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/features/profiles/ui/user-avatar";
import { unmuteUser } from "@/features/profiles/data/actions";
import type { MutedUser } from "@/features/profiles/data/data";

type Props = {
  initialMutedUsers: MutedUser[];
};

export function MutedAccountsContent({ initialMutedUsers }: Props) {
  const t = useTranslations("settings");
  const tMute = useTranslations("mute");
  const [mutedUsers, setMutedUsers] = useState(initialMutedUsers);
  const [isPending, startTransition] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUnmute = (userId: string) => {
    startTransition(async () => {
      const result = await unmuteUser(userId);
      if (result.success) {
        setMutedUsers((prev) => prev.filter((user) => user.id !== userId));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    });
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/settings">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{t("mutedAccounts")}</h1>
      </div>

      {mutedUsers.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center">{tMute("emptyMessage")}</div>
      ) : (
        <div className="space-y-1">
          {mutedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between rounded-lg border p-4">
              <Link
                href={`/${user.user_name}`}
                className="flex items-center gap-3 hover:opacity-80"
              >
                <UserAvatar
                  username={user.user_name}
                  displayName={user.display_name}
                  avatarUrl={user.avatar_url}
                  size="md"
                  linkable={false}
                />
                <div>
                  <div className="font-medium">{user.display_name}</div>
                  <div className="text-muted-foreground text-sm">@{user.user_name}</div>
                </div>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUnmute(user.id)}
                disabled={isPending}
              >
                <VolumeX className="mr-2 size-4" />
                {tMute("unmute")}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* スナックバー表示 */}
      {showSuccess && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-green-600 px-4 py-2 text-white shadow-lg">
          {tMute("unmuteSuccess")}
        </div>
      )}
    </div>
  );
}

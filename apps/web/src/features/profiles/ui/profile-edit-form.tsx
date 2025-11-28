"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Camera, Loader2 } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile } from "@/features/profiles/data/actions";
import { ProfileTileDto } from "@/lib/types";
import { PROFILE_VALIDATIONS } from "@/features/profiles/lib/profile-validations";

type ProfileEditFormProps = {
  profile: ProfileTileDto;
  onClose?: () => void;
};

export function ProfileEditForm({ profile, onClose }: ProfileEditFormProps) {
  const router = useRouter();
  const t = useTranslations("profile-edit");
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [userName, setUserName] = useState(profile.user_name);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(profile.avatar_url);
  const [displayNameError, setDisplayNameError] = useState<string | null>(null);
  const [userNameError, setUserNameError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, startSubmitTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setGeneralError("画像サイズは5MB以下にしてください");
      return;
    }

    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisplayNameError(null);
    setUserNameError(null);
    setGeneralError(null);

    if (!displayName || displayName.trim() === "") {
      setDisplayNameError("表示名は必須です");
      return;
    }

    if (displayName.length > PROFILE_VALIDATIONS.displayNameMaxLength) {
      setDisplayNameError(
        `表示名は${PROFILE_VALIDATIONS.displayNameMaxLength}文字以下にしてください`,
      );
      return;
    }

    if (!userName || userName.trim() === "") {
      setUserNameError("ユーザーIDは必須です");
      return;
    }

    if (userName.length < PROFILE_VALIDATIONS.userNameMinLength) {
      setUserNameError(
        `ユーザーIDは${PROFILE_VALIDATIONS.userNameMinLength}文字以上である必要があります`,
      );
      return;
    }

    if (userName.length > PROFILE_VALIDATIONS.userNameMaxLength) {
      setUserNameError(
        `ユーザーIDは${PROFILE_VALIDATIONS.userNameMaxLength}文字以下にしてください`,
      );
      return;
    }

    const formData = new FormData();
    formData.set("display_name", displayName.trim());
    formData.set("user_name", userName.trim());
    formData.set("bio", bio.trim());
    if (avatarFile) {
      formData.set("avatar", avatarFile);
    }

    startSubmitTransition(async () => {
      try {
        const result = await updateProfile(formData);
        if (!result.success) {
          if (
            result.errorCode === "userNameInvalid" ||
            result.errorCode === "userNameUnavailable"
          ) {
            setUserNameError(
              result.errorCode === "userNameInvalid"
                ? `ユーザーIDは${PROFILE_VALIDATIONS.userNameMinLength}-${PROFILE_VALIDATIONS.userNameMaxLength}文字の英数字とアンダースコアのみ使用できます`
                : "このユーザーIDは既に使用されています",
            );
          } else {
            setGeneralError(result.errorCode || "プロフィールの更新に失敗しました");
          }
          return;
        }
        // 成功したらモーダルを閉じて、プロフィールページをリフレッシュ
        if (onClose) {
          onClose();
        }
        // user_nameが変更された場合は新しいuser_nameにリダイレクト
        const redirectUserName = result.newUserName || profile.user_name;
        if (result.newUserName && result.newUserName !== profile.user_name) {
          router.push(`/${redirectUserName}`);
        } else {
          router.refresh();
        }
      } catch (error) {
        console.error("Profile update error:", error);
        setGeneralError("プロフィールの更新に失敗しました");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* アバター */}
      <div className="space-y-2">
        <Label>プロフィール画像</Label>
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="border-background relative size-24 overflow-hidden rounded-full border-2 transition-opacity hover:opacity-90"
          >
            {previewUrl ? (
              <>
                <Image
                  src={previewUrl}
                  alt={t("profile-edit.avatarAlt")}
                  width={96}
                  height={96}
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Camera className="size-6 text-white opacity-80" />
                </div>
              </>
            ) : (
              <div className="bg-muted flex size-full items-center justify-center">
                <Camera className="text-muted-foreground size-8" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* 表示名 */}
      <div className="space-y-2">
        <Label htmlFor="display_name">{t("displayNameLabel")}</Label>
        <Input
          id="display_name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          maxLength={PROFILE_VALIDATIONS.displayNameMaxLength}
          placeholder={t("displayNamePlaceholder")}
        />
        {displayNameError && <p className="text-destructive text-sm">{displayNameError}</p>}
        <p className="text-muted-foreground text-sm">
          {displayName.length}/{PROFILE_VALIDATIONS.displayNameMaxLength}
        </p>
      </div>

      {/* ユーザーID */}
      <div className="space-y-2">
        <Label htmlFor="user_name">ユーザーID *</Label>
        <Input
          id="user_name"
          value={userName}
          onChange={(e) => setUserName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
          maxLength={PROFILE_VALIDATIONS.userNameMaxLength}
          placeholder="ユーザーIDを入力"
        />
        {userNameError && <p className="text-destructive text-sm">{userNameError}</p>}
        <p className="text-muted-foreground text-sm">
          {userName.length}/{PROFILE_VALIDATIONS.userNameMaxLength}（
          {PROFILE_VALIDATIONS.userNameMinLength}文字以上、英数字とアンダースコアのみ）
        </p>
      </div>

      {/* 自己紹介 */}
      <div className="space-y-2">
        <Label htmlFor="bio">自己紹介</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          placeholder="自己紹介を入力（任意）"
          maxLength={160}
        />
        <p className="text-muted-foreground text-sm">{bio.length}/160</p>
      </div>

      {/* エラーメッセージ */}
      {generalError && (
        <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
          {generalError}
        </div>
      )}

      {/* ボタン */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (onClose) {
              onClose();
            } else {
              router.back();
            }
          }}
          disabled={isSubmitting}
        >
          キャンセル
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              保存中...
            </>
          ) : (
            "保存"
          )}
        </Button>
      </div>
    </form>
  );
}

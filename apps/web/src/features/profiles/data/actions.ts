"use server";

import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { differenceInDays } from "date-fns";
import sharp from "sharp";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCategoryUrl } from "@/lib/categories";
import { HabitCategoryName } from "@/lib/types";
import {
  generateUserName,
  normalizeUserNameInput,
  isValidUserName,
} from "@/features/profiles/lib/user-name";
import {
  AVATAR_MAX_WIDTH,
  AVATAR_MAX_HEIGHT,
  AVATAR_QUALITY,
  AVATAR_MAX_SIZE,
  AVATAR_BUCKET,
} from "@/features/profiles/lib/avatar-constants";
import { PROFILE_VALIDATIONS } from "@/features/profiles/lib/profile-validations";

export type OnboardingErrorCode =
  | "displayNameRequired"
  | "displayNameLength"
  | "userFetchFailed"
  | "profileLookupFailed"
  | "userNameRequired"
  | "userNameInvalid"
  | "userNameUnavailable"
  | "userNameCheckFailed"
  | "avatarInvalidType"
  | "avatarTooLarge"
  | "avatarUploadFailed"
  | "profileInsertFailed"
  | "habitCategoryRequired"
  | "customHabitNameRequired"
  | "habitReasonRequired"
  | "habitCreateFailed"
  | "generic";

type OnboardingResult = {
  errorCode?: OnboardingErrorCode;
  redirectTo?: string;
};

type UserNameAvailabilityResult = {
  available: boolean;
  errorCode?: OnboardingErrorCode;
};

const DEFAULT_REDIRECT_PATH = "/stories/habits/alcohol";

function sanitizeNextPath(next?: string | null) {
  if (!next || !next.startsWith("/")) {
    return DEFAULT_REDIRECT_PATH;
  }
  return next;
}

/**
 * 画像をリサイズ・圧縮する
 * Flutterアプリ側と同じ仕様:
 * - アスペクト比 1:1 でクロップ
 * - 400x400px にリサイズ
 * - 圧縮率 70% で圧縮
 * - 最大ファイルサイズ 256KB
 * - 透明がある場合はPNG、ない場合はJPEGで保存
 */
async function resizeAndCompressAvatar(
  imageBuffer: Buffer,
): Promise<{ buffer: Buffer; format: "png" | "jpeg" }> {
  const metadata = await sharp(imageBuffer).metadata();
  const hasAlpha = metadata.hasAlpha;

  const minDimension = Math.min(metadata.width || 0, metadata.height || 0);
  const left = Math.floor(((metadata.width || 0) - minDimension) / 2);
  const top = Math.floor(((metadata.height || 0) - minDimension) / 2);

  let processedBuffer: Buffer;

  if (hasAlpha) {
    // 透明がある場合はPNGで保存（圧縮レベルを調整）
    let compressionLevel = 9; // 最大圧縮
    do {
      processedBuffer = await sharp(imageBuffer)
        .extract({
          left,
          top,
          width: minDimension,
          height: minDimension,
        })
        .resize(AVATAR_MAX_WIDTH, AVATAR_MAX_HEIGHT, {
          fit: "cover",
          position: "center",
        })
        .png({ compressionLevel })
        .toBuffer();

      if (processedBuffer.length > AVATAR_MAX_SIZE && compressionLevel > 0) {
        compressionLevel -= 1; // 圧縮レベルを下げる（ファイルサイズは大きくなるが圧縮が弱くなる）
      }
    } while (processedBuffer.length > AVATAR_MAX_SIZE && compressionLevel > 0);
  } else {
    // 透明がない場合はJPEGで保存
    let quality = AVATAR_QUALITY;
    do {
      processedBuffer = await sharp(imageBuffer)
        .extract({
          left,
          top,
          width: minDimension,
          height: minDimension,
        })
        .resize(AVATAR_MAX_WIDTH, AVATAR_MAX_HEIGHT, {
          fit: "cover",
          position: "center",
        })
        .jpeg({ quality })
        .toBuffer();

      if (processedBuffer.length > AVATAR_MAX_SIZE) {
        quality -= 10; // 圧縮率を10%下げる
      }
    } while (processedBuffer.length > AVATAR_MAX_SIZE && quality > 10);
  }

  if (processedBuffer.length > AVATAR_MAX_SIZE) {
    throw new Error("Image too large after compression");
  }

  return { buffer: processedBuffer, format: hasAlpha ? "png" : "jpeg" };
}

async function uploadAvatar(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  file: File,
) {
  if (!file.type.startsWith("image/")) {
    return { errorCode: "avatarInvalidType" as OnboardingErrorCode };
  }

  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const { buffer: processedBuffer, format } = await resizeAndCompressAvatar(fileBuffer);

    if (processedBuffer.length > AVATAR_MAX_SIZE) {
      return { errorCode: "avatarTooLarge" as OnboardingErrorCode };
    }

    const fileExtension = format === "png" ? "png" : "jpg";
    const storagePath = `${userId}/${randomUUID()}.${fileExtension}`;
    const contentType = format === "png" ? "image/png" : "image/jpeg";

    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(storagePath, processedBuffer, {
        contentType,
      });

    if (uploadError) {
      console.error("[onboarding] avatar upload error", uploadError);
      return { errorCode: "avatarUploadFailed" as OnboardingErrorCode };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(storagePath);

    return { url: publicUrl };
  } catch (error) {
    console.error("[uploadAvatar] processing or upload error", error);
    return { errorCode: "avatarUploadFailed" as OnboardingErrorCode };
  }
}

export async function completeProfileOnboarding(formData: FormData): Promise<OnboardingResult> {
  const displayName = (formData.get("display_name") as string | null)?.trim();
  const nextParam = formData.get("next") as string | null;
  const avatarFile = formData.get("avatar");
  const userNameInput = formData.get("user_name") as string | null;
  const habitCategory = formData.get("habit_category") as string | null;
  const customHabitName = (formData.get("custom_habit_name") as string | null)?.trim();
  const habitStartedAt = formData.get("habit_started_at") as string | null;
  const habitReason = (formData.get("habit_reason") as string | null)?.trim();

  if (!displayName) {
    return { errorCode: "displayNameRequired" };
  }
  if (displayName.length > PROFILE_VALIDATIONS.displayNameMaxLength) {
    return { errorCode: "displayNameLength" };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("[onboarding] failed to fetch session user", userError);
    return { errorCode: "userFetchFailed" };
  }

  const { data: existingProfile, error: profileLookupError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileLookupError) {
    console.error("[onboarding] profile lookup error", profileLookupError);
    return { errorCode: "profileLookupFailed" };
  }

  const nextPath = sanitizeNextPath(nextParam);

  if (existingProfile) {
    return { redirectTo: nextPath };
  }

  const sanitizedUserName = normalizeUserNameInput(userNameInput) ?? generateUserName(user.id);

  if (!sanitizedUserName) {
    return { errorCode: "userNameRequired" };
  }

  if (!isValidUserName(sanitizedUserName)) {
    return { errorCode: "userNameInvalid" };
  }

  const { data: duplicatedUserName, error: userNameCheckError } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_name", sanitizedUserName)
    .maybeSingle();

  if (userNameCheckError) {
    console.error("[onboarding] username availability error", userNameCheckError);
    return { errorCode: "userNameCheckFailed" };
  }

  if (duplicatedUserName) {
    return { errorCode: "userNameUnavailable" };
  }

  let avatarUrl: string | null = null;

  if (avatarFile instanceof File && avatarFile.size > 0) {
    const uploadResult = await uploadAvatar(supabase, user.id, avatarFile);
    if (uploadResult?.errorCode) {
      return { errorCode: uploadResult.errorCode };
    }
    avatarUrl = uploadResult.url ?? null;
  }

  const { error: insertError } = await supabase.from("profiles").insert({
    id: user.id,
    user_name: sanitizedUserName,
    display_name: displayName,
    avatar_url: avatarUrl,
    bio: null,
  });

  if (insertError) {
    console.error("[onboarding] profile insert error", insertError);
    return { errorCode: "profileInsertFailed" };
  }

  // app_metadataにprofile_completedフラグを設定（次回以降のDBクエリをスキップ）
  try {
    const supabaseAdmin = createAdminClient();
    await supabaseAdmin.auth.admin.updateUserById(user.id, {
      app_metadata: { profile_completed: true },
    });
  } catch (error) {
    // app_metadata更新の失敗はクリティカルではないのでログのみ
    console.error("[onboarding] failed to update app_metadata", error);
  }

  // 習慣登録
  if (habitCategory && habitStartedAt && habitReason) {
    const isCustomCategory = habitCategory === "Custom";
    if (isCustomCategory && !customHabitName) {
      return { errorCode: "customHabitNameRequired" };
    }

    // Convert local datetime to UTC ISO 8601 string
    const startedAtDate = new Date(habitStartedAt);
    const startedAtUtc = startedAtDate.toISOString();

    const { error: habitError } = await supabase.rpc("habit_create_transaction", {
      p_user_id: user.id,
      p_habit_category_name: habitCategory,
      p_custom_habit_name: isCustomCategory ? customHabitName : null,
      p_reason: habitReason,
      p_started_at: startedAtUtc,
      p_duration_months: null,
      p_frequency_per_week: null,
    });

    if (habitError) {
      console.error("[onboarding] habit creation error", habitError);
      return { errorCode: "habitCreateFailed" };
    }

    // 理由がある場合は自動でストーリーに投稿
    if (habitReason.trim()) {
      try {
        // 作成された習慣を取得（最新の習慣を取得）
        const { data: habitsData, error: fetchError } = await supabase
          .from("habits")
          .select(
            `
            id,
            habit_category_id,
            custom_habit_name,
            habit_categories!inner(habit_category_name),
            trials(id, started_at, ended_at)
          `,
          )
          .eq("user_id", user.id)
          .eq("habit_categories.habit_category_name", habitCategory)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!fetchError && habitsData) {
          // アクティブなtrialを取得
          const activeTrial = habitsData.trials?.find((t) => !t.ended_at);
          if (activeTrial) {
            // 経過日数を計算
            const trialStartedAt = new Date(activeTrial.started_at);
            const now = new Date();
            const trialElapsedDays = differenceInDays(now, trialStartedAt);

            // ストーリーを作成
            const { error: storyError } = await supabase.from("stories").insert({
              content: habitReason.trim(),
              user_id: user.id,
              habit_category_id: habitsData.habit_category_id,
              custom_habit_name: habitsData.custom_habit_name,
              trial_started_at: activeTrial.started_at,
              trial_elapsed_days: trialElapsedDays,
              comment_setting: "enabled",
              is_reason: true,
            });

            if (storyError) {
              console.error("[onboarding] Error creating story:", storyError);
              // ストーリー作成の失敗は習慣登録を失敗させない
            }
          }
        }
      } catch (err) {
        console.error("[onboarding] Error posting reason to story:", err);
        // ストーリー作成の失敗は習慣登録を失敗させない
      }
    }

    // 習慣を登録した場合は、登録した習慣のカテゴリーのURLを返す
    const habitCategoryUrl = getCategoryUrl(habitCategory as HabitCategoryName);

    // キャッシュを無効化して最新のデータを取得できるようにする
    revalidatePath("/", "layout");

    return { redirectTo: habitCategoryUrl };
  }

  // 習慣を登録しなかった場合
  // キャッシュを無効化して最新のデータを取得できるようにする
  revalidatePath("/", "layout");

  return { redirectTo: nextPath };
}

export async function checkUserNameAvailability(
  userName: string,
): Promise<UserNameAvailabilityResult> {
  const sanitizedUserName = normalizeUserNameInput(userName);
  if (!sanitizedUserName) {
    return {
      available: false,
      errorCode: "userNameRequired",
    };
  }

  if (!isValidUserName(sanitizedUserName)) {
    return { available: false, errorCode: "userNameInvalid" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_name", sanitizedUserName)
    .maybeSingle();

  if (error) {
    console.error("[onboarding] username availability error", error);
    return {
      available: false,
      errorCode: "userNameCheckFailed",
    };
  }

  if (data) {
    return { available: false, errorCode: "userNameUnavailable" };
  }

  return { available: true };
}

export type UpdateProfileResult = {
  success: boolean;
  errorCode?: string;
  newUserName?: string;
};

/**
 * プロフィールを更新する
 */
export async function updateProfile(formData: FormData): Promise<UpdateProfileResult> {
  const displayName = (formData.get("display_name") as string | null)?.trim();
  const bio = (formData.get("bio") as string | null)?.trim();
  const userNameInput = formData.get("user_name") as string | null;
  const avatarFile = formData.get("avatar");

  if (!displayName) {
    return { success: false, errorCode: "displayNameRequired" };
  }
  if (displayName.length > PROFILE_VALIDATIONS.displayNameMaxLength) {
    return { success: false, errorCode: "displayNameLength" };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("[profile update] failed to fetch session user", userError);
    return { success: false, errorCode: "userFetchFailed" };
  }

  // user_nameの更新がある場合、バリデーションと重複チェック
  let newUserName: string | undefined = undefined;
  if (userNameInput) {
    const sanitizedUserName = normalizeUserNameInput(userNameInput);
    if (!sanitizedUserName) {
      return { success: false, errorCode: "userNameRequired" };
    }

    if (!isValidUserName(sanitizedUserName)) {
      return { success: false, errorCode: "userNameInvalid" };
    }

    // 現在のuser_nameと異なる場合のみ重複チェック
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("user_name")
      .eq("id", user.id)
      .maybeSingle();

    if (currentProfile?.user_name !== sanitizedUserName) {
      const { data: duplicatedUserName, error: userNameCheckError } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_name", sanitizedUserName)
        .maybeSingle();

      if (userNameCheckError) {
        console.error("[profile update] username availability error", userNameCheckError);
        return { success: false, errorCode: "userNameCheckFailed" };
      }

      if (duplicatedUserName) {
        return { success: false, errorCode: "userNameUnavailable" };
      }

      newUserName = sanitizedUserName;
    }
  }

  let avatarUrl: string | null | undefined = undefined;

  if (avatarFile instanceof File && avatarFile.size > 0) {
    const uploadResult = await uploadAvatar(supabase, user.id, avatarFile);
    if (uploadResult?.errorCode) {
      return { success: false, errorCode: uploadResult.errorCode };
    }
    avatarUrl = uploadResult.url ?? null;
  }

  const updateData: {
    display_name: string;
    bio: string | null;
    user_name?: string;
    avatar_url?: string | null;
  } = {
    display_name: displayName,
    bio: bio || null,
  };

  if (newUserName !== undefined) {
    updateData.user_name = newUserName;
  }

  if (avatarUrl !== undefined) {
    updateData.avatar_url = avatarUrl;
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  if (updateError) {
    console.error("[profile update] profile update error", updateError);
    return { success: false, errorCode: "profileUpdateFailed" };
  }

  // user_nameが変更された場合は、新しいuser_nameを返す
  return { success: true, newUserName };
}

// =====================
// フォロー関連アクション
// =====================

export type FollowResult = {
  success: boolean;
  errorCode?: "notLoggedIn" | "cannotFollowSelf" | "alreadyFollowing" | "followFailed" | "generic";
};

export type UnfollowResult = {
  success: boolean;
  errorCode?: "notLoggedIn" | "cannotUnfollowSelf" | "unfollowFailed" | "generic";
};

/**
 * ユーザーをフォローする
 */
export async function followUser(targetUserId: string): Promise<FollowResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, errorCode: "notLoggedIn" };
  }

  if (user.id === targetUserId) {
    return { success: false, errorCode: "cannotFollowSelf" };
  }

  // 既にフォローしているかチェック
  const { data: existingFollow } = await supabase
    .from("followers")
    .select("follower_id")
    .eq("follower_id", user.id)
    .eq("followed_id", targetUserId)
    .maybeSingle();

  if (existingFollow) {
    return { success: false, errorCode: "alreadyFollowing" };
  }

  const { error: insertError } = await supabase.from("followers").insert({
    follower_id: user.id,
    followed_id: targetUserId,
  });

  if (insertError) {
    console.error("[followUser] insert error", insertError);
    return { success: false, errorCode: "followFailed" };
  }

  return { success: true };
}

/**
 * ユーザーのフォローを解除する
 */
export async function unfollowUser(targetUserId: string): Promise<UnfollowResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, errorCode: "notLoggedIn" };
  }

  if (user.id === targetUserId) {
    return { success: false, errorCode: "cannotUnfollowSelf" };
  }

  const { error: deleteError } = await supabase
    .from("followers")
    .delete()
    .eq("follower_id", user.id)
    .eq("followed_id", targetUserId);

  if (deleteError) {
    console.error("[unfollowUser] delete error", deleteError);
    return { success: false, errorCode: "unfollowFailed" };
  }

  return { success: true };
}

// =====================
// ミュート関連アクション
// =====================

export type MuteResult = {
  success: boolean;
  errorCode?: "notLoggedIn" | "cannotMuteSelf" | "alreadyMuted" | "muteFailed" | "generic";
};

export type UnmuteResult = {
  success: boolean;
  errorCode?: "notLoggedIn" | "unmuteFailed" | "generic";
};

/**
 * ユーザーをミュートする
 */
export async function muteUser(targetUserId: string): Promise<MuteResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, errorCode: "notLoggedIn" };
  }

  if (user.id === targetUserId) {
    return { success: false, errorCode: "cannotMuteSelf" };
  }

  // 既にミュートしているかチェック
  const { data: existingMute } = await supabase
    .from("blocked_users")
    .select("blocker_id")
    .eq("blocker_id", user.id)
    .eq("blocked_id", targetUserId)
    .maybeSingle();

  if (existingMute) {
    return { success: false, errorCode: "alreadyMuted" };
  }

  const { error: insertError } = await supabase.from("blocked_users").insert({
    blocker_id: user.id,
    blocked_id: targetUserId,
  });

  if (insertError) {
    console.error("[muteUser] insert error", insertError);
    return { success: false, errorCode: "muteFailed" };
  }

  return { success: true };
}

/**
 * ユーザーのミュートを解除する
 */
export async function unmuteUser(targetUserId: string): Promise<UnmuteResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, errorCode: "notLoggedIn" };
  }

  const { error: deleteError } = await supabase
    .from("blocked_users")
    .delete()
    .eq("blocker_id", user.id)
    .eq("blocked_id", targetUserId);

  if (deleteError) {
    console.error("[unmuteUser] delete error", deleteError);
    return { success: false, errorCode: "unmuteFailed" };
  }

  return { success: true };
}

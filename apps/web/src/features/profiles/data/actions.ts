"use server";

import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";

import { createClient } from "@/lib/supabase/server";
import {
  generateUserName,
  normalizeUserNameInput,
  isValidUserName,
} from "@/features/profiles/lib/user-name";

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
const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB
const AVATAR_BUCKET = "avatars";

function sanitizeNextPath(next?: string | null) {
  if (!next || !next.startsWith("/")) {
    return DEFAULT_REDIRECT_PATH;
  }
  return next;
}

async function uploadAvatar(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  file: File
) {
  if (!file.type.startsWith("image/")) {
    return { errorCode: "avatarInvalidType" as OnboardingErrorCode };
  }
  if (file.size > MAX_AVATAR_SIZE) {
    return { errorCode: "avatarTooLarge" as OnboardingErrorCode };
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "png";
  const storagePath = `${userId}/${randomUUID()}.${extension}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: file.type || "image/png",
    });

  if (uploadError) {
    console.error("[onboarding] avatar upload error", uploadError);
    return { errorCode: "avatarUploadFailed" as OnboardingErrorCode };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(storagePath);

  return { url: publicUrl };
}

export async function completeProfileOnboarding(
  formData: FormData
): Promise<OnboardingResult> {
  const displayName = (formData.get("display_name") as string | null)?.trim();
  const nextParam = formData.get("next") as string | null;
  const avatarFile = formData.get("avatar");
  const userNameInput = formData.get("user_name") as string | null;

  if (!displayName) {
    return { errorCode: "displayNameRequired" };
  }
  if (displayName.length > 50) {
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

  const sanitizedUserName =
    normalizeUserNameInput(userNameInput) ?? generateUserName(user.id);

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

  return { redirectTo: nextPath };
}

export async function checkUserNameAvailability(
  userName: string
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


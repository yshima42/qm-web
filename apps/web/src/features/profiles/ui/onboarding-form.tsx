"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Camera, Check, Loader2 } from "lucide-react";
import {
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@quitmate/ui";
import {
  checkUserNameAvailability,
  completeProfileOnboarding,
  type OnboardingErrorCode,
} from "@/features/profiles/data/actions";
import { isValidUserName, normalizeUserNameInput } from "@/features/profiles/lib/user-name";
import { createClient } from "@/lib/supabase/client";
import { HABIT_CATEGORIES } from "@/lib/categories";
import { HabitCategoryName } from "@/lib/types";

type ProfileOnboardingFormProps = {
  next?: string;
  defaultUserName: string;
};

const steps = [
  { id: 1, key: "nickname" },
  { id: 2, key: "username" },
  { id: 3, key: "avatar" },
  { id: 4, key: "habit" },
] as const;

type StepKey = (typeof steps)[number]["key"];

export function ProfileOnboardingForm({ next, defaultUserName }: ProfileOnboardingFormProps) {
  const router = useRouter();
  const t = useTranslations("onboarding");
  const tCategory = useTranslations("categories");
  const totalSteps = steps.length;
  const [currentStep, setCurrentStep] = useState<(typeof steps)[number]["id"]>(1);
  const [displayName, setDisplayName] = useState("");
  const [userName, setUserName] = useState(defaultUserName ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [displayNameError, setDisplayNameError] = useState<string | null>(null);
  const [userNameError, setUserNameError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [habitCategory, setHabitCategory] = useState<HabitCategoryName | "">("");
  const [customHabitName, setCustomHabitName] = useState("");
  const [habitStartedAt, setHabitStartedAt] = useState(
    new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm format
  );
  const [habitReason, setHabitReason] = useState("");
  const [habitError, setHabitError] = useState<string | null>(null);

  const [isSubmitting, startSubmitTransition] = useTransition();
  const [isCheckingUserName, startCheckUserNameTransition] = useTransition();
  const [isLoggingOut, startLogoutTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const activeStep = useMemo(
    () => steps.find((step) => step.id === currentStep) ?? steps[0],
    [currentStep],
  );

  const progress = useMemo(() => {
    const pct = (currentStep / totalSteps) * 100;
    const start = Math.max(8, (currentStep - 1) * (100 / totalSteps) + 5);
    return Math.max(pct, start);
  }, [currentStep, totalSteps]);

  const stepKey = activeStep.key as StepKey;
  const stepDescription = t(`steps.${stepKey}.description`);
  const progressLabel = t("progress", {
    current: currentStep,
    total: totalSteps,
  });
  const isFinalStep = currentStep === steps[steps.length - 1].id;

  const translateError = (code?: OnboardingErrorCode | null) => {
    if (!code) return t("errors.generic");
    return t(`errors.${code}` as never);
  };

  const validateDisplayName = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) {
        return { value: trimmed, error: t("errors.displayNameRequired") };
      }
      if (trimmed.length > 50) {
        return { value: trimmed, error: t("errors.displayNameLength") };
      }
      return { value: trimmed, error: null };
    },
    [t],
  );

  const validateUserNameInput = useCallback(
    (value: string) => {
      const normalized = normalizeUserNameInput(value);
      if (!normalized) {
        return { value: normalized, error: t("errors.userNameRequired") };
      }
      if (!isValidUserName(normalized)) {
        return { value: normalized, error: t("errors.userNameInvalid") };
      }
      return { value: normalized, error: null };
    },
    [t],
  );

  const handleAvatarPreview = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!file) {
      setPreviewUrl(null);
      setSelectedFileName(null);
      setAvatarFile(null);
      return;
    }

    setSelectedFileName(file.name);
    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const triggerAvatarSelect = () => {
    if (isSubmitting) return;
    fileInputRef.current?.click();
  };

  const handleDisplayNameNext = () => {
    const { value, error } = validateDisplayName(displayName);
    if (error) {
      setDisplayNameError(error);
      return;
    }
    setDisplayName(value);
    setDisplayNameError(null);
    setCurrentStep(2);
  };

  const handleUserNameNext = () => {
    const { value: normalized, error } = validateUserNameInput(userName);
    if (error || !normalized) {
      setUserNameError(error);
      return;
    }
    setUserNameError(null);
    setGeneralError(null);
    startCheckUserNameTransition(async () => {
      const result = await checkUserNameAvailability(normalized);
      if (!result.available) {
        setUserNameError(translateError(result.errorCode));
        return;
      }
      setUserName(normalized);
      setCurrentStep(3);
    });
  };

  const handleAvatarNext = () => {
    setCurrentStep(4);
  };

  const handleHabitBack = () => {
    setCurrentStep(3);
  };

  const validateHabitInput = useCallback(() => {
    if (!habitCategory) {
      setHabitError(t("errors.habitCategoryRequired"));
      return false;
    }

    const isCustomCategory = habitCategory === "Custom";
    if (isCustomCategory && !customHabitName.trim()) {
      setHabitError(t("errors.customHabitNameRequired"));
      return false;
    }

    if (!habitReason.trim()) {
      setHabitError(t("errors.habitReasonRequired"));
      return false;
    }

    return true;
  }, [habitCategory, customHabitName, habitReason, t]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFinalStep || isSubmitting) return;

    const { value: safeDisplayName, error: displayError } = validateDisplayName(displayName);
    if (displayError || !safeDisplayName) {
      setCurrentStep(1);
      setDisplayNameError(displayError);
      return;
    }

    const { value: safeUserName, error: userNameValidationError } = validateUserNameInput(userName);

    if (userNameValidationError || !safeUserName) {
      setCurrentStep(2);
      setUserNameError(userNameValidationError);
      return;
    }

    // 習慣登録のバリデーション
    if (!validateHabitInput()) {
      setCurrentStep(4);
      return;
    }

    const isCustomCategory = habitCategory === "Custom";

    const formData = new FormData();
    formData.set("display_name", safeDisplayName);
    formData.set("user_name", safeUserName);
    formData.set("next", next ?? "");
    if (avatarFile) {
      formData.set("avatar", avatarFile);
    }
    formData.set("habit_category", habitCategory);
    if (isCustomCategory) {
      formData.set("custom_habit_name", customHabitName.trim());
    }
    formData.set("habit_started_at", habitStartedAt);
    formData.set("habit_reason", habitReason.trim());

    setGeneralError(null);
    setHabitError(null);
    startSubmitTransition(async () => {
      const result = await completeProfileOnboarding(formData);
      if (result?.errorCode) {
        setGeneralError(translateError(result.errorCode));
        return;
      }
      router.replace(result?.redirectTo ?? "/stories/habits/alcohol");
    });
  };

  const handleBackToTop = () => {
    if (isLoggingOut) return;
    startLogoutTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("[onboarding] failed to sign out", error);
      }
      router.replace("/");
    });
  };

  return (
    <form
      className="border-border bg-card/90 space-y-8 rounded-2xl border p-6 shadow-lg"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
    >
      <div className="space-y-3">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.3em]">
          {progressLabel}
        </p>
        <div className="bg-muted/60 h-1.5 rounded-full">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#0C4F44] via-[#0E6B4A] to-[#12A150] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-muted-foreground text-sm">{stepDescription}</p>
      </div>

      {currentStep === 1 && (
        <div className="space-y-3">
          <Label htmlFor="display_name" className="text-sm font-medium">
            {t("steps.nickname.label")}
          </Label>
          <Input
            id="display_name"
            value={displayName}
            onChange={(event) => {
              setDisplayName(event.target.value);
              setDisplayNameError(null);
            }}
            placeholder={t("steps.nickname.placeholder")}
            maxLength={50}
            disabled={isSubmitting}
            required
          />
          <p className="text-muted-foreground text-xs">{t("steps.nickname.helper")}</p>
          {displayNameError && <p className="text-destructive text-sm">{displayNameError}</p>}
          <div className="space-y-3 pt-2">
            <Button type="button" className="w-full" onClick={handleDisplayNameNext}>
              {t("buttons.next")}
            </Button>
            <button
              type="button"
              onClick={handleBackToTop}
              className="text-muted-foreground hover:text-foreground mx-auto block text-xs font-medium underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoggingOut}
            >
              {t("buttons.backToTop")}
            </button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="user_name" className="text-sm font-medium">
              {t("steps.username.label")}
            </Label>
            <Input
              id="user_name"
              value={userName}
              onChange={(event) => {
                setUserName(event.target.value);
                setUserNameError(null);
              }}
              placeholder={t("steps.username.placeholder")}
              disabled={isSubmitting || isCheckingUserName}
              required
            />
            <p className="text-muted-foreground text-xs">{t("steps.username.helper")}</p>
            {userNameError && <p className="text-destructive text-sm">{userNameError}</p>}
          </div>
          <div className="space-y-3 pt-2">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:flex-1"
                onClick={() => setCurrentStep(1)}
                disabled={isSubmitting || isCheckingUserName}
              >
                {t("buttons.back")}
              </Button>
              <Button
                type="button"
                className="w-full sm:flex-1"
                onClick={handleUserNameNext}
                disabled={isCheckingUserName}
              >
                {isCheckingUserName ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {t("buttons.checking")}
                  </>
                ) : (
                  t("buttons.next")
                )}
              </Button>
            </div>
            <button
              type="button"
              onClick={handleBackToTop}
              className="text-muted-foreground hover:text-foreground mx-auto block text-xs font-medium underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoggingOut}
            >
              {t("buttons.backToTop")}
            </button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <>
          <div className="flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={triggerAvatarSelect}
              className="border-muted-foreground/40 bg-muted/40 hover:border-primary hover:bg-primary/5 group relative flex size-36 items-center justify-center rounded-full border border-dashed transition"
            >
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt={t("steps.avatar.previewAlt")}
                  width={140}
                  height={140}
                  className="size-36 rounded-full object-cover"
                />
              ) : (
                <div className="text-muted-foreground flex flex-col items-center">
                  <Camera className="mb-1 size-8" />
                  <span className="text-xs font-medium">{t("steps.avatar.button")}</span>
                </div>
              )}
              {previewUrl && (
                <span className="bg-primary text-primary-foreground absolute -bottom-2 right-1 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold shadow">
                  <Check className="size-3" />
                  {t("steps.avatar.selectedBadge")}
                </span>
              )}
            </button>
            <div className="text-center">
              <p className="text-sm font-medium">{t("steps.avatar.label")}</p>
              <p className="text-muted-foreground text-xs">{t("steps.avatar.helper")}</p>
              {selectedFileName && (
                <p className="text-foreground mt-1 text-xs">{selectedFileName}</p>
              )}
            </div>
            <Input
              id="avatar"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isSubmitting}
              onChange={handleAvatarPreview}
            />
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:flex-1"
                onClick={() => setCurrentStep(2)}
                disabled={isSubmitting}
              >
                {t("buttons.back")}
              </Button>
              <Button
                type="button"
                className="w-full sm:flex-[1.5]"
                onClick={handleAvatarNext}
                disabled={isSubmitting}
              >
                {t("buttons.next")}
              </Button>
            </div>
            <button
              type="button"
              onClick={handleBackToTop}
              className="text-muted-foreground hover:text-foreground mx-auto block text-xs font-medium underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoggingOut}
            >
              {t("buttons.backToTop")}
            </button>
          </div>
        </>
      )}

      {currentStep === 4 && (
        <div className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="habit_category" className="text-sm font-medium">
              {t("steps.habit.categoryLabel")}
            </Label>
            <Select
              value={habitCategory}
              onValueChange={(value) => {
                setHabitCategory(value as HabitCategoryName);
                setHabitError(null);
              }}
            >
              <SelectTrigger id="habit_category">
                <SelectValue placeholder={t("steps.habit.categoryPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {HABIT_CATEGORIES.filter((cat) => cat !== "Official").map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {tCategory(cat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {habitCategory === "Custom" && (
              <div className="space-y-2">
                <Label htmlFor="custom_habit_name" className="text-sm font-medium">
                  {t("steps.habit.customHabitNameLabel")}
                </Label>
                <Input
                  id="custom_habit_name"
                  value={customHabitName}
                  onChange={(e) => {
                    setCustomHabitName(e.target.value);
                    setHabitError(null);
                  }}
                  placeholder={t("steps.habit.customHabitNamePlaceholder")}
                  disabled={isSubmitting}
                />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="habit_started_at" className="text-sm font-medium">
              {t("steps.habit.startedAtLabel")}
            </Label>
            <Input
              id="habit_started_at"
              type="datetime-local"
              value={habitStartedAt}
              onChange={(e) => {
                setHabitStartedAt(e.target.value);
                setHabitError(null);
              }}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="habit_reason" className="text-sm font-medium">
              {t("steps.habit.reasonLabel")}
            </Label>
            <Input
              id="habit_reason"
              value={habitReason}
              onChange={(e) => {
                setHabitReason(e.target.value);
                setHabitError(null);
              }}
              placeholder={t("steps.habit.reasonPlaceholder")}
              disabled={isSubmitting}
              required
            />
            <p className="text-muted-foreground text-xs">{t("steps.habit.reasonHelper")}</p>
          </div>

          {habitError && <p className="text-destructive text-sm">{habitError}</p>}

          <div className="space-y-3 pt-2">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:flex-1"
                onClick={handleHabitBack}
                disabled={isSubmitting}
              >
                {t("buttons.back")}
              </Button>
              <Button type="submit" className="w-full sm:flex-[1.5]" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {t("buttons.saving")}
                  </>
                ) : (
                  t("buttons.start")
                )}
              </Button>
            </div>
            <button
              type="button"
              onClick={handleBackToTop}
              className="text-muted-foreground hover:text-foreground mx-auto block text-xs font-medium underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoggingOut}
            >
              {t("buttons.backToTop")}
            </button>
          </div>
        </div>
      )}

      {generalError && <p className="text-destructive text-sm">{generalError}</p>}
    </form>
  );
}

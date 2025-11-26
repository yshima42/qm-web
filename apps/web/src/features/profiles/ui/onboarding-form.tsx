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
import {
  checkUserNameAvailability,
  completeProfileOnboarding,
  type OnboardingErrorCode,
} from "@/features/profiles/data/actions";
import {
  isValidUserName,
  normalizeUserNameInput,
} from "@/features/profiles/lib/user-name";
import { createClient } from "@/lib/supabase/client";

type ProfileOnboardingFormProps = {
  next?: string;
  defaultUserName: string;
};

const steps = [
  { id: 1, key: "nickname" },
  { id: 2, key: "username" },
  { id: 3, key: "avatar" },
] as const;

type StepKey = (typeof steps)[number]["key"];

export function ProfileOnboardingForm({
  next,
  defaultUserName,
}: ProfileOnboardingFormProps) {
  const router = useRouter();
  const t = useTranslations("onboarding");
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
    [currentStep]
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
    [t]
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
    [t]
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFinalStep || isSubmitting) return;

    const { value: safeDisplayName, error: displayError } =
      validateDisplayName(displayName);
    if (displayError || !safeDisplayName) {
      setCurrentStep(1);
      setDisplayNameError(displayError);
      return;
    }

    const { value: safeUserName, error: userNameValidationError } =
      validateUserNameInput(userName);

    if (userNameValidationError || !safeUserName) {
      setCurrentStep(2);
      setUserNameError(userNameValidationError);
      return;
    }

    const formData = new FormData();
    formData.set("display_name", safeDisplayName);
    formData.set("user_name", safeUserName);
    formData.set("next", next ?? "");
    if (avatarFile) {
      formData.set("avatar", avatarFile);
    }

    setGeneralError(null);
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
      className="space-y-8 rounded-2xl border border-border bg-card/90 p-6 shadow-lg"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
    >
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          {progressLabel}
        </p>
        <div className="h-1.5 rounded-full bg-muted/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#0C4F44] via-[#0E6B4A] to-[#12A150] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground">{stepDescription}</p>
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
          <p className="text-xs text-muted-foreground">
            {t("steps.nickname.helper")}
          </p>
          {displayNameError && (
            <p className="text-sm text-destructive">{displayNameError}</p>
          )}
          <div className="space-y-3 pt-2">
            <Button
              type="button"
              className="w-full"
              onClick={handleDisplayNameNext}
            >
              {t("buttons.next")}
            </Button>
            <button
              type="button"
              onClick={handleBackToTop}
              className="mx-auto block text-xs font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
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
            <p className="text-xs text-muted-foreground">
              {t("steps.username.helper")}
            </p>
            {userNameError && (
              <p className="text-sm text-destructive">{userNameError}</p>
            )}
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
              className="mx-auto block text-xs font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
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
              className="group relative flex size-36 items-center justify-center rounded-full border border-dashed border-muted-foreground/40 bg-muted/40 transition hover:border-primary hover:bg-primary/5"
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
                <div className="flex flex-col items-center text-muted-foreground">
                  <Camera className="mb-1 size-8" />
                  <span className="text-xs font-medium">
                    {t("steps.avatar.button")}
                  </span>
                </div>
              )}
              {previewUrl && (
                <span className="absolute -bottom-2 right-1 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow">
                  <Check className="size-3" />
                  {t("steps.avatar.selectedBadge")}
                </span>
              )}
            </button>
            <div className="text-center">
              <p className="text-sm font-medium">{t("steps.avatar.label")}</p>
              <p className="text-xs text-muted-foreground">
                {t("steps.avatar.helper")}
              </p>
              {selectedFileName && (
                <p className="mt-1 text-xs text-foreground">{selectedFileName}</p>
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
                type="submit"
                className="w-full sm:flex-[1.5]"
                disabled={isSubmitting}
              >
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
              className="mx-auto block text-xs font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoggingOut}
            >
              {t("buttons.backToTop")}
            </button>
          </div>
        </>
      )}

      {generalError && (
        <p className="text-sm text-destructive">{generalError}</p>
      )}
    </form>
  );
}


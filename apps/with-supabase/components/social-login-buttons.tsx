"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button_mail";
import { useState } from "react";

interface SocialLoginButtonsProps {
  isLoading?: boolean;
  onError?: (error: string) => void;
  loadingText?: {
    google?: string;
    apple?: string;
  };
  buttonText?: {
    google?: string;
    apple?: string;
  };
}

export function SocialLoginButtons({
  isLoading: externalLoading,
  onError,
  loadingText,
  buttonText,
}: SocialLoginButtonsProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleSocialLogin = async (provider: "google" | "apple") => {
    const supabase = createClient();
    setIsLoading(true);
    setLoadingProvider(provider);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/protected`,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setError(errorMessage);
      setIsLoading(false);
      setLoadingProvider(null);
      onError?.(errorMessage);
    }
  };

  const isButtonLoading = externalLoading || isLoading;

  return (
    <>
      {error && <p className="text-sm text-destructive-500">{error}</p>}
      <Button
        type="button"
        className="w-full"
        disabled={isButtonLoading}
        onClick={() => handleSocialLogin("google")}
      >
        {loadingProvider === "google"
          ? loadingText?.google || "Logging in..."
          : buttonText?.google || "Continue with Google"}
      </Button>
      <Button
        type="button"
        className="w-full"
        disabled={isButtonLoading}
        onClick={() => handleSocialLogin("apple")}
      >
        {loadingProvider === "apple"
          ? loadingText?.apple || "Logging in..."
          : buttonText?.apple || "Continue with Apple"}
      </Button>
    </>
  );
}


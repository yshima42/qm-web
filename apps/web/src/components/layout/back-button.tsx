"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  backUrl?: string;
};

export function BackButton({ backUrl }: BackButtonProps) {
  const router = useRouter();

  if (backUrl) {
    return (
      <Link
        href={backUrl}
        className="text-foreground hover:bg-muted -ml-2 flex size-9 items-center justify-center rounded-full transition-colors"
      >
        <ArrowLeft className="text-foreground size-5" />
      </Link>
    );
  }

  return (
    <button
      onClick={() => router.back()}
      className="text-foreground hover:bg-muted -ml-2 flex size-9 items-center justify-center rounded-full transition-colors"
    >
      <ArrowLeft className="text-foreground size-5" />
    </button>
  );
}

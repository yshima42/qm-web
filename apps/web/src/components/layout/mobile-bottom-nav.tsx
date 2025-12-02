"use client";

import { Home, ClipboardCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

type MobileBottomNavProps = {
  currentUserUsername?: string | null;
};

export function MobileBottomNav({ currentUserUsername }: MobileBottomNavProps) {
  const pathname = usePathname();
  const t = useTranslations("sidebar");

  // ホームのパス（ルートにリダイレクトするとサーバー側で適切なパスにリダイレクトされる）
  const homePath = "/";
  const habitsPath = "/habits";

  // ホームはルートパスまたはコミュニティタイムラインページでアクティブ
  const isHomeActive = pathname === "/" || pathname.startsWith("/stories/habits");
  const isHabitsActive = pathname === habitsPath;

  return (
    <nav
      aria-label="モバイルボトムナビゲーション"
      className="border-border/80 bg-background/95 supports-[backdrop-filter]:bg-background/80 with-safe-area-bottom fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur-md md:hidden"
    >
      <div className="mx-auto flex h-14 max-w-md flex-1 items-center justify-around px-2">
        {/* ホーム */}
        <Link
          href={homePath}
          aria-current={isHomeActive ? "page" : undefined}
          className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 text-[10px] font-medium transition-colors ${
            isHomeActive ? "text-primary-light dark:text-primary-dark" : "text-muted-foreground"
          }`}
        >
          <Home className={`size-5 ${isHomeActive ? "fill-current" : ""}`} />
          <span>{t("home")}</span>
        </Link>

        {/* 習慣 */}
        {currentUserUsername && (
          <Link
            href={habitsPath}
            aria-current={isHabitsActive ? "page" : undefined}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 text-[10px] font-medium transition-colors ${
              isHabitsActive ? "text-primary-light dark:text-primary-dark" : "text-muted-foreground"
            }`}
          >
            <ClipboardCheck className={`size-5 ${isHabitsActive ? "fill-current" : ""}`} />
            <span>{t("habits")}</span>
          </Link>
        )}
      </div>
    </nav>
  );
}

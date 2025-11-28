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
    <nav className="border-border bg-background fixed bottom-0 left-0 right-0 z-50 border-t md:hidden">
      <div className="flex h-16 items-center justify-around">
        {/* ホーム */}
        <Link
          href={homePath}
          className={`flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors ${
            isHomeActive ? "text-primary-light dark:text-primary-dark" : "text-muted-foreground"
          }`}
        >
          <Home className={`size-6 ${isHomeActive ? "fill-current" : ""}`} />
          <span className="text-xs font-medium">{t("home")}</span>
        </Link>

        {/* 習慣 */}
        {currentUserUsername && (
          <Link
            href={habitsPath}
            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors ${
              isHabitsActive ? "text-primary-light dark:text-primary-dark" : "text-muted-foreground"
            }`}
          >
            <ClipboardCheck className={`size-6 ${isHabitsActive ? "fill-current" : ""}`} />
            <span className="text-xs font-medium">{t("habits")}</span>
          </Link>
        )}
      </div>
    </nav>
  );
}

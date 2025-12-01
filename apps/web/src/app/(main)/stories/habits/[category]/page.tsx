import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { Header } from "@/components/layout/header";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { createClient } from "@/lib/supabase/server";
import { HabitCategoryName } from "@/lib/types";
import { CATEGORY_ICONS } from "@/lib/categories";
import { getCurrentUserHabits } from "@/lib/utils/page-helpers";
import { fetchProfileByUsername } from "@/features/profiles/data/data";
import { getCurrentUserUsername } from "@/lib/utils/page-helpers";

import { StoryListInfinite } from "@/features/stories/ui/story-list-infinite";
import { StoriesTabHeader } from "@/features/stories/ui/stories-tab-header";
import { FollowingStoryList } from "@/features/stories/ui/following-story-list";
import { TimelineLanguageSelectorWrapper } from "@/components/layout/timeline-language-selector-wrapper";

// pathの[category]は小文字で保存されているので、元の形式に変換する関数
function capitalizeCategory(category: string): HabitCategoryName {
  const categoryMap: Record<string, HabitCategoryName> = {
    all: "All",
    game: "Game",
    tobacco: "Tobacco",
    shopping: "Shopping",
    drugs: "Drugs",
    overeating: "Overeating",
    porno: "Porno",
    sns: "SNS",
    gambling: "Gambling",
    caffeine: "Caffeine",
    "cosmetic-surgery": "Cosmetic Surgery",
    custom: "Custom",
    alcohol: "Alcohol",
    codependency: "Codependency",
    official: "Official",
  };

  const normalizedCategory = categoryMap[category.toLowerCase().replace(/%20/g, "-")] ?? notFound();
  return normalizedCategory;
}

type PageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function Page(props: PageProps) {
  const { category } = await props.params;
  const { tab } = await props.searchParams;
  if (!category) notFound();

  // ログイン状態を取得
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  const habitCategory = capitalizeCategory(category);

  // 翻訳を取得
  const tCategory = await getTranslations("categories");

  // カテゴリー名を翻訳から取得
  const categoryDisplayName = tCategory(habitCategory);

  // タブとフォームに必要なデータを取得
  const habits = await getCurrentUserHabits();

  const categoryPath = `/stories/habits/${category.toLowerCase()}`;

  // カテゴリアイコンを取得
  const CategoryIcon = CATEGORY_ICONS[habitCategory];

  // ヘッダー用のプロフィール情報
  const currentUserUsername = await getCurrentUserUsername();
  const currentUserProfile = currentUserUsername
    ? await fetchProfileByUsername(currentUserUsername)
    : null;

  return (
    <>
      <Header
        titleElement={
          !isLoggedIn ? (
            <div className="flex items-center gap-2">
              {CategoryIcon && <CategoryIcon className="size-4 stroke-[2.5px] text-green-800" />}
              <span className="font-medium">{categoryDisplayName}</span>
            </div>
          ) : undefined
        }
        hideTitle={!isLoggedIn ? { mobile: true } : undefined}
        currentUserProfile={currentUserProfile}
        rightElement={
          isLoggedIn ? (
            <div className="md:hidden">
              <TimelineLanguageSelectorWrapper />
            </div>
          ) : undefined
        }
      />

      {/* タブヘッダー */}
      <StoriesTabHeader
        categoryName={habitCategory}
        categoryDisplayName={categoryDisplayName}
        categoryPath={categoryPath}
        isLoggedIn={isLoggedIn}
      />

      {/* 投稿リスト */}
      <main className="p-3 sm:p-5">
        <Suspense fallback={<LoadingSpinner />}>
          <CategoryPageContent
            category={category}
            tab={tab}
            isLoggedIn={isLoggedIn}
            userId={user?.id}
            habits={habits}
          />
        </Suspense>
      </main>
    </>
  );
}

async function CategoryPageContent({
  category,
  tab,
  isLoggedIn,
  userId,
  habits,
}: {
  category: string;
  tab?: string;
  isLoggedIn: boolean;
  userId?: string;
  habits?: import("@/lib/types").HabitTileDto[];
}) {
  const habitCategory = capitalizeCategory(category);
  const currentTab = tab ?? "category";

  return (
    <>
      {currentTab === "following" && isLoggedIn ? (
        <FollowingStoryList habits={habits} currentUserId={userId} />
      ) : (
        <StoryListInfinite
          category={habitCategory}
          isLoggedIn={isLoggedIn}
          habits={habits}
          currentUserId={userId}
        />
      )}
    </>
  );
}

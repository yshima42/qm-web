import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { PageWithSidebar } from "@/components/layout/page-with-sidebar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { HabitsProvider } from "@/features/habits/providers/habits-provider";

import { CATEGORY_ICONS } from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";
import { HabitCategoryName, HabitTileDto } from "@/lib/types";

import { StoryListInfinite } from "@/features/stories/ui/story-list-infinite";
import { StoryModalProvider } from "@/features/stories/ui/story-modal-provider";
import { StoriesTabHeader } from "@/features/stories/ui/stories-tab-header";
import { FollowingStoryList } from "@/features/stories/ui/following-story-list";

// pathの[category]は小文字で保存されているので、元の形式に変換する関数
function capitalizeCategory(category: string): HabitCategoryName {
  const categoryMap: Record<string, HabitCategoryName> = {
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
  // Fetch user and habits for modal
  const { getCurrentUserHabits } = await import("@/lib/utils/page-helpers");

  const habits = await getCurrentUserHabits();

  return (
    <HabitsProvider habits={habits}>
      <StoryModalProvider habits={habits}>
        <Suspense fallback={<LoadingSpinner />}>
          <CategoryPageContent
            params={props.params}
            searchParams={props.searchParams}
            habits={habits}
          />
        </Suspense>
      </StoryModalProvider>
    </HabitsProvider>
  );
}

async function CategoryPageContent({
  params,
  searchParams,
  habits,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ tab?: string }>;
  habits: HabitTileDto[];
}) {
  const { category } = await params;
  const { tab } = await searchParams;
  if (!category) notFound();

  const habitCategory = capitalizeCategory(category);
  const currentTab = tab ?? "category";

  // 翻訳を取得
  const tCategory = await getTranslations("categories");

  // カテゴリー名を翻訳から取得
  const categoryDisplayName = tCategory(habitCategory);

  // カテゴリーアイコンを取得
  const CategoryIcon = CATEGORY_ICONS[habitCategory];

  // ログイン状態を取得
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  // 現在のユーザーのプロフィール情報を取得
  const { getCurrentUserProfile } = await import("@/lib/utils/page-helpers");
  const currentUserProfile = await getCurrentUserProfile();

  const categoryPath = `/stories/habits/${category.toLowerCase()}`;

  return (
    <PageWithSidebar
      headerProps={{
        title: categoryDisplayName,
        backUrl: "/stories",
        showBackButton: false,
        icon: <CategoryIcon className="size-4 stroke-[2.5px] text-green-800" />,
      }}
    >
      {/* タブヘッダー */}
      <StoriesTabHeader
        categoryName={habitCategory}
        categoryDisplayName={categoryDisplayName}
        categoryPath={categoryPath}
        isLoggedIn={isLoggedIn}
      />

      <main className="p-3 sm:p-5">
        {currentTab === "following" && isLoggedIn ? (
          <FollowingStoryList habits={habits} currentUserProfile={currentUserProfile} />
        ) : (
          <StoryListInfinite
            category={habitCategory}
            isLoggedIn={isLoggedIn}
            habits={habits}
            currentUserProfile={currentUserProfile}
          />
        )}
      </main>
    </PageWithSidebar>
  );
}

import { notFound } from "next/navigation";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getLocale, getTranslations } from "next-intl/server";

import { Header } from "@/components/layout/header";

import { getQueryClient } from "@/app/get-query-client";
import { createClient } from "@/lib/supabase/server";
import { HabitCategoryName } from "@/lib/types";
import { CATEGORY_ICONS } from "@/lib/categories";
import { getCurrentUserHabits } from "@/lib/utils/page-helpers";
import { fetchProfileByUsername } from "@/features/profiles/data/data";
import { getCurrentUserUsername } from "@/lib/utils/page-helpers";
import { prefetchStoriesInfinite } from "@/features/stories/data/prefetch";

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

  // 「カテゴリ」タブのみ、ストーリー1ページ目を SSR で prefetch して
  // HydrationBoundary 経由で CSR に渡す（CLS/LCP 改善のため）
  const currentTab = tab ?? "category";
  const shouldPrefetchStories = !(currentTab === "following" && isLoggedIn);

  const queryClient = getQueryClient();
  if (shouldPrefetchStories) {
    const locale = await getLocale();
    await prefetchStoriesInfinite(queryClient, {
      category: habitCategory,
      locale,
    });
  }

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
        <HydrationBoundary state={dehydrate(queryClient)}>
          {currentTab === "following" && isLoggedIn ? (
            <FollowingStoryList habits={habits} currentUserId={user?.id} />
          ) : (
            <StoryListInfinite
              category={habitCategory}
              isLoggedIn={isLoggedIn}
              habits={habits}
              currentUserId={user?.id}
            />
          )}
        </HydrationBoundary>
      </main>
    </>
  );
}

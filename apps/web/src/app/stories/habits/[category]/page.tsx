import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { PageWithSidebar } from "@/components/layout/page-with-sidebar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { createClient } from "@/lib/supabase/server";
import { HabitCategoryName } from "@/lib/types";

import { StoryListInfinite } from "@/features/stories/ui/story-list-infinite";
import { StoriesTabHeader } from "@/features/stories/ui/stories-tab-header";
import { FollowingStoryList } from "@/features/stories/ui/following-story-list";
import { StoryInlineForm } from "@/features/stories/ui/story-inline-form";

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

  // ログアウト時で「all」以外のカテゴリーにアクセスした場合は「all」にリダイレクト
  if (!isLoggedIn && category.toLowerCase() !== "all") {
    redirect("/stories/habits/all");
  }

  // タブとフォームに必要なデータを取得（Suspenseの外側）
  const { getCurrentUserProfile, getCurrentUserHabits } = await import("@/lib/utils/page-helpers");
  const currentUserProfile = await getCurrentUserProfile();
  const habits = await getCurrentUserHabits();

  const habitCategory = capitalizeCategory(category);
  const tCategory = await getTranslations("categories");
  const categoryDisplayName = tCategory(habitCategory);
  const categoryPath = `/stories/habits/${category.toLowerCase()}`;

  return (
    <PageWithSidebar>
      {/* タブヘッダー - Suspenseの外側、再描画されない */}
      <StoriesTabHeader
        categoryName={habitCategory}
        categoryDisplayName={categoryDisplayName}
        categoryPath={categoryPath}
        isLoggedIn={isLoggedIn}
      />

      {/* インライン投稿フォームと投稿リスト */}
      <main className="p-3 sm:p-5">
        {/* インライン投稿フォーム - Suspenseの外側、再描画されない */}
        {isLoggedIn && habits && habits.length > 0 && (
          <div className="mx-auto max-w-2xl">
            <StoryInlineForm
              habits={habits}
              currentUserProfile={currentUserProfile}
              defaultCategory={habitCategory !== "All" ? habitCategory : undefined}
            />
          </div>
        )}

        {/* 投稿リストのみSuspense内で更新 */}
        <Suspense fallback={<LoadingSpinner />}>
          <CategoryPageContent
            category={category}
            tab={tab}
            isLoggedIn={isLoggedIn}
            userId={user?.id}
          />
        </Suspense>
      </main>
    </PageWithSidebar>
  );
}

async function CategoryPageContent({
  category,
  tab,
  isLoggedIn,
  userId,
}: {
  category: string;
  tab?: string;
  isLoggedIn: boolean;
  userId?: string;
}) {
  const habitCategory = capitalizeCategory(category);
  const currentTab = tab ?? "category";

  return (
    <>
      {currentTab === "following" && isLoggedIn ? (
        <FollowingStoryList currentUserId={userId} />
      ) : (
        <StoryListInfinite
          category={habitCategory}
          isLoggedIn={isLoggedIn}
          currentUserId={userId}
        />
      )}
    </>
  );
}

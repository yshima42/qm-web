import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { PageWithSidebar } from "@/components/layout/page-with-sidebar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { CATEGORY_ICONS } from "@/lib/categories";
import { fetchStoriesByHabitCategoryName } from "@/features/stories/data/data";
import { HabitCategoryName, HabitTileDto } from "@/lib/types";

import { StoryList } from "@/features/stories/ui/story-list";
import { StoryModalProvider } from "@/features/stories/ui/story-modal-provider";

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

export default async function Page(props: { params: Promise<{ category: string }> }) {
  // Fetch user and habits for modal
  const { createClient } = await import("@/lib/supabase/server");
  const { fetchHabits } = await import("@/features/habits/data/data");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const habits = user ? await fetchHabits(user.id) : [];

  return (
    <StoryModalProvider habits={habits}>
      <Suspense fallback={<LoadingSpinner />}>
        <CategoryPageContent params={props.params} habits={habits} />
      </Suspense>
    </StoryModalProvider>
  );
}

async function CategoryPageContent({
  params,
  habits,
}: {
  params: Promise<{ category: string }>;
  habits: HabitTileDto[];
}) {
  const { category } = await params;
  if (!category) notFound();

  const habitCategory = capitalizeCategory(category);

  // 翻訳を取得
  const tCategory = await getTranslations("categories");

  // カテゴリー名を翻訳から取得
  const categoryDisplayName = tCategory(habitCategory);

  // カテゴリーアイコンを取得
  const CategoryIcon = CATEGORY_ICONS[habitCategory];

  return (
    <PageWithSidebar
      headerProps={{
        title: categoryDisplayName,
        backUrl: "/stories",
        showBackButton: false,
        icon: <CategoryIcon className="size-4 stroke-[2.5px] text-green-800" />,
      }}
    >
      <main className="p-3 sm:p-5">
        <Suspense fallback={<LoadingSpinner />}>
          <StoryList
            fetchStoriesFunc={() => fetchStoriesByHabitCategoryName(habitCategory)}
            habits={habits}
          />
        </Suspense>
      </main>
    </PageWithSidebar>
  );
}

import { Logo } from "@quitmate/ui";
import { Suspense } from "react";

import { PageWithSidebar } from "@/components/layout/page-with-sidebar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { HabitsProvider } from "@/features/habits/providers/habits-provider";
import { getCurrentUserHabits } from "@/lib/utils/page-helpers";

import { fetchArticles } from "@/features/articles/data/data";

import { ArticleList } from "@/features/articles/ui/article-list";

export default async function Page() {
  const habits = await getCurrentUserHabits();

  return (
    <HabitsProvider habits={habits}>
      <PageWithSidebar
        headerProps={{
          titleElement: (
            <div className="flex items-center">
              <Logo size="small" />
              <p className="ml-2 font-medium">Articles</p>
            </div>
          ),
        }}
      >
        <Suspense fallback={<LoadingSpinner fullHeight />}>
          <div className="p-3 sm:p-5">
            <ArticleList fetchArticlesFunc={fetchArticles} />
          </div>
        </Suspense>
      </PageWithSidebar>
    </HabitsProvider>
  );
}

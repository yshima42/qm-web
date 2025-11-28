import { Logo } from "@quitmate/ui";
import { Suspense } from "react";

import { Header } from "@/components/layout/header";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getCurrentUserUsername } from "@/lib/utils/page-helpers";
import { fetchProfileByUsername } from "@/features/profiles/data/data";

import { fetchArticles } from "@/features/articles/data/data";

import { ArticleList } from "@/features/articles/ui/article-list";

export default async function Page() {
  // ヘッダー用のプロフィール情報
  const currentUserUsername = await getCurrentUserUsername();
  const currentUserProfile = currentUserUsername
    ? await fetchProfileByUsername(currentUserUsername)
    : null;

  return (
    <>
      <Header
        titleElement={
          <div className="flex items-center">
            <Logo size="small" />
            <p className="ml-2 font-medium">Articles</p>
          </div>
        }
        currentUserProfile={currentUserProfile}
      />
      <Suspense fallback={<LoadingSpinner fullHeight />}>
        <div className="p-3 sm:p-5">
          <ArticleList fetchArticlesFunc={fetchArticles} />
        </div>
      </Suspense>
    </>
  );
}

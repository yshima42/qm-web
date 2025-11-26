import { Logo } from "@quitmate/ui";
import { Suspense } from "react";

import { Header } from "@/components/layout/header";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { fetchArticles } from "@/features/articles/data/data";

import { ArticleList } from "@/features/articles/ui/article-list";

export default function Page() {
  return (
    <>
      <Header
        titleElement={
          <div className="flex items-center">
            <Logo size="small" />
            <p className="ml-2 font-medium">Articles</p>
          </div>
        }
      />
      <Suspense fallback={<LoadingSpinner fullHeight />}>
        <div className="p-3 sm:p-5">
          <ArticleList fetchArticlesFunc={fetchArticles} />
        </div>
      </Suspense>
    </>
  );
}

import { Logo } from "@quitmate/ui";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PageWithSidebar } from "@/components/layout/page-with-sidebar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { HabitsProvider } from "@/features/habits/providers/habits-provider";
import { getCurrentUserHabits } from "@/lib/utils/page-helpers";

import { getCategoryDisplayName } from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";
import {
  fetchArticleById,
  fetchArticlePageStaticParams,
  fetchCommentsByArticleId,
  checkArticleIsLikedByMe,
} from "@/features/articles/data/data";

import { ArticleContent } from "@/features/articles/ui/article-content";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const article = await fetchArticleById(id);

  if (!article) {
    return {
      title: "Article not found",
    };
  }

  const categoryDisplayName = getCategoryDisplayName(
    article.habit_categories?.habit_category_name ?? "General",
    article.custom_habit_name,
  );

  const description = article.content.substring(0, 300) || "Article detail page";

  return {
    title: `${article.title} | ${categoryDisplayName}`,
    description: description,
    openGraph: {
      title: `${article.title} | ${article.profiles.display_name}`,
      description: description,
      type: "article",
      publishedTime: article.created_at,
      authors: [article.profiles.display_name],
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | ${article.profiles.display_name}`,
      description: description,
      creator: `@${article.profiles.user_name}`,
    },
  };
}

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const articles = await fetchArticlePageStaticParams(10);

    if (!Array.isArray(articles) || articles.length === 0) {
      console.log("No articles found or invalid data returned");
      return [];
    }

    return articles.map((article) => ({
      id: String(article.id),
      user_name: article.profiles.user_name,
    }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  // 並列でデータ取得
  const [article, comments, supabase] = await Promise.all([
    fetchArticleById(id),
    fetchCommentsByArticleId(id),
    createClient(),
  ]);

  if (!article) {
    notFound();
  }

  // ログイン状態を取得
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  // いいね状態を取得（ログイン時のみ）
  const isLikedByMe = isLoggedIn ? await checkArticleIsLikedByMe(id) : false;

  // articleにisLikedByMeを付与
  const articleWithLikeStatus = { ...article, isLikedByMe };

  const habits = isLoggedIn ? await getCurrentUserHabits() : [];

  return (
    <HabitsProvider habits={habits}>
      <PageWithSidebar
        headerProps={{
          titleElement: <Logo />,
        }}
      >
      <Suspense fallback={<LoadingSpinner fullHeight />}>
          <div className="h-14" />
      </Suspense>
      <ArticleContent article={articleWithLikeStatus} comments={comments} isLoggedIn={isLoggedIn} />
      </PageWithSidebar>
    </HabitsProvider>
  );
}

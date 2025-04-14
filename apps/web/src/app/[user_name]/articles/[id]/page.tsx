import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getCategoryDisplayName } from '@/lib/categories';
import {
  fetchArticleById,
  fetchArticlePageStaticParams,
  fetchCommentsByArticleId,
} from '@/lib/data';

import { ArticleContent } from '@/features/articles/article-content';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const article = await fetchArticleById(id);

  if (!article) {
    return {
      title: '記事が見つかりません',
    };
  }

  const categoryDisplayName = getCategoryDisplayName(
    article.habit_categories.habit_category_name,
    article.custom_habit_name,
  );

  const description = article.content.substring(0, 300) || '記事詳細ページです';

  return {
    title: `${article.title} | ${categoryDisplayName}`,
    description: description,
    openGraph: {
      title: `${article.title} | ${article.profiles.display_name}`,
      description: description,
      type: 'article',
      publishedTime: article.created_at,
      authors: [article.profiles.display_name],
    },
    twitter: {
      card: 'summary_large_image',
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
      console.log('No articles found or invalid data returned');
      return [];
    }

    return articles.map((article) => ({
      id: String(article.id),
      user_name: article.profiles.user_name,
    }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [article, comments] = await Promise.all([
    fetchArticleById(id),
    fetchCommentsByArticleId(id),
  ]);

  if (!article) {
    notFound();
  }

  return <ArticleContent article={article} comments={comments} />;
}

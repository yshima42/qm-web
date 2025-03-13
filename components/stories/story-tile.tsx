import { StoryTileDto } from "@/lib/types";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";

type Props = {
  story: StoryTileDto;
};

export function StoryTile({ story }: Props) {
  const createdAt = formatDistanceToNow(new Date(story.created_at), {
    addSuffix: true,
    locale: ja,
  });

  return (
    <Link
      href={`/stories/${story.id}`}
      className="block hover:bg-gray-50/50 transition-colors"
    >
      <div className="flex p-4 border-b border-gray-200">
        {/* アバター部分 */}
        <div className="mr-3">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            {story.profiles.avatar_url ? (
              <Image
                src={story.profiles.avatar_url}
                alt="プロフィール画像"
                width={48}
                height={48}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1">
          {/* ヘッダー */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold">{story.profiles.display_name}</span>
            <span className="text-sm text-gray-500">
              @{story.profiles.user_name}
            </span>
            <span className="text-sm text-gray-500">・</span>
            <span className="text-sm text-gray-500">{createdAt}</span>
          </div>

          {/* 習慣カテゴリーとカウント */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">
              {story.habit_categories.habit_category_name} -{" "}
              {story.trial_elapsed_days}日
            </span>
            {story.custom_habit_name && (
              <span className="text-sm text-gray-600">
                ({story.custom_habit_name})
              </span>
            )}
          </div>

          {/* 本文 */}
          <p className="mb-3 whitespace-pre-wrap">{story.content}</p>

          {/* アクション */}
          <div className="flex gap-6 text-gray-500">
            <div className="flex items-center gap-1">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="text-sm">{story.comments[0]?.count ?? 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="text-sm">{story.likes[0]?.count ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

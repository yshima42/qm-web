import { StoryLikeIcon, CommentIcon, Tag, DefaultAvatar } from '@quitmate/ui';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';

import { CATEGORY_DISPLAY_NAMES } from '@/lib/categories';
import { StoryTileDto, HabitCategoryName } from '@/lib/types';

type Props = {
  story: StoryTileDto;
};

export function StoryTile({ story }: Props) {
  const storyDate = new Date(story.created_at);
  const currentYear = new Date().getFullYear();
  const storyYear = storyDate.getFullYear();

  // 今年の場合は年を表示せず、そうでない場合は年を含める
  const dateFormat = storyYear === currentYear ? 'M/d H:mm' : 'yyyy/M/d H:mm';
  const createdAt = format(storyDate, dateFormat, {
    locale: ja,
  });

  // カテゴリー名を日本語に変換
  const categoryDisplayName =
    CATEGORY_DISPLAY_NAMES[story.habit_categories.habit_category_name as HabitCategoryName] ||
    story.habit_categories.habit_category_name;

  return (
    <div className="block border-b border-gray-300 dark:border-gray-700">
      <div className="flex px-0 py-4">
        {/* アバター部分 */}
        <div className="mr-3">
          <Link href={`/profiles/${story.user_id}`} className="block">
            <div className="size-12 overflow-hidden rounded-full">
              {story.profiles.avatar_url ? (
                <Image
                  src={story.profiles.avatar_url}
                  alt="プロフィール画像"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              ) : (
                <DefaultAvatar size="md" className="size-full bg-muted" />
              )}
            </div>
          </Link>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1">
          {/* ヘッダー */}
          <div className="mb-1 flex items-center gap-2">
            <Link href={`/profiles/${story.user_id}`} className="hover:underline">
              <span className="font-bold text-foreground">{story.profiles.display_name}</span>
            </Link>
            <Link href={`/profiles/${story.user_id}`} className="hover:underline">
              <span className="text-sm text-muted-foreground">@{story.profiles.user_name}</span>
            </Link>
            <span className="text-sm text-muted-foreground"> </span>
            <span className="text-sm text-muted-foreground">{createdAt}</span>
          </div>

          <Link href={`/stories/${story.id}`} className="block transition-colors hover:bg-accent/5">
            {/* 習慣カテゴリーとカウント - 日本語表示に修正 */}
            <div className="mb-2 flex items-center gap-2">
              <Tag>
                {categoryDisplayName} - {story.trial_elapsed_days}日
              </Tag>
              {story.custom_habit_name && (
                <span className="ml-2 text-sm text-secondary-foreground">
                  ({story.custom_habit_name})
                </span>
              )}
            </div>

            {/* 本文 */}
            <p className="mb-3 whitespace-pre-wrap text-foreground">{story.content}</p>

            {/* アクション */}
            <div className="flex gap-6 text-muted-foreground">
              <div className="flex items-center gap-1">
                <CommentIcon />
                <span className="text-sm">{story.comments[0]?.count ?? 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <StoryLikeIcon />
                <span className="text-sm">{story.likes[0]?.count ?? 0}</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

import { CommentIconWithDownload, StoryLikeIconWithDownload, Tag } from '@quitmate/ui';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Link from 'next/link';

import { getCategoryDisplayName } from '@/lib/categories';
import { StoryTileDto } from '@/lib/types';

import { UserAvatar } from '../profiles/user-avatar';

type Props = {
  story: StoryTileDto;
  disableLink?: boolean;
};

export function StoryTile({ story, disableLink = false }: Props) {
  const storyDate = new Date(story.created_at);
  const currentYear = new Date().getFullYear();
  const storyYear = storyDate.getFullYear();

  // 今年の場合は年を表示せず、そうでない場合は年を含める
  const dateFormat = storyYear === currentYear ? 'M/d H:mm' : 'yyyy/M/d H:mm';
  const createdAt = format(storyDate, dateFormat, {
    locale: ja,
  });

  // カテゴリー名を日本語に変換
  const categoryDisplayName = getCategoryDisplayName(
    story.habit_categories.habit_category_name,
    story.custom_habit_name,
  );

  // メインコンテンツの部分をラップするコンポーネント
  const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
    if (disableLink) {
      return <div className="block transition-colors">{children}</div>;
    }

    return (
      <Link
        href={`/${story.profiles.user_name}/stories/${story.id}`}
        className="block transition-colors hover:bg-accent/5"
      >
        {children}
      </Link>
    );
  };

  return (
    <div className="block border-b border-gray-300 dark:border-gray-700">
      <div className="flex px-0 py-4">
        {/* アバター部分 */}
        <div className="mr-3">
          <UserAvatar
            username={story.profiles.user_name}
            displayName={story.profiles.display_name}
            avatarUrl={story.profiles.avatar_url}
            size="md"
          />
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1">
          {/* ヘッダー */}
          <div className="mb-1 flex items-center gap-2">
            <Link href={`/${story.profiles.user_name}`} className="hover:underline">
              <span className="font-bold text-foreground">{story.profiles.display_name}</span>
            </Link>
            <Link href={`/${story.profiles.user_name}`} className="hover:underline">
              <span className="text-sm text-muted-foreground">@{story.profiles.user_name}</span>
            </Link>
            <span className="text-sm text-muted-foreground"> </span>
            <span className="text-sm text-muted-foreground">{createdAt}</span>
          </div>

          <ContentWrapper>
            {/* 習慣カテゴリーとカウント - 日本語表示に修正 */}
            <div className="mb-2 flex items-center gap-2">
              <Tag>
                {categoryDisplayName} - {story.trial_elapsed_days}日
              </Tag>
            </div>

            {/* 本文 */}
            <p className="mb-3 whitespace-pre-wrap text-foreground">{story.content}</p>
          </ContentWrapper>

          {/* アクション - ContentWrapperの外に移動 */}
          <div className="flex gap-6 text-muted-foreground">
            <div className="flex items-center gap-1">
              <CommentIconWithDownload />
              <span className="text-sm">{story.comments[0]?.count ?? 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <StoryLikeIconWithDownload />
              <span className="text-sm">{story.likes[0]?.count ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

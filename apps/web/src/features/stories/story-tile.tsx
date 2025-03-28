import { CommentIconWithDownload, StoryLikeIconWithDownload, Tag } from '@quitmate/ui';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';
import Link from 'next/link';

import { getCategoryDisplayName } from '@/lib/categories';
import { StoryTileDto } from '@/lib/types';

import { UserAvatar } from '../profiles/user-avatar';

type Props = {
  story: StoryTileDto;
  disableLink?: boolean;
  showFullContent?: boolean;
};

export function StoryTile({ story, disableLink = false, showFullContent = false }: Props) {
  // storyDateをUTC時間から東京時間に変換
  const storyDate = toZonedTime(new Date(story.created_at), 'Asia/Tokyo');
  const currentYear = new Date().getFullYear();
  const storyYear = storyDate.getFullYear();

  // 今日の日付を取得して東京時間に変換
  const today = toZonedTime(new Date(), 'Asia/Tokyo');
  const isToday =
    storyDate.getDate() === today.getDate() &&
    storyDate.getMonth() === today.getMonth() &&
    storyDate.getFullYear() === today.getFullYear();

  // 今日の場合は時間のみ、今年の場合は月日と時間、それ以外は年月日と時間を表示
  let dateFormat;
  if (isToday) {
    dateFormat = 'H:mm';
  } else if (storyYear === currentYear) {
    dateFormat = 'M/d H:mm';
  } else {
    dateFormat = 'yyyy/M/d H:mm';
  }

  const createdAt = format(storyDate, dateFormat, {
    locale: ja,
  });

  // カテゴリー名を日本語に変換
  const categoryDisplayName = getCategoryDisplayName(
    story.habit_categories.habit_category_name,
    story.custom_habit_name,
  );

  // 文章の長さ制限と「もっと見る」の表示ロジック
  const maxContentLength = 120;
  const isContentTruncated = !showFullContent && story.content.length > maxContentLength;
  const displayContent = isContentTruncated
    ? `${story.content.substring(0, maxContentLength)}...`
    : story.content;

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

            {/* 本文 - 省略表示対応 */}
            <p className="mb-3 whitespace-pre-wrap text-foreground">
              {displayContent}
              {/* 「もっと見る」ボタンの色をgreen-800に変更 */}
              {isContentTruncated && (
                <span className="ml-1 text-sm font-medium text-green-800 dark:text-green-500">
                  もっと見る
                </span>
              )}
            </p>
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

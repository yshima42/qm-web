'use client';

import { AutoLinkText, CommentIcon, StoryLikeIcon, AppDownloadDialogTrigger } from '@quitmate/ui';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { StoryTileDto } from '@/lib/types';

import { CategoryTag } from '../common/category-tag';
import { UserAvatar } from '../profiles/user-avatar';

type Props = {
  story: StoryTileDto;
  disableLink?: boolean;
  showFullContent?: boolean;
};

export function StoryTile({ story, disableLink = false, showFullContent = false }: Props) {
  const router = useRouter();

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

  const maxContentLength = 120;
  const isContentTruncated = !showFullContent && story.content.length > maxContentLength;
  const displayContent = isContentTruncated
    ? `${story.content.substring(0, maxContentLength)}...`
    : story.content;

  const handleClick = () => {
    if (!disableLink) {
      router.push(`/${story.profiles.user_name}/stories/${story.id}`);
    }
  };

  // リンクの伝播を止めるハンドラー
  const handleContentClick = (e: React.MouseEvent) => {
    // テキスト内のリンク（AutoLinkText内のa要素）がクリックされた場合のみ
    // イベントの伝播を停止する。それ以外はタイル全体のクリックを有効にする
    if ((e.target as HTMLElement).tagName === 'A') {
      e.stopPropagation();
    }
  };

  return (
    <div
      className="block cursor-pointer border-b border-gray-300 transition-colors hover:bg-accent/5 dark:border-gray-700"
      onClick={handleClick}
    >
      <div className="flex px-0 py-4">
        {/* アバター部分 */}
        <div
          className="mr-3"
          onClick={(e) => {
            e.stopPropagation();
            // ここでプロフィールページに遷移
            router.push(`/${story.profiles.user_name}`);
          }}
        >
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
          <div
            className="mb-1 flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Link href={`/${story.profiles.user_name}`} className="hover:underline">
              <span className="font-bold text-foreground">{story.profiles.display_name}</span>
            </Link>
            <Link href={`/${story.profiles.user_name}`} className="hover:underline">
              <span className="text-sm text-muted-foreground">@{story.profiles.user_name}</span>
            </Link>
            <span className="text-sm text-muted-foreground"> </span>
            <span className="text-sm text-muted-foreground">{createdAt}</span>
          </div>

          {/* クリック可能領域 - 全体がクリック可能になったので特別なクラスは不要 */}
          <div>
            {/* 習慣カテゴリーとカウント */}
            <div className="mb-2 flex items-center gap-2">
              <CategoryTag
                category={story.habit_categories.habit_category_name}
                customHabitName={story.custom_habit_name}
                elapsedDays={story.trial_elapsed_days}
              />
            </div>

            {/* 本文 - AutoLinkTextを使用 */}
            <div className="mb-3 whitespace-pre-wrap text-foreground" onClick={handleContentClick}>
              <AutoLinkText text={displayContent} />
              {isContentTruncated && (
                <span className="ml-1 cursor-pointer text-sm font-medium text-green-800 dark:text-green-500">
                  もっと見る
                </span>
              )}
            </div>
          </div>

          {/* アクション */}
          <div className="flex gap-6 text-muted-foreground">
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="inline-flex"
            >
              <AppDownloadDialogTrigger className="cursor-pointer">
                <div className="flex items-center gap-1">
                  <CommentIcon className="size-5" />
                  <span className="text-sm">{story.comments[0]?.count ?? 0}</span>
                </div>
              </AppDownloadDialogTrigger>
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="inline-flex"
            >
              <AppDownloadDialogTrigger className="cursor-pointer">
                <div className="flex items-center gap-1">
                  <StoryLikeIcon className="size-5" />
                  <span className="text-sm">{story.likes[0]?.count ?? 0}</span>
                </div>
              </AppDownloadDialogTrigger>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


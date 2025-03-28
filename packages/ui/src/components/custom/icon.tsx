import { IconWithDownloadDialog } from "./app-download-dialog";

type IconProps = {
  className?: string;
};

export function CommentIcon({ className = 'size-5' }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

export function StoryLikeIcon({ className = 'size-5' }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
      />
    </svg>
  );
}

export function ArticleLikeIcon({ className = 'size-5' }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}

// 既存のアイコンをラップする使用例
export function CommentIconWithDownload({ className = 'size-5' }: IconProps) {
  return (
    <IconWithDownloadDialog className="cursor-pointer">
      <CommentIcon className={className} />
    </IconWithDownloadDialog>
  );
}

export function StoryLikeIconWithDownload({ className = 'size-5' }: IconProps) {
  return (
    <IconWithDownloadDialog className="cursor-pointer">
      <StoryLikeIcon className={className} />
    </IconWithDownloadDialog>
  );
}

export function ArticleLikeIconWithDownload({ className = 'size-5' }: IconProps) {
  return (
    <IconWithDownloadDialog className="cursor-pointer">
      <ArticleLikeIcon className={className} />
    </IconWithDownloadDialog>
  );
}

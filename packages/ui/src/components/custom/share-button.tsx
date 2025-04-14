'use client';

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../ui/dialog';
import { 
  Share,
  Link2,
} from 'lucide-react';
import { XLogo } from './icon';
import { useTranslations } from 'next-intl';
type ShareButtonProps = {
  // シェアするURL（指定しない場合は現在のURLが使用される）
  url?: string;
  // シェアするコンテンツのタイトル
  title?: string;
  // シェア時のテキスト
  text?: string;
  // ダイアログのタイトル
  dialogTitle?: string;
  // 追加のCSSクラス
  className?: string;
};

export function ShareButton({ 
  url, 
  title,
  text, 
  dialogTitle = "シェアする", 
  className = ""
}: ShareButtonProps) {
  const t = useTranslations('ShareButton');
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // 共有URLの生成（クライアントサイドで現在のURLをデフォルトにする）
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = text || title || '';

  // リンクのコピー処理
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(`${t('copyLinkError')}:`, err);
    }
  };

  // 各SNSへのシェアURL
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className={`rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 ${className}`}>
          <Share className="size-[18px]" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={copyLink}
              className="flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <Link2 className="size-5" />
              <span>{copied ? t('copied') : t('copyLink')}</span>
            </button>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <a
              href={twitterShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <XLogo className="size-5" />
              <span>X（Twitter）</span>
            </a>
            
            <a
              href={lineShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <span className="text-[#06C755]">LINE</span>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';

import { EXTERNAL_URLS } from '@/lib/urls';

export default function Page() {
  // 開発環境ではリダイレクトしない
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="max-w-2xl space-y-4 text-center">
          <h1 className="text-4xl font-bold">QuitMate Web App</h1>
          <p className="text-lg text-muted-foreground">開発環境で実行中</p>
          <p className="text-sm text-muted-foreground">
            本番環境では{' '}
            <a
              href={EXTERNAL_URLS.LP}
              className="text-primary underline hover:no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {EXTERNAL_URLS.LP}
            </a>{' '}
            にリダイレクトされます
          </p>
        </div>
      </div>
    );
  }

  redirect(EXTERNAL_URLS.LP);
}

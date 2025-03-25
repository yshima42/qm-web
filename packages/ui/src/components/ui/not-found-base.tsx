import Link from 'next/link';

export type NotFoundBaseProps = {
  message: string;
  linkText: string;
  linkHref: string;
};

// ✅ 名前付きでエクスポート！
export function NotFoundBase({ message, linkText, linkHref }: NotFoundBaseProps) {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <h2 className="text-xl font-semibold">{message}</h2>
      <Link
        href={linkHref}
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        {linkText}
      </Link>
    </main>
  );
}

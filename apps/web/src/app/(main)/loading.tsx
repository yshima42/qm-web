import { LoadingSpinner } from "@/components/ui/loading-spinner";

/**
 * サイドバー付きページ用のローディング
 * サイドバーとヘッダーはlayout.tsxで維持されるため、
 * このローディングはコンテンツ部分のみに適用される
 */
export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center py-20">
      <LoadingSpinner />
    </div>
  );
}

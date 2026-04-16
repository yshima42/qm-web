import { QueryClient, defaultShouldDehydrateQuery, isServer } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSRではprefetchしているので、クライアントで再フェッチしない
        staleTime: 60 * 1000, // 1分間はstale状態にならない
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        // ストリーミング時に pending 状態のクエリも dehydrate する
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Next.js App Router 向けの QueryClient 取得関数。
 * - Server: 毎回新規作成（リクエスト間でデータがリークしないように）
 * - Browser: シングルトンを再利用（Suspense 中の再生成を防ぐ）
 *
 * @see https://tanstack.com/query/v5/docs/framework/react/examples/nextjs-app-prefetching
 */
export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

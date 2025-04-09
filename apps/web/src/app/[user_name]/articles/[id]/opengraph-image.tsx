import { ImageResponse } from 'next/og';

import { fetchArticleById } from '@/lib/data';

// Image metadata
export const alt = 'QuitMate Article';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image({ params }: { params: { id: string; user_name: string } }) {
  const article = await fetchArticleById(params.id);

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to right, #4ade80, #15803d)', // green400-green800
          padding: '4px', // 枠線の太さ
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: '#f0fdf4',
            padding: '32px',
          }}
        >
          {/* タイトルエリア（左上） */}
          <div
            style={{
              textAlign: 'left',
              color: 'white',
              fontSize: '36px',
              fontWeight: 'bold',
              maxWidth: '80%',
              lineHeight: 1.3,
            }}
          >
            {article?.title ?? 'タイトルが見つかりません'}
          </div>

          {/* フッターエリア */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              width: '100%',
            }}
          >
            {/* ユーザー情報（左下） */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {article?.profiles.avatar_url && (
                <img
                  src={article.profiles.avatar_url}
                  alt={article.profiles.display_name || '著者'}
                  width={40}
                  height={40}
                  style={{ borderRadius: '50%', marginRight: '10px' }}
                />
              )}
              <div
                style={{
                  color: 'white',
                  fontSize: '20px',
                }}
              >
                <div>@{article?.profiles.user_name ?? params.user_name}</div>
                <div>{article?.profiles.display_name ?? ''}</div>
              </div>
            </div>

            {/* アプリロゴ（右下） */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              {/* QuitMateロゴ部分 */}
              <svg
                width="30"
                height="30"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M35 85C15 75 5 55 5 35C5 20 15 5 35 5C55 5 65 20 65 35C65 50 55 65 35 65"
                  stroke="#4ade80"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M65 95C45 85 35 65 35 45C35 30 45 15 65 15C85 15 95 30 95 45C95 60 85 75 65 75"
                  stroke="#15803d"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
              </svg>
              <span style={{ marginLeft: '8px', fontSize: '24px' }}>QuitMate</span>
            </div>
          </div>
        </div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    },
  );
}

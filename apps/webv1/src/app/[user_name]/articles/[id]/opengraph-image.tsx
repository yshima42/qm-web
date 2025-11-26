import { ImageResponse } from 'next/og';

import { fetchArticleById } from '@/lib/data';

// Image metadata
export const alt = 'About Acme';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image({ params }: { params: { id: string } }) {
  const article = await fetchArticleById(params.id);
  const displayName = article?.profiles.display_name;
  const userAvatar = article?.profiles.avatar_url;

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
          background: 'linear-gradient(to right, #90D982, #2E6C28)', // より明るい緑から暗い緑へ
          padding: '48px', // 枠線をより太く
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'white', // 背景を白に変更
            padding: '48px 60px',
            borderRadius: '24px', // 内側の角も丸く
          }}
        >
          {/* タイトル部分 - 左上に配置 */}
          <div
            style={{
              fontSize: '64px',
              fontWeight: 'bolder',
              color: '#111827', // テキストを濃い色に
              lineHeight: 1.2,
              maxWidth: '80%',
            }}
          >
            {article?.title}
          </div>

          {/* 下部の情報エリア - 名前とQuitMate */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              width: '100%',
            }}
          >
            {/* 左下に名前 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              {userAvatar && (
                <img
                  src={userAvatar}
                  alt="User Avatar"
                  style={{ width: '56px', height: '56px', borderRadius: '50%' }}
                />
              )}
              <div
                style={{
                  fontSize: '46px',
                  fontWeight: 'bold',
                  color: '#374151', // ダークグレイ
                }}
              >
                {displayName}
              </div>
            </div>

            {/* 右下にQuitMate */}
            <img
              src="https://www.quitmate.app/images/text-logo.png"
              alt="QuitMate"
              style={{ height: '56px' }}
            />
            {/* <div
              style={{
                fontSize: '46px',
                fontWeight: 'bold',
                color: '#111827',
              }}
            >
              QuitMate
            </div> */}
          </div>
        </div>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
    },
  );
}

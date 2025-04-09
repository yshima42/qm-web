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
  const userName = article?.profiles.user_name;

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
          padding: '24px', // 枠線をさらに太く
          borderRadius: '0px', // 角丸なし
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
            borderRadius: '16px', // 内側の角は丸く
          }}
        >
          {/* タイトル部分 - 左上に配置 */}
          <div
            style={{
              fontSize: '56px', // フォントサイズ大きく
              fontWeight: '800', // より太く
              color: '#111827', // テキストを濃い色に
              lineHeight: 1.2,
              maxWidth: '90%', // 幅を広げる
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
            {/* 左下に名前とユーザーネーム */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div
                style={{
                  fontSize: '32px', // フォントサイズ大きく
                  fontWeight: '700', // より太く
                  color: '#374151', // ダークグレイ
                }}
              >
                {displayName}
              </div>
              <div
                style={{
                  fontSize: '22px',
                  color: '#6B7280', // ミディアムグレイ
                }}
              >
                @{userName}
              </div>
            </div>

            {/* 右下にQuitMate */}
            <div
              style={{
                fontSize: '36px', // フォントサイズ大きく
                fontWeight: '700', // より太く
                color: '#000000', // 黒に変更
              }}
            >
              QuitMate
            </div>
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

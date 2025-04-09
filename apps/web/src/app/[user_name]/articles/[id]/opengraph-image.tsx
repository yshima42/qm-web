import { ImageResponse } from 'next/og';

// 明示的に画像であることを宣言
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };
export const alt = '記事のOGP画像';

// エッジランタイムを使用
export const runtime = 'edge';

// 最もシンプルな実装
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          color: '#1f2937',
          fontSize: 64,
          fontWeight: 'bold',
        }}
      >
        <div style={{ marginBottom: 40 }}>QuitMate</div>
        <div
          style={{
            fontSize: 32,
            color: '#4CAF50',
          }}
        >
          記事をチェックしよう
        </div>
      </div>
    ),
    { ...size },
  );
}

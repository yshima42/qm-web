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
            background: '#f0fdf4', // 薄緑色背景 (green-50)
            padding: '48px 60px',
          }}
        >
          {article?.title}
          {displayName}
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

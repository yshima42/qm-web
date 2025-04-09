import { ImageResponse } from 'next/og';

import { getCategoryDisplayName } from '@/lib/categories';
import { fetchArticleById } from '@/lib/data';

// 画像のメタデータを設定
export const alt = '記事のOGP画像';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Nodeランタイムを明示的に使用
export const runtime = 'nodejs';

// OGP画像生成関数
export default async function Image({ params }: { params: { id: string; user_name: string } }) {
  try {
    // 記事データの取得
    const article = await fetchArticleById(params.id);

    if (!article) {
      // 記事が見つからない場合のフォールバック画像
      return new ImageResponse(
        (
          <div
            style={{
              display: 'flex',
              fontSize: 60,
              color: '#1f2937',
              background: 'white',
              width: '100%',
              height: '100%',
              padding: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            記事が見つかりません
          </div>
        ),
        { ...size },
      );
    }

    // カテゴリー名を取得
    const categoryDisplayName = getCategoryDisplayName(
      article.habit_categories.habit_category_name,
      article.custom_habit_name,
    );

    // カテゴリーの色（安全のためハードコード）
    const categoryColor = '#4CAF50'; // 緑色

    // OGP画像をJSXで構築（シンプルに）
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            padding: 50,
            color: '#1f2937',
          }}
        >
          {/* カテゴリータグ */}
          <div
            style={{
              display: 'inline-flex',
              padding: '6px 12px',
              backgroundColor: categoryColor,
              color: 'white',
              borderRadius: '16px',
              fontSize: 24,
              marginBottom: 20,
            }}
          >
            {categoryDisplayName}
          </div>

          {/* 記事タイトル */}
          <h1
            style={{
              fontSize: 60,
              fontWeight: 'bold',
              marginBottom: 30,
              maxWidth: 900,
            }}
          >
            {article.title}
          </h1>

          {/* ユーザー情報（画像なし） */}
          <div style={{ marginTop: 'auto', fontSize: '24px', fontWeight: 'medium' }}>
            {article.profiles.display_name}
          </div>

          {/* QuitMateテキスト */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              right: 50,
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#4CAF50',
            }}
          >
            QuitMate
          </div>
        </div>
      ),
      { ...size },
    );
  } catch (error) {
    // エラーが発生した場合のフォールバック
    console.error('OGP image generation error:', error);
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            fontSize: 60,
            color: '#1f2937',
            background: 'white',
            width: '100%',
            height: '100%',
            padding: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          QuitMate
        </div>
      ),
      { ...size },
    );
  }
}

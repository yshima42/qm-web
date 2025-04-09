import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

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

// カテゴリーに対応する色を取得
function getCategoryColor(categoryName: string): string {
  const colorMap: Record<string, string> = {
    smoking: '#3b82f6', // 青
    exercise: '#22c55e', // 緑
    meditation: '#eab308', // 黄
    reading: '#ec4899', // ピンク
    writing: '#8b5cf6', // 紫
    // その他のカテゴリー
  };

  return colorMap[categoryName] || '#4CAF50'; // デフォルトは緑
}

// OGP画像生成関数
export default async function Image({ params }: { params: { id: string; user_name: string } }) {
  const article = await fetchArticleById(params.id);

  const logoData = await readFile(join(process.cwd(), 'public/images/icon-web.png'));
  const logoSrc = `data:image/png;base64,${Buffer.from(logoData).toString('base64')}`;

  if (!article) {
    // 記事が見つからない場合のフォールバック画像
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            fontSize: 60,
            color: '#1f2937',
            background: 'linear-gradient(to bottom right, #ffffff, #f0f9f0)',
            width: '100%',
            height: '100%',
            padding: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          記事が見つかりません
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              right: 50,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <img src={logoSrc} width="50" height="50" alt="QuitMate" />
            <span
              style={{
                marginLeft: '10px',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#4CAF50',
              }}
            >
              QuitMate
            </span>
          </div>
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

  // カテゴリーに基づいた色を取得
  const categoryColor = getCategoryColor(article.habit_categories.habit_category_name);

  // カテゴリーの色の薄いバージョンを背景に使用
  const lightCategoryColor = categoryColor.replace(')', ', 0.05)').replace('rgb', 'rgba');

  // OGP画像をJSXで構築
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
          background: `linear-gradient(to bottom right, #ffffff, ${lightCategoryColor})`,
          padding: 50,
          color: '#1f2937',
        }}
      >
        {/* カテゴリータグ - カテゴリー色を使用 */}
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

        {/* ユーザー情報 */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto' }}>
          {article.profiles.avatar_url && (
            <img
              src={article.profiles.avatar_url}
              width="60"
              height="60"
              style={{
                borderRadius: '50%',
                marginRight: '15px',
                border: '2px solid white',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              }}
              alt={article.profiles.display_name}
            />
          )}
          <div style={{ fontSize: '24px', fontWeight: 'medium' }}>
            {article.profiles.display_name}
          </div>
        </div>

        {/* QuitMateロゴと文字 */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 50,
            display: 'flex',
            alignItems: 'center',
            filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.1))',
          }}
        >
          <img src={logoSrc} width="40" height="40" alt="QuitMate" />
          <span
            style={{
              marginLeft: '10px',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#4CAF50',
            }}
          >
            QuitMate
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}

/**
 * 文字数をカウントする（マルチバイト文字は2文字としてカウント）
 * @param text カウントするテキスト
 * @returns 文字数
 */
export function countCharacters(text: string): number {
  let count = 0;
  for (const char of text) {
    // マルチバイト文字（日本語、絵文字など）かチェック
    const code = char.charCodeAt(0);
    if (code > 0x7f) {
      count += 2; // マルチバイト文字は2文字としてカウント
    } else {
      count += 1; // ASCII文字は1文字としてカウント
    }
  }
  return count;
}

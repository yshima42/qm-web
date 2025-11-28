/**
 * 報告可能なアイテムのタイプ
 */
export enum ReportType {
  /** ストーリー */
  story = "story",
  /** コメント */
  comment = "comment",
  /** ユーザー */
  user = "user",
  /** 記事 */
  article = "article",
  /** 記事コメント */
  articleComment = "articleComment",
}

/**
 * 報告DTO
 * @property type - 報告タイプ
 * @property itemId - 報告対象のアイテムID
 */
export type ReportDTO = {
  type: ReportType;
  itemId: string;
};

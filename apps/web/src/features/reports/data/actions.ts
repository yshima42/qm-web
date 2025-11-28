"use server";

import { createClient } from "@/lib/supabase/server";
import type { ReportDTO } from "../domain/report-dto";
import { ReportType } from "../domain/report-dto";

/**
 * 報告操作の結果型
 */
export type ReportResult = {
  success: boolean;
  error?: string;
};

/**
 * 報告タイプに応じたデータベースのキーを取得する
 * @param type 報告タイプ
 * @returns データベースのカラム名
 */
function getReportKey(type: ReportType): string {
  switch (type) {
    case ReportType.story:
      return "story_id";
    case ReportType.comment:
      return "comment_id";
    case ReportType.user:
      return "profile_id";
    case ReportType.article:
      return "article_id";
    case ReportType.articleComment:
      return "article_comment_id";
  }
}

/**
 * アイテムを報告する
 * @param reportDTO 報告DTO
 * @returns 報告結果
 */
export async function reportItem(reportDTO: ReportDTO): Promise<ReportResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const key = getReportKey(reportDTO.type);

  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    [key]: reportDTO.itemId,
  });

  if (error) {
    console.error("[reportItem] Error:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

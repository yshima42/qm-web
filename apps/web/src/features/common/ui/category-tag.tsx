import { Tag } from "@quitmate/ui";
import { useTranslations } from "next-intl";

type Props = {
  category: string;
  customHabitName?: string | null;
  elapsedDays?: number;
  isReason?: boolean;
  tags?: { tags: { name: string } }[];
};

export function CategoryTag({ category, customHabitName, elapsedDays, isReason, tags }: Props) {
  const t = useTranslations("category-tag");
  const tCategory = useTranslations("categories");

  // resetタグがあるかチェック
  const hasResetTag = tags?.some((st) => st.tags.name === "reset") ?? false;

  return (
    <>
      <Tag>
        {category === "Custom" ? customHabitName || tCategory("Custom") : tCategory(category)}{" "}
        {elapsedDays != null ? `- ${elapsedDays.toString()}${t("days")}` : ""}
      </Tag>
      {isReason && <Tag>{t("reasonTag")}</Tag>}
      {hasResetTag && <Tag>{t("resetTag")}</Tag>}
    </>
  );
}

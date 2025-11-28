import { Tag } from "@quitmate/ui";
import { useTranslations } from "next-intl";

type Props = {
  category: string;
  customHabitName?: string | null;
  elapsedDays?: number;
  isReason?: boolean;
};

export function CategoryTag({ category, customHabitName, elapsedDays, isReason }: Props) {
  const t = useTranslations("category-tag");
  const tCategory = useTranslations("categories");
  return (
    <>
      <Tag>
        {category === "Custom" ? customHabitName || tCategory("Custom") : tCategory(category)}{" "}
        {elapsedDays != null ? `- ${elapsedDays.toString()}${t("days")}` : ""}
      </Tag>
      {isReason && <Tag>{t("reasonTag")}</Tag>}
    </>
  );
}

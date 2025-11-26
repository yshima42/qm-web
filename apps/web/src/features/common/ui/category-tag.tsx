import { Tag } from "@quitmate/ui";
import { useTranslations } from "next-intl";

type Props = {
  category: string;
  customHabitName?: string | null;
  elapsedDays?: number;
};

export function CategoryTag({ category, customHabitName, elapsedDays }: Props) {
  const t = useTranslations("category-tag");
  const tCategory = useTranslations("categories");
  return (
    <Tag>
      {category === "Custom" ? customHabitName || tCategory("Custom") : tCategory(category)}{" "}
      {elapsedDays != null ? `- ${elapsedDays.toString()}${t("days")}` : ""}
    </Tag>
  );
}

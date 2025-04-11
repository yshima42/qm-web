import { NotFoundBase } from "@quitmate/ui";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("not-found");

  return (
    <NotFoundBase
      message={t("message")}
      linkText={t("link-text")}
      linkHref="/"
    />
  );
}

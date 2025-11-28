"use client";

import { useEffect, useState } from "react";

import { useLocale, useTranslations } from "next-intl";

import LocaleSwitcherSelect from "./locale-switcher-select";

export default function LocaleSwitcher() {
  const t = useTranslations("locale-switcher");
  const locale = useLocale();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="bg-muted h-9 w-20 rounded-full" />;
  }

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      items={[
        {
          value: "en",
          label: t("en"),
        },
        {
          value: "ja",
          label: t("ja"),
        },
      ]}
      label={t("label")}
    />
  );
}

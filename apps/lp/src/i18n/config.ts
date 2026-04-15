export const locales = ["en", "ja"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** namespace一覧（各mate LP用） */
export const namespaces = ["alcohol", "kinshu", "porn", "tobacco"] as const;
export type Namespace = (typeof namespaces)[number];

/** namespaceからURLパスへのマッピング */
export const namespaceToPath: Record<Namespace, string> = {
  alcohol: "challenge",
  kinshu: "alcohol",
  porn: "porn",
  tobacco: "tobacco",
};

/** URLパスからnamespaceへのマッピング */
export const pathToNamespace: Record<string, Namespace> = {
  challenge: "alcohol",
  alcohol: "kinshu",
  porn: "porn",
  tobacco: "tobacco",
};

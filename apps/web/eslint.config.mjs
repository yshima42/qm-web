import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["*.ts", "*.tsx"], // 読み込むファイル
  },
  {
    ignores: ["**/.next/**/*", "*.config.mjs", ".pnp.*"], // 無視するファイル
  },
];

export default eslintConfig;

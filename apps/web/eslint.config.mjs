import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: ["**/.next/**/*", "*.config.mjs", ".pnp.*"],
  },
];

export default eslintConfig;

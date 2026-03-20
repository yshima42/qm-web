import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: [
      "**/.next/**/*",
      "*.config.mjs",
      ".pnp.*",
      "apps/webv1/**/*",
      "node_modules/**/*",
    ],
  },
];

export default eslintConfig;
